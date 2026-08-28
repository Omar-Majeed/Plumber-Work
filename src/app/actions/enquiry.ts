"use server";

import { headers } from "next/headers";
import { enquirySchema } from "@/lib/form-schema";
import type { EnquiryState, FieldErrors } from "@/lib/enquiry-state";
import { getDeliveryAdapter, isDeliveryConfigured } from "@/lib/enquiry-delivery";
import { checkRateLimit } from "@/lib/rate-limit";
import { isDemoStage } from "@/lib/site-config";

/** Guards against oversized payloads before any parsing work is done. */
const MAX_PAYLOAD_BYTES = 8 * 1024;

/**
 * Server boundary for the callback enquiry.
 *
 * Rules enforced here:
 *  - every field is validated server-side, regardless of client validation;
 *  - no personal information is ever logged, returned in a URL, or attached to
 *    an error message;
 *  - in the demo stage nothing is transmitted and the response says so;
 *  - in production, an unconfigured or failing provider returns an honest
 *    error — never a false success.
 */
export async function submitEnquiry(
  _previousState: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const requestHeaders = await headers();

  const contentLength = Number(requestHeaders.get("content-length") ?? 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return {
      status: "error",
      message:
        "That enquiry is too large to process. Please shorten it and try again.",
      fieldErrors: {},
    };
  }

  const clientKey =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(clientKey).allowed) {
    return {
      status: "error",
      message: `Too many enquiries from this connection. Please wait a moment, or call the business directly.`,
      fieldErrors: {},
    };
  }

  const raw = {
    company: String(formData.get("company") ?? ""),
    service: String(formData.get("service") ?? ""),
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    preferredTime: String(formData.get("preferredTime") ?? ""),
    message: String(formData.get("message") ?? ""),
    privacy: formData.get("privacy") === "on" ? ("on" as const) : "",
  };

  // Honeypot: a filled field means an automated submission. Fail quietly.
  if (raw.company.length > 0) {
    return {
      status: "error",
      message:
        "This enquiry could not be processed. Please call the business directly.",
      fieldErrors: {},
    };
  }

  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof FieldErrors] = issue.message;
      }
    }
    return {
      status: "invalid",
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  if (isDemoStage) {
    // Demo stage: nothing leaves the server. Never imply the business got this.
    return {
      status: "demo",
      message: "Demo only — this enquiry has not been sent.",
      fieldErrors: {},
    };
  }

  if (!isDeliveryConfigured()) {
    return {
      status: "error",
      message:
        "Enquiry delivery is not configured yet, so this message was not sent. Please call the business directly.",
      fieldErrors: {},
    };
  }

  const outcome = await getDeliveryAdapter().send(parsed.data);

  if (!outcome.ok) {
    return {
      status: "error",
      message:
        "This enquiry could not be delivered. Please call the business directly.",
      fieldErrors: {},
    };
  }

  return {
    status: "sent",
    message: "Thanks — your enquiry has been sent.",
    fieldErrors: {},
  };
}

/**
 * Client-safe enquiry constants and types.
 *
 * Kept separate from `form-schema.ts` so the browser bundle does not pull in
 * Zod: the client only needs these literals, while validation runs on the
 * server (and, for types, at compile time).
 */

export interface FieldErrors {
  service?: string;
  name?: string;
  phone?: string;
  email?: string;
  suburb?: string;
  preferredTime?: string;
  message?: string;
  privacy?: string;
  company?: string;
}

export interface EnquiryState {
  readonly status: "idle" | "invalid" | "demo" | "sent" | "error";
  readonly message: string;
  readonly fieldErrors: FieldErrors;
}

export const initialEnquiryState: EnquiryState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export const preferredTimeOptions = [
  { value: "", label: "No preference" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "anytime", label: "Any time" },
] as const;

import { z } from "zod";
import { services } from "@/content/services";

export type { EnquiryState, FieldErrors } from "@/lib/enquiry-state";
export { initialEnquiryState, preferredTimeOptions } from "@/lib/enquiry-state";

/**
 * Enquiry schema. Shared by the client form and the server boundary so that
 * validation cannot drift between the two.
 */

const serviceSlugs = services.map((service) => service.slug);

/**
 * Australian telephone input.
 *
 * Deliberately permissive about presentation so that legitimate landline
 * formats — "(07) 4922 4351", "07 4922 4351", "+61 7 4922 4351" — are all
 * accepted. Only the digit count and leading pattern are enforced.
 */
export function normaliseAustralianPhone(input: string): string {
  const trimmed = input.trim().replace(/[\s()\-.]/g, "");
  if (trimmed.startsWith("+61")) return `+61${trimmed.slice(3).replace(/^0/, "")}`;
  if (trimmed.startsWith("0061")) return `+61${trimmed.slice(4).replace(/^0/, "")}`;
  return trimmed;
}

export function isValidAustralianPhone(input: string): boolean {
  const value = normaliseAustralianPhone(input);
  // +61 followed by 9 digits (landline area code or mobile without the 0).
  if (/^\+61[2-478]\d{8}$/.test(value)) return true;
  // Domestic form: 0 + area/mobile prefix + 8 digits.
  if (/^0[2-478]\d{8}$/.test(value)) return true;
  // 13/1300/1800 service numbers.
  if (/^13\d{4}$/.test(value)) return true;
  if (/^1(300|800)\d{6}$/.test(value)) return true;
  return false;
}

export const enquirySchema = z.object({
  /** Honeypot — must stay empty. Never rendered to assistive technology. */
  company: z.string().max(0, "This field must be left empty.").optional(),

  service: z
    .string()
    .refine(
      (value) => value === "other" || serviceSlugs.includes(value),
      "Choose what the enquiry is about.",
    ),

  name: z
    .string()
    .trim()
    .min(2, "Enter your name.")
    .max(80, "Name must be 80 characters or fewer."),

  phone: z
    .string()
    .trim()
    .min(1, "Enter a phone number so the business can call you back.")
    .refine(
      isValidAustralianPhone,
      "Enter a valid Australian phone number, for example (07) 4922 4351.",
    ),

  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email address.")])
    .optional(),

  suburb: z
    .string()
    .trim()
    .min(2, "Enter your suburb or postcode.")
    .max(80, "Suburb or postcode must be 80 characters or fewer.")
    .refine(
      (value) => !/^\d+$/.test(value) || /^\d{4}$/.test(value),
      "An Australian postcode is four digits, for example 4700.",
    ),

  preferredTime: z.enum(["", "morning", "afternoon", "anytime"]).optional(),

  message: z
    .string()
    .trim()
    .max(1200, "Message must be 1200 characters or fewer.")
    .optional(),

  privacy: z
    .literal("on", {
      message: "Please acknowledge how your details will be used.",
    })
    .or(z.literal(true)),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryValues = z.output<typeof enquirySchema>;

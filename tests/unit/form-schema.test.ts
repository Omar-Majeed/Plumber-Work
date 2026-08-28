import { describe, expect, it } from "vitest";
import {
  enquirySchema,
  isValidAustralianPhone,
  normaliseAustralianPhone,
} from "@/lib/form-schema";

const validBase = {
  service: "blocked-drains",
  name: "Sam Taylor",
  phone: "(07) 4922 4351",
  suburb: "Rockhampton City",
  privacy: "on" as const,
};

describe("Australian phone handling", () => {
  it.each([
    "(07) 4922 4351",
    "07 4922 4351",
    "0749224351",
    "+61 7 4922 4351",
    "+61749224351",
    "0412 345 678",
    "1300 123 456",
  ])("accepts %s", (input) => {
    expect(isValidAustralianPhone(input)).toBe(true);
  });

  it.each(["123", "abc", "07 4922", "0000"])("rejects %s", (input) => {
    expect(isValidAustralianPhone(input)).toBe(false);
  });

  it("normalises international prefixes", () => {
    expect(normaliseAustralianPhone("+61 (0)7 4922 4351")).toBe("+61749224351");
    expect(normaliseAustralianPhone("0061 7 4922 4351")).toBe("+61749224351");
  });
});

describe("enquiry schema", () => {
  it("accepts a complete valid enquiry", () => {
    expect(enquirySchema.safeParse(validBase).success).toBe(true);
  });

  it("accepts a four-digit postcode in the suburb field", () => {
    expect(enquirySchema.safeParse({ ...validBase, suburb: "4700" }).success).toBe(
      true,
    );
  });

  it("rejects a numeric suburb that is not a postcode", () => {
    expect(enquirySchema.safeParse({ ...validBase, suburb: "470" }).success).toBe(
      false,
    );
  });

  it("requires the privacy acknowledgement", () => {
    expect(enquirySchema.safeParse({ ...validBase, privacy: "" }).success).toBe(
      false,
    );
  });

  it("rejects an unknown service", () => {
    expect(enquirySchema.safeParse({ ...validBase, service: "nope" }).success).toBe(
      false,
    );
  });

  it("rejects a filled honeypot", () => {
    expect(enquirySchema.safeParse({ ...validBase, company: "spam" }).success).toBe(
      false,
    );
  });
});

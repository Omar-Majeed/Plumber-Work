import { describe, expect, it } from "vitest";
import {
  allContentFacts,
  formatValidationReport,
  validateContent,
} from "@/lib/content-validation";
import { confirmedFact, proposedFact } from "@/lib/content-facts";

describe("content validation gate", () => {
  it("never blocks the demo stage", () => {
    const result = validateContent("demo");
    expect(result.ok).toBe(true);
    expect(result.blocking.length).toBeGreaterThan(0);
  });

  it("blocks production while proposed services are unconfirmed", () => {
    const result = validateContent("production");
    expect(result.ok).toBe(false);
    expect(result.blocking.some((fact) => fact.id.startsWith("service."))).toBe(
      true,
    );
  });

  it("names every blocking item in the report", () => {
    const report = formatValidationReport(validateContent("production"));
    for (const fact of validateContent("production").blocking) {
      expect(report).toContain(fact.id);
    }
  });

  it("passes production once every production-visible fact is confirmed", () => {
    const facts = [
      confirmedFact({
        id: "test.confirmed",
        label: "Confirmed and visible",
        category: "identity",
        value: "yes",
        source: "test",
        productionVisible: true,
        affects: ["/"],
      }),
      proposedFact({
        id: "test.internal",
        label: "Pending but not rendered",
        category: "identity",
        value: null,
        source: "test",
        productionVisible: false,
        affects: ["/"],
      }),
    ];

    const result = validateContent("production", facts);
    expect(result.ok).toBe(true);
    expect(result.pendingNonBlocking).toHaveLength(1);
  });

  it("tracks every business and service fact", () => {
    expect(allContentFacts.length).toBeGreaterThan(20);
    expect(
      allContentFacts.every((fact) => fact.id.length > 0 && fact.source.length > 0),
    ).toBe(true);
  });
});

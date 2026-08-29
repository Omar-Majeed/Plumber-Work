import { describe, expect, it } from "vitest";
import {
  allContentFacts,
  formatValidationReport,
  validateContent,
} from "@/lib/content-validation";
import { confirmedFact, proposedFact } from "@/lib/content-facts";

describe("content validation gate", () => {
  it("never blocks the demo stage", () => {
    expect(validateContent("demo").ok).toBe(true);
  });

  /**
   * The production invariant. Every claim the site publishes must be confirmed:
   * if this fails, something unverified has been put in front of a visitor.
   */
  it("passes production with the project's real content", () => {
    const result = validateContent("production");
    expect(result.blocking).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("still blocks production when a visible fact is unconfirmed", () => {
    const result = validateContent("production", [
      ...allContentFacts,
      proposedFact({
        id: "test.visible-and-unconfirmed",
        label: "Rendered to visitors but not signed off",
        category: "availability",
        value: "Open 24 hours",
        source: "test",
        productionVisible: true,
        affects: ["/"],
      }),
    ]);
    expect(result.ok).toBe(false);
    expect(result.blocking.map((fact) => fact.id)).toContain(
      "test.visible-and-unconfirmed",
    );
  });

  it("keeps outstanding items visible without blocking the release", () => {
    const result = validateContent("production");
    expect(result.pendingNonBlocking.length).toBeGreaterThan(0);
    expect(result.pendingNonBlocking.every((fact) => !fact.productionVisible)).toBe(
      true,
    );
  });

  it("names every blocking item in the report", () => {
    const blocked = validateContent("production", [
      proposedFact({
        id: "test.blocking",
        label: "Visible and unconfirmed",
        category: "pricing",
        value: "Fixed price",
        source: "test",
        productionVisible: true,
        affects: ["/"],
      }),
    ]);
    const report = formatValidationReport(blocked);
    for (const fact of blocked.blocking) {
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
    expect(allContentFacts.length).toBeGreaterThan(10);
    expect(
      allContentFacts.every((fact) => fact.id.length > 0 && fact.source.length > 0),
    ).toBe(true);
  });
});

import { businessFacts } from "@/content/business";
import { serviceFacts } from "@/content/services";
import { isBlockingInProduction, type ContentFact } from "@/lib/content-facts";
import type { SiteStage } from "@/lib/site-config";

/** Every content fact in the project, in checklist order. */
export const allContentFacts: readonly ContentFact<unknown>[] = [
  ...businessFacts,
  ...serviceFacts,
];

export interface ContentValidationResult {
  readonly stage: SiteStage;
  readonly ok: boolean;
  readonly total: number;
  readonly confirmed: number;
  /** Facts that must be confirmed before a production release. */
  readonly blocking: readonly ContentFact<unknown>[];
  /** Facts still pending but not rendered as production-visible claims. */
  readonly pendingNonBlocking: readonly ContentFact<unknown>[];
}

export function validateContent(
  stage: SiteStage,
  facts: readonly ContentFact<unknown>[] = allContentFacts,
): ContentValidationResult {
  const blocking = facts.filter(isBlockingInProduction);
  const pendingNonBlocking = facts.filter(
    (fact) => fact.requiresConfirmation && !fact.productionVisible,
  );

  return {
    stage,
    // The demo stage never fails: unconfirmed content is the point of a demo.
    ok: stage === "demo" ? true : blocking.length === 0,
    total: facts.length,
    confirmed: facts.filter((fact) => fact.verified).length,
    blocking,
    pendingNonBlocking,
  };
}

export function formatValidationReport(result: ContentValidationResult): string {
  const lines: string[] = [
    `Content validation — stage: ${result.stage}`,
    `Facts tracked: ${result.total} | confirmed: ${result.confirmed} | awaiting confirmation: ${
      result.total - result.confirmed
    }`,
  ];

  if (result.stage === "demo") {
    lines.push(
      "",
      "Demo stage: unconfirmed content is permitted and the build is not blocked.",
      `Production-visible items that WOULD block a production release: ${result.blocking.length}`,
    );
    return lines.join("\n");
  }

  if (result.ok) {
    lines.push("", "All production-visible content is confirmed.");
    return lines.join("\n");
  }

  lines.push(
    "",
    `Blocked: ${result.blocking.length} production-visible item(s) still require client confirmation.`,
    "",
  );

  for (const fact of result.blocking) {
    lines.push(
      `  • [${fact.id}] ${fact.label}`,
      `      needs: ${fact.source}`,
      `      affects: ${fact.affects.join(", ")}`,
    );
  }

  lines.push(
    "",
    "Confirm each item, set it to confirmedFact() in src/content, and tick it off",
    "in CONTENT_CONFIRMATION.md before releasing with SITE_STAGE=production.",
  );

  return lines.join("\n");
}

/**
 * Content-fact primitives.
 *
 * Every business claim rendered anywhere on this site must exist as a
 * `ContentFact` so that its provenance is auditable and so that the
 * production build can refuse to ship unconfirmed material.
 *
 * This module deliberately imports nothing from `src/content` — the content
 * modules depend on it, not the other way around.
 */

export type FactCategory =
  | "identity"
  | "contact"
  | "location"
  | "credentials"
  | "availability"
  | "pricing"
  | "service"
  | "social-proof"
  | "asset";

export interface ContentFact<TValue = string> {
  /** Stable identifier, used by the validation report and the checklist. */
  readonly id: string;
  /** Human-readable description for the confirmation checklist. */
  readonly label: string;
  readonly category: FactCategory;
  readonly value: TValue;
  /** True only when the value comes from a confirmed source. */
  readonly verified: boolean;
  /** Where the value came from, or what is needed to confirm it. */
  readonly source: string;
  /** True while the client has not signed the value off for publication. */
  readonly requiresConfirmation: boolean;
  /**
   * True when the value is rendered in page content that a visitor sees in
   * production. Internal-only notes set this to false so they do not block a
   * release.
   */
  readonly productionVisible: boolean;
  /** Pages or components affected if the value changes. */
  readonly affects: readonly string[];
}

/** A fact confirmed against a source and cleared for publication. */
export function confirmedFact<TValue>(
  input: Omit<ContentFact<TValue>, "verified" | "requiresConfirmation">,
): ContentFact<TValue> {
  return { ...input, verified: true, requiresConfirmation: false };
}

/** A proposed value that must be confirmed by the client before launch. */
export function proposedFact<TValue>(
  input: Omit<ContentFact<TValue>, "verified" | "requiresConfirmation">,
): ContentFact<TValue> {
  return { ...input, verified: false, requiresConfirmation: true };
}

export function isBlockingInProduction(fact: ContentFact<unknown>): boolean {
  return fact.requiresConfirmation && fact.productionVisible;
}

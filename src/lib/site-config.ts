/**
 * Site-wide configuration derived from the environment.
 *
 * `SITE_STAGE` is a server-only variable: it is read in server components,
 * server actions and the build-time validation script. It is never exposed to
 * the browser bundle.
 */

export type SiteStage = "demo" | "production";

function readStage(): SiteStage {
  return process.env.SITE_STAGE === "production" ? "production" : "demo";
}

export const siteStage: SiteStage = readStage();
export const isProductionStage = siteStage === "production";
export const isDemoStage = siteStage === "demo";

/** Canonical origin. Every canonical/OG/sitemap URL derives from this value. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The concept ribbon is opt-IN through configuration and never shown once the
 * site is running in the production stage. It is off by default so the demo
 * presents as a finished site; set NEXT_PUBLIC_SHOW_DEMO_BANNER=true while
 * reviewing to surface the "pending client confirmation" note.
 */
export const showDemoRibbon =
  process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === "true" && !isProductionStage;

/** Outbound delivery provider for enquiry submissions. */
export const contactDeliveryProvider =
  process.env.CONTACT_DELIVERY_PROVIDER ?? "disabled";

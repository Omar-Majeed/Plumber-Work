/**
 * Site-wide configuration derived from the environment.
 *
 * `SITE_STAGE` is a server-only variable: it is read in server components,
 * server actions and the build-time validation script. It is never exposed to
 * the browser bundle.
 */

export type SiteStage = "demo" | "production";

/** Treats "" and whitespace as unset — a blank dashboard field is not a value. */
function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readStage(): SiteStage {
  return readEnv(process.env.SITE_STAGE) === "production" ? "production" : "demo";
}

export const siteStage: SiteStage = readStage();
export const isProductionStage = siteStage === "production";
export const isDemoStage = siteStage === "demo";

export const DEFAULT_SITE_URL = "http://localhost:3000";

/**
 * Resolves the canonical origin.
 *
 * Exported for testing. The rules, in order:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` when it holds an actual value. A blank variable —
 *     which is what an empty field in a hosting dashboard produces — counts as
 *     unset, because `new URL("")` throws and would fail the whole build.
 *  2. Vercel's own deployment URLs, so a deploy has correct canonicals with no
 *     manual configuration. `VERCEL_PROJECT_PRODUCTION_URL` is the stable
 *     production domain; `VERCEL_URL` is the per-deployment one.
 *  3. localhost, for local development.
 *
 * A scheme is added if one is missing, a trailing slash is removed, and an
 * unparseable value degrades to the default rather than throwing.
 */
export function resolveSiteUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const candidates = [
    readEnv(env.NEXT_PUBLIC_SITE_URL),
    readEnv(env.VERCEL_PROJECT_PRODUCTION_URL),
    readEnv(env.VERCEL_URL),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const withScheme = /^https?:\/\//i.test(candidate)
      ? candidate
      : `https://${candidate}`;
    try {
      const url = new URL(withScheme);
      return url.origin;
    } catch {
      // Malformed value: fall through and try the next candidate.
    }
  }

  return DEFAULT_SITE_URL;
}

/** Canonical origin. Every canonical/OG/sitemap URL derives from this value. */
export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Outbound delivery provider for enquiry submissions. */
export const contactDeliveryProvider =
  readEnv(process.env.CONTACT_DELIVERY_PROVIDER) ?? "disabled";

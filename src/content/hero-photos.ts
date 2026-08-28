import generated from "./hero-photos.generated.json";
import { curatedHeroPhotos } from "./hero-photos.curated";

/**
 * Unsplash photography for the hero carousel.
 *
 * CONTEXTUAL DEMO IMAGERY. These are stock photographs chosen to illustrate
 * the trade — they do not show Hohmanns Plumbing Services, its staff, its
 * vehicles, its premises or its work. Nothing on the site may describe the
 * people or vehicles in them as "our team" or "our van". Replace them with
 * authentic Hohmanns photography before the production launch if the client
 * can supply it (tracked in CONTENT_CONFIRMATION.md).
 *
 * The metadata in `hero-photos.generated.json` is written by
 * `scripts/select-unsplash-photos.mjs`, which calls the official Unsplash
 * search API, records exactly what the API returned, and sends the required
 * `links.download_location` request for each selected photo. URLs keep the
 * `ixid` parameter Unsplash returns; nothing here is hand-written.
 *
 * Until that script has been run with a valid UNSPLASH_ACCESS_KEY, the two
 * hand-curated photographs in `hero-photos.curated.ts` are used instead. They
 * are licence-checked but not API-sourced, so they carry no `ixid` and no
 * download request was recorded — run the script before launch to replace
 * them properly. If both sources are empty the carousel falls back to its
 * branded navy treatment and every action still works.
 */

export interface HeroPhoto {
  /** Unsplash photo id. */
  readonly id: string;
  /** API-returned image URL, `ixid` intact. */
  readonly url: string;
  readonly width: number;
  readonly height: number;
  /** Dominant colour returned by the API, used as the loading ground. */
  readonly color: string;
  /** Returned blur hash. Kept for future use; not decoded at runtime. */
  readonly blurHash: string | null;
  /** API `alt_description`, or a truthful edit of it. */
  readonly alt: string;
  readonly photographer: {
    readonly name: string;
    readonly profileUrl: string;
  };
  /** The photo's page on Unsplash. */
  readonly photoUrl: string;
  /** Manually reviewed crops. */
  readonly objectPosition: {
    readonly desktop: string;
    readonly mobile: string;
  };
  /**
   * On-page credit. Required for anything fetched through the Unsplash API;
   * not required by the Pexels License, so the curated pair renders none.
   */
  readonly requiresAttribution: boolean;
}

type GeneratedPhoto = Omit<HeroPhoto, "objectPosition" | "requiresAttribution"> & {
  objectPosition?: { desktop?: string; mobile?: string };
  requiresAttribution?: boolean;
};

/**
 * The generated file is data, not code: validate rather than trust it, so a
 * half-written or hand-edited entry degrades to the branded fallback instead
 * of rendering a broken image or a missing attribution.
 */
function readPhoto(value: unknown): HeroPhoto | null {
  if (!value || typeof value !== "object") return null;
  const photo = value as GeneratedPhoto;

  const required =
    typeof photo.id === "string" &&
    typeof photo.url === "string" &&
    /^https:\/\/images\.(unsplash|pexels)\.com\//.test(photo.url) &&
    typeof photo.alt === "string" &&
    typeof photo.photoUrl === "string" &&
    typeof photo.photographer?.name === "string" &&
    typeof photo.photographer?.profileUrl === "string";

  if (!required) return null;

  return {
    id: photo.id,
    url: photo.url,
    width: typeof photo.width === "number" ? photo.width : 1600,
    height: typeof photo.height === "number" ? photo.height : 1067,
    color: typeof photo.color === "string" ? photo.color : "#123656",
    blurHash: typeof photo.blurHash === "string" ? photo.blurHash : null,
    alt: photo.alt,
    photographer: photo.photographer,
    photoUrl: photo.photoUrl,
    objectPosition: {
      desktop: photo.objectPosition?.desktop ?? "50% 50%",
      mobile: photo.objectPosition?.mobile ?? "50% 45%",
    },
    // Anything that came through the Unsplash API must be credited.
    requiresAttribution:
      photo.requiresAttribution ??
      photo.url.startsWith("https://images.unsplash.com/"),
  };
}

const source = generated as Record<string, unknown>;

/** API-generated metadata wins; the curated pair is the stand-in. */
export const heroPhotos = {
  slide1: readPhoto(source.slide1) ?? readPhoto(curatedHeroPhotos.slide1),
  slide2: readPhoto(source.slide2) ?? readPhoto(curatedHeroPhotos.slide2),
} as const;

/** True while a slide is showing a hand-curated photo rather than API data. */
export const heroPhotosAreCurated =
  readPhoto(source.slide1) === null || readPhoto(source.slide2) === null;

/** Widths offered to the browser for hero photographs. */
export const heroPhotoWidths = [640, 960, 1280, 1600, 2000] as const;

/**
 * Builds a responsive srcset from an Unsplash URL.
 *
 * Every existing query parameter is preserved — including `ixid`, which the
 * API guidelines require us to keep — and only the sizing parameters are set.
 * Unsplash's own CDN does the resizing and format negotiation, so the images
 * are fetched by the browser directly rather than proxied through the app.
 */
export function heroSrcSet(url: string): string {
  return heroPhotoWidths
    .map((width) => `${heroPhotoUrl(url, width)} ${width}w`)
    .join(", ");
}

export function heroPhotoUrl(rawUrl: string, width: number): string {
  try {
    const url = new URL(rawUrl);
    if (url.hostname === "images.pexels.com") {
      url.searchParams.set("auto", "compress");
      url.searchParams.set("cs", "tinysrgb");
      url.searchParams.set("w", String(width));
    } else {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", "78");
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

/** Referral parameters required by the Unsplash API guidelines. */
const REFERRAL = "utm_source=hohmanns_plumbing_website&utm_medium=referral";

/** Appends the referral parameters without destroying existing ones. */
export function withReferral(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    for (const pair of REFERRAL.split("&")) {
      const [key, value] = pair.split("=");
      if (key && value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

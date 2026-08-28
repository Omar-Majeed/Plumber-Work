/**
 * Photography.
 *
 * STOCK PLACEHOLDERS: these are free-licence photographs from Unsplash, used
 * so the site reads as a real business rather than an illustration set. They
 * are NOT photographs of Hohmanns Plumbing Services, its team, its vehicles or
 * its work — replace every one of them with the client's own photography
 * before launch (tracked as `asset.photography` in CONTENT_CONFIRMATION.md).
 *
 * Every image below was checked to be under the free Unsplash License, which
 * permits commercial use without attribution. Three otherwise-suitable photos
 * were rejected because they were Unsplash+ (paid) licences. Credits are
 * recorded anyway — it costs nothing and it is the decent thing to do.
 *
 * Images are served straight from the Unsplash CDN, which already does format
 * negotiation and resizing, so Next's image optimiser is bypassed. Run
 * `npm run photos` to download them into `public/images/` and switch the site
 * to self-hosted copies.
 */

export interface Photo {
  /** Unsplash CDN base, without query parameters. */
  readonly base: string;
  /** Local filename used by `npm run photos`. */
  readonly file: string;
  /** Meaningful alternative text. */
  readonly alt: string;
  readonly credit: {
    readonly photographer: string;
    readonly profile: string;
    readonly source: string;
  };
}

function unsplash(
  id: string,
  base: string,
  file: string,
  alt: string,
  photographer: string,
  handle: string,
): Photo {
  return {
    base: `https://images.unsplash.com/${base}`,
    file,
    alt,
    credit: {
      photographer,
      profile: `https://unsplash.com/@${handle}`,
      source: `https://unsplash.com/photos/${id}`,
    },
  };
}

export const photos = {
  hero: unsplash(
    "60krlMMeWxU",
    "photo-1530124566582-a618bc2615dc",
    "hero-tools.jpg",
    "Plumbing and hand tools laid out on a workbench",
    "Quilia",
    "heyquilia",
  ),
  about: unsplash(
    "jaP5ClBdIyU",
    "photo-1749532125405-70950966b0e5",
    "about-plumber-at-work.jpg",
    "A plumber working on pipework under a bathroom basin",
    "bhagya laxmi",
    "bhagya_laxmi",
  ),
  serviceArea: unsplash(
    "UzuvmyVJvPs",
    "photo-1735447814038-92e736f1c788",
    "service-area-van.jpg",
    "A white work van parked in front of a building",
    "NIR HIMI",
    "nirhimi",
  ),
} as const;

/** One photo per service, keyed by service slug. */
export const servicePhotos: Record<string, Photo> = {
  "general-plumbing-and-repairs": unsplash(
    "vDQ-e3RtaoE",
    "photo-1521207418485-99c705420785",
    "service-general-plumbing.jpg",
    "Water running from a kitchen mixer tap",
    "Imani",
    "spider_mani",
  ),
  "blocked-drains": unsplash(
    "wzIjLL4KB-4",
    "photo-1676210133055-eab6ef033ce3",
    "service-blocked-drains.jpg",
    "A tradesperson working on waste pipework inside a cabinet",
    "Timur Shakerzianov",
    "shaker_jpg",
  ),
  "hot-water-systems": unsplash(
    "kxuz4YrLxSc",
    "photo-1676210134190-3f2c0d5cf58d",
    "service-hot-water.jpg",
    "A tradesperson servicing a wall-mounted hot water unit",
    "Timur Shakerzianov",
    "shaker_jpg",
  ),
  "gas-fitting": unsplash(
    "KBytvj1EPl4",
    "photo-1728509741559-44172bcd86b3",
    "service-gas-fitting.jpg",
    "A steady blue flame burning on a gas cooktop ring",
    "Henning Wiekhorst",
    "henningwiekhorst",
  ),
  "leaks-and-burst-pipes": unsplash(
    "c314Gh8dXAo",
    "photo-1676210134188-4c05dd172f89",
    "service-leaks.jpg",
    "A tradesperson repairing a pipe opened up inside a wall",
    "Timur Shakerzianov",
    "shaker_jpg",
  ),
  "commercial-plumbing-and-maintenance": unsplash(
    "U0jpGKtMtWE",
    "photo-1650551182991-b07558247564",
    "service-commercial.jpg",
    "Runs of pipework and valves in a commercial plant room",
    "Immo Wegmann",
    "tinkerman",
  ),
};

export const allPhotos: readonly Photo[] = [
  ...Object.values(photos),
  ...Object.values(servicePhotos),
];

/**
 * Set NEXT_PUBLIC_PHOTO_SOURCE=local after running `npm run photos` to serve
 * the downloaded copies from /public instead of the Unsplash CDN.
 */
const useLocal = process.env.NEXT_PUBLIC_PHOTO_SOURCE === "local";

/** Builds a CDN URL at a given width, or the local path when vendored. */
export function photoUrl(photo: Photo, width: number): string {
  if (useLocal) return `/images/${photo.file}`;
  return `${photo.base}?auto=format&fit=crop&w=${width}&q=72`;
}

/** Widths offered to the browser via srcset. */
export const photoWidths = [640, 960, 1280, 1920] as const;

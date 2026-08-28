/**
 * Unsplash selection tool for the hero carousel.
 *
 *   node scripts/select-unsplash-photos.mjs
 *       Searches the official API and prints reviewed candidates for slides 1
 *       and 2, with links so a human can look at each one.
 *
 *   node scripts/select-unsplash-photos.mjs --slide1=<id> --slide2=<id>
 *       Fetches those two photos, sends the required download_location
 *       request for each, and writes src/content/hero-photos.generated.json.
 *
 * Optional crop overrides (defaults are 50% 50% desktop / 50% 45% mobile):
 *   --pos1="50% 40%" --pos1-mobile="60% 45%"  (same pattern for --pos2)
 *
 * Requires UNSPLASH_ACCESS_KEY in the environment or in .env.local. The key is
 * only ever sent in an Authorization header — it is never printed, written to
 * a generated file, or exposed to the browser.
 *
 * API docs:        https://unsplash.com/documentation
 * API guidelines:  https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines
 * Hotlinking:      https://help.unsplash.com/en/articles/2511271-guideline-hotlinking-images
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

try {
  process.loadEnvFile(join(process.cwd(), ".env.local"));
} catch {
  // No .env.local — the key may still be exported in the environment.
}

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const API = "https://api.unsplash.com";
const OUT = join(process.cwd(), "src", "content", "hero-photos.generated.json");

if (!ACCESS_KEY) {
  console.error(
    [
      "UNSPLASH_ACCESS_KEY is not set.",
      "",
      "Create an application at https://unsplash.com/oauth/applications, then",
      "add the Access Key (not the Secret key) to .env.local:",
      "",
      "  UNSPLASH_ACCESS_KEY=your-access-key",
      "",
      ".env.local is git-ignored, so the key stays out of the repository.",
    ].join("\n"),
  );
  process.exit(1);
}

const headers = {
  Authorization: `Client-ID ${ACCESS_KEY}`,
  "Accept-Version": "v1",
};

/** Search terms per slide: a targeted query first, then broader fallbacks. */
const SEARCHES = {
  slide1: {
    label: "Slide 1 — local relevance (tradesperson / service vehicle)",
    queries: [
      "Australian plumber tradesperson service vehicle",
      "professional plumber tradesperson",
      "plumber work van",
    ],
    keywords: [
      "plumb",
      "tradesman",
      "tradesperson",
      "van",
      "ute",
      "tool",
      "worker",
      "technician",
    ],
  },
  slide2: {
    label: "Slide 2 — the problem (pipework / repair detail)",
    queries: [
      "professional plumber pipe repair",
      "plumbing tools pipework",
      "plumbing pipe wrench repair",
    ],
    keywords: ["pipe", "plumb", "wrench", "valve", "repair", "tool", "fitting"],
  },
};

/**
 * Disqualifiers. Unsplash returns plenty of stock that would misrepresent the
 * business or is simply the wrong register for a local trade site.
 */
const REJECT = [
  "flood",
  "disaster",
  "emergency",
  "fire",
  "damage",
  "logo",
  "signage",
  "billboard",
  "advertisement",
  "ai generated",
  "render",
  "illustration",
  "3d",
];

async function api(path, params) {
  const url = new URL(path, API);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(
      `${path} responded ${response.status} ${response.statusText}. ` +
        (response.status === 401
          ? "The access key was rejected — check UNSPLASH_ACCESS_KEY."
          : "See https://unsplash.com/documentation#rate-limiting if this is a 403."),
    );
  }
  return response.json();
}

function text(photo) {
  return [
    photo.alt_description,
    photo.description,
    photo.tags?.map((t) => t.title).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Rejects unusable candidates and ranks what is left. */
function review(photos, keywords) {
  return photos
    .filter((photo) => {
      if (!photo.urls?.regular || !photo.links?.download_location) return false;
      if (photo.width < 2000) return false;
      const ratio = photo.width / photo.height;
      if (ratio < 1.3 || ratio > 2.1) return false;
      const haystack = text(photo);
      if (REJECT.some((word) => haystack.includes(word))) return false;
      return true;
    })
    .map((photo) => {
      const haystack = text(photo);
      const hits = keywords.filter((word) => haystack.includes(word)).length;
      const described = photo.alt_description ? 1 : 0;
      return { photo, score: hits * 2 + described };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.photo);
}

async function findCandidates({ label, queries, keywords }) {
  console.log(`\n${label}`);
  const seen = new Map();

  for (const query of queries) {
    const data = await api("/search/photos", {
      query,
      orientation: "landscape",
      content_filter: "high",
      per_page: 24,
    });
    for (const photo of review(data.results ?? [], keywords)) {
      if (!seen.has(photo.id)) seen.set(photo.id, photo);
    }
    console.log(
      `  query "${query}" → ${data.results?.length ?? 0} results, ${seen.size} usable so far`,
    );
    if (seen.size >= 10) break;
  }

  const candidates = [...seen.values()].slice(0, 8);
  console.log("");
  for (const photo of candidates) {
    console.log(`  id: ${photo.id}`);
    console.log(`    alt:    ${photo.alt_description ?? "(none)"}`);
    console.log(`    by:     ${photo.user.name}`);
    console.log(`    size:   ${photo.width}×${photo.height}`);
    console.log(`    review: ${photo.links.html}`);
    console.log("");
  }
  if (candidates.length === 0) {
    console.log(
      "  No candidate passed review. Widen the queries in this script.\n",
    );
  }
  return candidates;
}

/**
 * Unsplash requires a request to `links.download_location` whenever a photo is
 * selected for use. It is a tracking endpoint, not the image itself.
 */
async function triggerDownload(photo) {
  const response = await fetch(photo.links.download_location, { headers });
  if (!response.ok) {
    throw new Error(
      `download_location for ${photo.id} responded ${response.status}. Selection not recorded.`,
    );
  }
  console.log(`  download_location acknowledged for ${photo.id}`);
}

function toMetadata(photo, position) {
  return {
    id: photo.id,
    // urls.regular, exactly as returned — the ixid parameter is preserved.
    url: photo.urls.regular,
    width: photo.width,
    height: photo.height,
    color: photo.color ?? "#123656",
    blurHash: photo.blur_hash ?? null,
    alt:
      photo.alt_description ??
      "Plumbing work in progress — contextual stock photograph, not Hohmanns Plumbing Services",
    photographer: {
      name: photo.user.name,
      profileUrl: photo.user.links.html,
    },
    photoUrl: photo.links.html,
    objectPosition: position,
  };
}

function positionArg(flag, fallback) {
  const raw = process.argv.find((arg) => arg.startsWith(`--${flag}=`));
  return raw ? raw.slice(flag.length + 3) : fallback;
}

function idArg(flag) {
  const raw = process.argv.find((arg) => arg.startsWith(`--${flag}=`));
  return raw ? raw.slice(flag.length + 3) : null;
}

const slide1Id = idArg("slide1");
const slide2Id = idArg("slide2");

if (!slide1Id || !slide2Id) {
  await findCandidates(SEARCHES.slide1);
  await findCandidates(SEARCHES.slide2);
  console.log(
    [
      "Open the review links, pick one photo per slide, then run:",
      "",
      "  node scripts/select-unsplash-photos.mjs --slide1=<id> --slide2=<id>",
      "",
      "Crops default to 50% 50% (desktop) and 50% 45% (mobile). Override with",
      '  --pos1="50% 35%" --pos1-mobile="55% 45%"   (and --pos2 / --pos2-mobile)',
    ].join("\n"),
  );
  process.exit(0);
}

console.log("Fetching selected photos…");
const [photo1, photo2] = await Promise.all([
  api(`/photos/${slide1Id}`),
  api(`/photos/${slide2Id}`),
]);

console.log("Recording selections with Unsplash…");
await triggerDownload(photo1);
await triggerDownload(photo2);

const output = {
  _comment:
    "Generated by scripts/select-unsplash-photos.mjs from the official Unsplash API. " +
    "Contextual stock photography — it does not depict Hohmanns Plumbing Services. " +
    "Only objectPosition is safe to hand-edit.",
  _generatedAt: new Date().toISOString(),
  slide1: toMetadata(photo1, {
    desktop: positionArg("pos1", "50% 50%"),
    mobile: positionArg("pos1-mobile", "50% 45%"),
  }),
  slide2: toMetadata(photo2, {
    desktop: positionArg("pos2", "50% 50%"),
    mobile: positionArg("pos2-mobile", "50% 45%"),
  }),
};

await writeFile(OUT, `${JSON.stringify(output, null, 2)}\n`);
console.log(`\nWrote ${OUT}`);
console.log("Check the crops in the browser and adjust objectPosition if needed.");

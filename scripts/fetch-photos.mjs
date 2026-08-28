/**
 * Downloads the stock photography into `public/images/` so the site can serve
 * it from its own origin instead of the Unsplash CDN.
 *
 *   npm run photos
 *
 * Afterwards set NEXT_PUBLIC_PHOTO_SOURCE=local in .env.local and restart the
 * dev server. Nothing else changes — `photoUrl()` in src/content/photos.ts
 * switches every reference over.
 *
 * Run this again after editing src/content/photos.ts. Existing files are
 * overwritten so the folder always matches the manifest.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// The photo manifest is plain data, so it is parsed out of the TS module
// rather than compiled — this script has no build step.
const { allPhotos } = await import("./photo-manifest.mjs");

const WIDTH = 1920;
const QUALITY = 80;
const OUT = join(process.cwd(), "public", "images");

await mkdir(OUT, { recursive: true });

let ok = 0;
let failed = 0;

for (const photo of allPhotos) {
  const url = `${photo.base}?auto=format&fit=crop&w=${WIDTH}&q=${QUALITY}`;
  process.stdout.write(`  ${photo.file} … `);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(join(OUT, photo.file), buffer);
    process.stdout.write(`${Math.round(buffer.length / 1024)} KB\n`);
    ok += 1;
  } catch (error) {
    process.stdout.write(`FAILED (${error.message})\n`);
    failed += 1;
  }
}

console.log(`\n${ok} downloaded, ${failed} failed → public/images/`);
if (failed === 0) {
  console.log("\nNow add this to .env.local and restart the dev server:");
  console.log("  NEXT_PUBLIC_PHOTO_SOURCE=local");
} else {
  process.exitCode = 1;
}

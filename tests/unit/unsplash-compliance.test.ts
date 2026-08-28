import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import generated from "../../src/content/hero-photos.generated.json";
import { curatedHeroPhotos } from "../../src/content/hero-photos.curated";
import { heroPhotos } from "../../src/content/hero-photos";

/**
 * Guards the Unsplash API guidelines at the repository level, so a future
 * edit cannot quietly reintroduce a banned URL shape or leak a key.
 */

const ROOT = join(import.meta.dirname, "..", "..");
const SCANNED = ["src", "scripts", "tests"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = SCANNED.flatMap((dir) => walk(join(ROOT, dir)))
  .filter((path) => /\.(ts|tsx|mjs|js|json|css)$/.test(path))
  // This file names the banned patterns in order to search for them.
  .filter((path) => !path.endsWith("unsplash-compliance.test.ts"));

describe("Unsplash API guidelines", () => {
  it("never uses the retired source.unsplash.com host", () => {
    const offenders = files.filter((path) =>
      readFileSync(path, "utf8").includes("source.unsplash.com"),
    );
    expect(offenders).toEqual([]);
  });

  it("ships no Unsplash access key", () => {
    // A key is 43 URL-safe characters. Only the env var name may appear.
    const keyPattern = /UNSPLASH_ACCESS_KEY\s*[=:]\s*["']?[A-Za-z0-9_-]{20,}/;
    const offenders = files.filter((path) =>
      keyPattern.test(readFileSync(path, "utf8")),
    );
    expect(offenders).toEqual([]);
  });

  it("reads the key only on the server", () => {
    const clientFiles = files.filter((path) => {
      if (!/\.tsx?$/.test(path) || path.includes(`${"scripts"}`)) return false;
      return readFileSync(path, "utf8").startsWith('"use client"');
    });
    const offenders = clientFiles.filter((path) =>
      readFileSync(path, "utf8").includes("UNSPLASH_ACCESS_KEY"),
    );
    expect(offenders).toEqual([]);
  });

  it("keeps API-returned metadata whenever a hero photo is API-sourced", () => {
    const slides = [generated.slide1, generated.slide2] as unknown[];

    for (const slide of slides) {
      if (slide === null) continue; // not selected yet — the fallback renders
      const photo = slide as Record<string, unknown>;

      expect(typeof photo.id).toBe("string");
      expect(String(photo.url)).toMatch(/^https:\/\/images\.unsplash\.com\//);
      // The ixid the API returns must survive into the rendered URL.
      expect(String(photo.url)).toContain("ixid=");

      const photographer = photo.photographer as {
        name?: string;
        profileUrl?: string;
      };
      expect(photographer.name ?? "").not.toBe("");
      expect(photographer.profileUrl ?? "").toMatch(/^https:\/\/unsplash\.com\//);
      expect(String(photo.photoUrl)).toMatch(/^https:\/\/unsplash\.com\//);
      expect(String(photo.alt).length).toBeGreaterThan(0);
    }
  });

  it("records a traceable source for every curated hero photo", () => {
    for (const photo of Object.values(curatedHeroPhotos)) {
      expect(photo.url).toMatch(/^https:\/\/images\.(unsplash|pexels)\.com\//);
      expect(photo.photographer.name.length).toBeGreaterThan(0);
      expect(photo.photographer.profileUrl).toMatch(/^https:\/\//);
      expect(photo.photoUrl).toMatch(/^https:\/\//);
      // Alt text describes the scene; it must never claim to show the business.
      expect(photo.alt.toLowerCase()).not.toContain("hohmanns");
      expect(photo.alt.toLowerCase()).not.toContain("our team");
    }
  });

  it("only renders on-page credit where the licence requires it", () => {
    // Pexels does not require attribution, so nothing is printed on the page.
    for (const photo of Object.values(curatedHeroPhotos)) {
      if (photo.url.includes("images.pexels.com")) {
        expect(photo.requiresAttribution).toBe(false);
      }
    }
    // Anything arriving from the Unsplash API is credited automatically.
    for (const photo of [heroPhotos.slide1, heroPhotos.slide2]) {
      if (photo?.url.startsWith("https://images.unsplash.com/")) {
        expect(photo.requiresAttribution).toBe(true);
      }
    }
  });
});

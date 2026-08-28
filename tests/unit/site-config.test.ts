import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, resolveSiteUrl } from "@/lib/site-config";

describe("resolveSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when it has a value", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://hohmanns.com.au" }),
    ).toBe("https://hohmanns.com.au");
  });

  it("strips a trailing slash and any path", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://hohmanns.com.au/" }),
    ).toBe("https://hohmanns.com.au");
  });

  it("adds a scheme when the value is a bare hostname", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "hohmanns.com.au" })).toBe(
      "https://hohmanns.com.au",
    );
  });

  // The bug that broke the first Vercel deploy: a variable that exists but is
  // empty is not a URL, and `new URL("")` throws during page-data collection.
  it.each(["", "   "])("treats %j as unset", (value) => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: value })).toBe(DEFAULT_SITE_URL);
  });

  it("falls back to the Vercel production domain", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "",
        VERCEL_PROJECT_PRODUCTION_URL: "plumber-work.vercel.app",
      }),
    ).toBe("https://plumber-work.vercel.app");
  });

  it("falls back to the per-deployment Vercel URL", () => {
    expect(resolveSiteUrl({ VERCEL_URL: "plumber-work-abc123.vercel.app" })).toBe(
      "https://plumber-work-abc123.vercel.app",
    );
  });

  it("prefers an explicit value over the Vercel domains", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://hohmanns.com.au",
        VERCEL_URL: "plumber-work.vercel.app",
      }),
    ).toBe("https://hohmanns.com.au");
  });

  it("never throws on a malformed value", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://" })).toBe(
      DEFAULT_SITE_URL,
    );
  });

  it("defaults to localhost with nothing set", () => {
    expect(resolveSiteUrl({})).toBe(DEFAULT_SITE_URL);
  });
});

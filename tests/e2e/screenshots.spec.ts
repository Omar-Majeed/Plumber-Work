import { test, type Page } from "@playwright/test";

/**
 * QA evidence only. Output lands in the git-ignored artifacts/ directory and
 * is never served as a website asset.
 */

/** Scrolls the whole page so lazy-loaded images are decoded before capture. */
async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "small-desktop-1024x768", width: 1024, height: 768 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "small-mobile-360x800", width: 360, height: 800 },
];

for (const viewport of viewports) {
  test(`capture home at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await settle(page);
    await page.screenshot({
      path: `artifacts/screenshots/home-${viewport.name}.png`,
      fullPage: true,
    });
  });
}

const pages = [
  {
    path: "/contact",
    name: "contact",
    viewport: { width: 390, height: 844 },
    label: "mobile-390x844",
  },
  {
    path: "/faq",
    name: "faq",
    viewport: { width: 1440, height: 900 },
    label: "desktop-1440x900",
  },
  {
    path: "/about",
    name: "about",
    viewport: { width: 1440, height: 900 },
    label: "desktop-1440x900",
  },
  {
    path: "/services/hot-water-systems",
    name: "service",
    viewport: { width: 1440, height: 900 },
    label: "desktop-1440x900",
  },
];

for (const entry of pages) {
  test(`capture ${entry.name} at ${entry.label}`, async ({ page }) => {
    await page.setViewportSize(entry.viewport);
    await page.goto(entry.path);
    await settle(page);
    await page.screenshot({
      path: `artifacts/screenshots/${entry.name}-${entry.label}.png`,
      fullPage: true,
    });
  });
}

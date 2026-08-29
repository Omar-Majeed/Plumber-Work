import { expect, test } from "@playwright/test";

/**
 * CTA hierarchy.
 *
 * The homepage specification caps how loud the page is allowed to be: at most
 * two styled action buttons in any section, one call action per section, no
 * call buttons inside service cards, and no sticky mobile action bar. These
 * are the rules that stop the page sliding back into "a button in every
 * section", so they are asserted rather than trusted.
 */

/** Styled action buttons, as opposed to plain text links. */
const BUTTON = 'a[class*="bg-[var(--colour-orange"], a[class*="min-h-[48px]"]';

test("no section carries more than two styled action buttons", async ({ page }) => {
  await page.goto("/");
  const sections = page.locator("main section");
  const count = await sections.count();
  expect(count).toBeGreaterThan(5);

  for (let i = 0; i < count; i += 1) {
    const section = sections.nth(i);
    // The carousel holds all three slides in the DOM but shows one at a time,
    // so it is measured per slide in the hero spec, not in aggregate here.
    if ((await section.getAttribute("aria-roledescription")) === "carousel")
      continue;

    const buttons = await section.locator(BUTTON).count();
    expect(
      buttons,
      `section ${i} has ${buttons} action buttons`,
    ).toBeLessThanOrEqual(2);
  }
});

test("only one hero slide's actions are reachable at a time", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Highlights" });
  // Inactive slides are inert, so only the active slide's actions are live.
  const visible = carousel.locator(
    '[aria-roledescription="slide"]:not([aria-hidden="true"]) a[href]',
  );
  expect(await visible.count()).toBeLessThanOrEqual(2);
});

test("service cards link with text, never with a call button", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("main article");
  await expect(cards).toHaveCount(6);

  for (let i = 0; i < 6; i += 1) {
    await expect(cards.nth(i).locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(cards.nth(i).getByText(/explore service/i)).toBeVisible();
  }
});

test("the informational sections carry no call to action", async ({ page }) => {
  await page.goto("/");

  for (const heading of [
    /what you can rely on/i,
    /how an enquiry works/i,
    /questions people ask first/i,
  ]) {
    const section = page
      .locator("main section")
      .filter({ has: page.getByRole("heading", { name: heading }) });
    await expect(section).toHaveCount(1);
    await expect(section.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(section.locator(BUTTON)).toHaveCount(0);
  }
});

test("there is no sticky mobile action bar or floating phone button", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const floating = await page.evaluate(
    () =>
      [...document.querySelectorAll("body *")].filter((element) => {
        const style = getComputedStyle(element);
        if (style.position !== "fixed") return false;
        // The sticky header is expected; anything else pinned to the viewport
        // and holding a phone link is not.
        return Boolean(element.querySelector('a[href^="tel:"]'));
      }).length,
  );
  expect(floating).toBe(0);
});

test("the header keeps one persistent call action per breakpoint", async ({
  page,
}) => {
  // Desktop: the quiet contact-strip link plus the orange nav button. The
  // mobile icon button is in the DOM but hidden, so it is not counted.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const header = page.locator("header");
  await expect(header.locator('a[href^="tel:"]:visible')).toHaveCount(2);

  // Mobile: the contact strip plus the icon button, and no full-width button.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(header.locator('a[href^="tel:"]:visible')).toHaveCount(2);
});

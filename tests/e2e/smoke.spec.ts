import { expect, test, type Page } from "@playwright/test";

const PHONE_HREF = "tel:+61749224351";
const PHONE_DISPLAY = "(07) 4922 4351";

const routes = [
  "/",
  "/services",
  "/services/general-plumbing-and-repairs",
  "/services/blocked-drains",
  "/services/hot-water-systems",
  "/services/gas-fitting",
  "/services/leaks-and-burst-pipes",
  "/services/commercial-plumbing-and-maintenance",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

/**
 * Fails the test run if the page logs an error or a hydration warning.
 *
 * Scoped to this site's own origin: the embedded Google Map is a third-party
 * frame whose console output is not ours to fix, and it is unreachable from a
 * sandboxed CI runner.
 */
function collectConsoleProblems(page: Page) {
  const problems: string[] = [];
  const isThirdParty = (url: string) =>
    url.length > 0 && !url.includes("127.0.0.1") && !url.includes("localhost");

  page.on("console", (message) => {
    if (message.type() !== "error" && message.type() !== "warning") return;
    if (isThirdParty(message.location().url)) return;
    if (/google/i.test(message.text())) return;
    problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
}

test.describe("routes", () => {
  for (const route of routes) {
    test(`${route} renders with exactly one h1 and no console errors`, async ({
      page,
    }) => {
      const problems = collectConsoleProblems(page);
      const response = await page.goto(route);

      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toBeVisible();

      const hydration = problems.filter((text) =>
        /hydrat|did not match|Warning:/i.test(text),
      );
      expect(hydration, hydration.join("\n")).toHaveLength(0);
      expect(problems, problems.join("\n")).toHaveLength(0);
    });
  }
});

test("every telephone link uses the correct URI", async ({ page }) => {
  for (const route of ["/", "/contact", "/services/gas-fitting"]) {
    await page.goto(route);
    const links = page.locator('a[href^="tel:"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      await expect(links.nth(index)).toHaveAttribute("href", PHONE_HREF);
    }
  }
});

test("the phone number is visible without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("banner").getByRole("link", { name: `Call ${PHONE_DISPLAY}` }),
  ).toBeInViewport();
});

test("no page scrolls horizontally at any tested width", async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/services", "/contact", "/services/gas-fitting"]) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});

test("mobile menu opens, closes on Escape, and exposes its state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("navigation", { name: "Site" }).getByRole("link", {
      name: "About",
    }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("the enquiry form validates and never claims a demo message was sent", async ({
  page,
}) => {
  await page.goto("/contact");

  await page.getByRole("button", { name: "Request a callback" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "problems with this enquiry" }),
  ).toBeVisible();

  await page
    .getByLabel("What do you need help with?")
    .selectOption("blocked-drains");
  await page.getByLabel("Your name").fill("Sam Taylor");
  await page.getByLabel("Phone number").fill("123");
  await page.getByLabel("Suburb or postcode").fill("Rockhampton City");
  await page.getByLabel(/details will be used only/).check();
  await page.getByRole("button", { name: "Request a callback" }).click();
  await expect(page.getByText(/valid Australian phone number/)).toBeVisible();

  await page.getByLabel("Phone number").fill("(07) 4922 4351");
  await page.getByRole("button", { name: "Request a callback" }).click();

  await expect(page.getByRole("status")).toContainText(
    "Demo only — this enquiry has not been sent.",
  );
  await expect(page.getByText(/thanks|we.ll be in touch/i)).toHaveCount(0);
});

test("the 404 page offers the phone number and a way home", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute(
    "href",
    PHONE_HREF,
  );
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("robots and sitemap are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/services/gas-fitting");
  expect(xml).toContain("/faq");
});

test("structured data matches the page and omits unverified social proof", async ({
  page,
}) => {
  await page.goto("/");
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const plumber = blocks
    .map((block) => JSON.parse(block))
    .find((data) => data["@type"] === "Plumber");

  expect(plumber).toBeTruthy();
  expect(plumber.telephone).toBe("+61749224351");
  expect(plumber.taxID).toBe("48 324 274 959");
  // Hours and service areas are published because the page states them.
  expect(plumber.openingHoursSpecification).toHaveLength(2);
  expect(Array.isArray(plumber.areaServed)).toBe(true);
  // Unverified social proof and pricing stay out of the markup.
  for (const forbidden of ["aggregateRating", "review", "priceRange"]) {
    expect(plumber[forbidden]).toBeUndefined();
  }
});

test("the FAQ page publishes FAQPage markup that matches its questions", async ({
  page,
}) => {
  await page.goto("/faq");

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const faq = blocks
    .map((block) => JSON.parse(block))
    .find((data) => data["@type"] === "FAQPage");

  expect(faq).toBeTruthy();
  expect(faq.mainEntity.length).toBeGreaterThan(15);

  const firstQuestion = faq.mainEntity[0].name;
  await expect(
    page.getByRole("group").filter({ hasText: firstQuestion }).first(),
  ).toBeVisible();
});

test("sample testimonials are labelled as samples", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Sample layout.")).toBeVisible();
  await expect(page.getByText("sample", { exact: true }).first()).toBeVisible();
});

test("the contact page embeds the business's Google Map", async ({ page }) => {
  await page.goto("/contact");

  const map = page.locator('iframe[src*="maps.google.com"]');
  await expect(map).toHaveCount(1);
  await expect(map).toHaveAttribute("loading", "lazy");
  // Coordinates from the business's own Google listing.
  await expect(map).toHaveAttribute("src", /-23\.3835283%2C150\.5154954/);

  const csp = (await page.goto("/contact"))?.headers()["content-security-policy"];
  expect(csp).toContain("frame-src 'self' https://www.google.com");
});

test("structured data carries the listing coordinates", async ({ page }) => {
  await page.goto("/");
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const plumber = blocks
    .map((block) => JSON.parse(block))
    .find((data) => data["@type"] === "Plumber");

  expect(plumber.geo).toMatchObject({
    "@type": "GeoCoordinates",
    latitude: -23.3835283,
    longitude: 150.5154954,
  });
  expect(plumber.hasMap).toContain("cid=2882896361346668586");
});

test("service cards carry photography with a responsive srcset", async ({
  page,
}) => {
  await page.goto("/services");

  // Service cards are <article>; the page also carries a service-area photo.
  const images = page.locator("main article img[srcset]");
  await expect(images).toHaveCount(6);

  const first = images.first();
  await expect(first).toHaveAttribute("srcset", /1920w/);
  await expect(first).toHaveAttribute("loading", "lazy");
  // Stock photography is served from the Unsplash CDN unless it has been
  // vendored locally with `npm run photos`.
  const src = await first.getAttribute("src");
  expect(src).toMatch(/images\.unsplash\.com|^\/images\//);
});

test("the desktop Services dropdown lists every service", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const trigger = page
    .getByRole("navigation", { name: "Site" })
    .getByRole("button", { name: "Services" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const panelId = await trigger.getAttribute("aria-controls");
  const panel = page.locator(`#${panelId}`);
  // Six services plus the "All services" link.
  await expect(panel.getByRole("link")).toHaveCount(7);
  await expect(panel.getByRole("link", { name: /Blocked drains/ })).toBeVisible();
  await expect(panel.getByRole("link", { name: /All services/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("the dropdown navigates to a service page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await page
    .getByRole("navigation", { name: "Site" })
    .getByRole("button", { name: "Services" })
    .click();
  await page
    .getByRole("link", { name: /Hot water systems/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/services\/hot-water-systems$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Hot water systems",
  );
});

test("the mobile menu expands the services sub-list", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Menu" }).click();

  const servicesToggle = page
    .getByRole("navigation", { name: "Site" })
    .getByRole("button", { name: "Services" });
  await expect(servicesToggle).toHaveAttribute("aria-expanded", "false");

  await servicesToggle.click();
  await expect(servicesToggle).toHaveAttribute("aria-expanded", "true");

  const subId = await servicesToggle.getAttribute("aria-controls");
  await expect(page.locator(`#${subId}`).getByRole("link")).toHaveCount(7);
});

test.describe("hero carousel", () => {
  test("exposes carousel semantics and one h1", async ({ page }) => {
    await page.goto("/");

    const carousel = page.getByRole("region", {
      name: "Hohmanns Plumbing Services highlights",
    });
    await expect(carousel).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("one direct call away");

    // Three slides, only the first exposed.
    const slides = carousel.locator('[aria-roledescription="slide"]');
    await expect(slides).toHaveCount(3);
    await expect(slides.first()).toHaveAttribute("aria-label", "1 of 3");
    await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "true");

    await expect(
      carousel.getByRole("button", { name: "Previous slide" }),
    ).toBeVisible();
    await expect(
      carousel.getByRole("button", { name: "Next slide" }),
    ).toBeVisible();
    for (let n = 1; n <= 3; n += 1) {
      await expect(
        carousel.getByRole("button", { name: `Go to slide ${n} of 3` }),
      ).toBeVisible();
    }
  });

  test("next, previous and the dots change slide", async ({ page }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", {
      name: "Hohmanns Plumbing Services highlights",
    });
    const slides = carousel.locator('[aria-roledescription="slide"]');

    await carousel.getByRole("button", { name: "Next slide" }).click();
    await expect(slides.nth(1)).not.toHaveAttribute("aria-hidden", "true");
    await expect(carousel.getByRole("heading", { level: 2 }).first()).toContainText(
      "Start here",
    );

    await carousel.getByRole("button", { name: "Previous slide" }).click();
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");

    await carousel.getByRole("button", { name: "Go to slide 3 of 3" }).click();
    await expect(slides.nth(2)).not.toHaveAttribute("aria-hidden", "true");
    // Slide 3 states only confirmed facts.
    await expect(carousel).toContainText("290 Bolsover Street");
    await expect(carousel).toContainText("48 324 274 959");
  });

  test("arrow keys work inside the carousel only", async ({ page }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", {
      name: "Hohmanns Plumbing Services highlights",
    });
    const slides = carousel.locator('[aria-roledescription="slide"]');

    await carousel.getByRole("button", { name: "Next slide" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(slides.nth(1)).not.toHaveAttribute("aria-hidden", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");

    // Focus outside the region: the carousel must not react.
    await page.getByRole("link", { name: "Skip to main content" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");
  });

  test("autoplay advances, and pauses while hovered", async ({ page }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", {
      name: "Hohmanns Plumbing Services highlights",
    });
    const slides = carousel.locator('[aria-roledescription="slide"]');

    // Hovering holds slide 1 in place past the 8s interval.
    await carousel.hover();
    await page.waitForTimeout(9500);
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");

    // Move the pointer away and it resumes.
    await page.mouse.move(0, 0);
    await expect(slides.nth(1)).not.toHaveAttribute("aria-hidden", "true", {
      timeout: 12000,
    });
  });

  test("every hero call action uses the correct telephone URI", async ({
    page,
  }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", {
      name: "Hohmanns Plumbing Services highlights",
    });
    const links = carousel.locator('a[href^="tel:"]');
    const count = await links.count();
    expect(count).toBe(3); // one per slide
    for (let i = 0; i < count; i += 1) {
      await expect(links.nth(i)).toHaveAttribute("href", PHONE_HREF);
    }
  });

  test("the callback CTA reaches the enquiry form", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("region", { name: "Hohmanns Plumbing Services highlights" })
      .getByRole("link", { name: "Request a callback" })
      .click();

    await expect(page).toHaveURL(/#enquiry$/);
    await expect(page.locator("#enquiry")).toBeVisible();
    await expect(
      page.locator("#enquiry").getByRole("button", { name: "Request a callback" }),
    ).toBeVisible();
  });
});

test.describe("hero carousel with reduced motion", () => {
  test("does not autoplay", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const slides = page
      .getByRole("region", { name: "Hohmanns Plumbing Services highlights" })
      .locator('[aria-roledescription="slide"]');

    await page.waitForTimeout(9500);
    await expect(slides.first()).not.toHaveAttribute("aria-hidden", "true");
  });
});

test("keyboard users reach the skip link first", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
});

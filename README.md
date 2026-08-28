# Hohmanns Plumbing Services — website concept

A production-quality demo website for **Hohmanns Plumbing Services P/L**,
plumbers and gasfitters in Rockhampton City, Queensland.

The site presents as a finished product — hours, service areas, credentials,
pricing promises, the company story, an FAQ page and testimonials are all in
place. Most of that is **realistic sample content** written for the demo.

The codebase makes it impossible to ship that sample content as if it were
verified: every claim lives in a typed content model, is marked
`requiresConfirmation: true`, and blocks a production release until the client
signs it off. Testimonials go further — they are filtered out entirely in a
production build, because inventing customer reviews under a real trading name
is not something this site will publish.

**Confirmed facts** (public business listing, research snapshot 27 August 2026):

| Fact       | Value                                                     |
| ---------- | --------------------------------------------------------- |
| Legal name | Hohmanns Plumbing Services P/L                            |
| Category   | Plumbers & Gasfitters                                     |
| Phone      | (07) 4922 4351 — `tel:+61749224351`                       |
| Address    | 290 Bolsover Street, Rockhampton City QLD 4700, Australia |
| ABN        | 48 324 274 959                                            |

Nothing else — hours, licences, insurance, services, pricing, reviews,
guarantees, response times — has been verified. Every one of them is listed,
with what the site currently claims, in
[CONTENT_CONFIRMATION.md](./CONTENT_CONFIRMATION.md).

One deliberate omission: **no QBCC licence number is published anywhere.** The
badge reads "QBCC licensed plumber & gasfitter" without a number, because
inventing a registration number against a real trading name would be a
fabricated credential. Add the real number to
`profile.credentials.qbccNumber` once it has been checked against the QBCC
public register.

---

## Tech stack

- **Next.js 16** (App Router, React 19, server components by default)
- **TypeScript**, strict, with `noUncheckedIndexedAccess` and unused-symbol checks
- **Tailwind CSS v4** with semantic design tokens defined in `src/app/globals.css`
- **Zod** for a single form schema shared by client and server
- **Lucide** icons
- Self-hosted variable fonts (Manrope + Inter) via `next/font/local`
- **Vitest** for unit tests, **Playwright** for browser smoke tests
- No UI framework, no state-management library, no third-party scripts

## Prerequisites

- Node.js 20.9+ (developed on Node 22)
- npm 10+

## Commands

```bash
npm install            # install dependencies
cp .env.example .env.local

npm run dev            # development server on http://localhost:3000
npm run build          # production build (runs the content gate first)
npm start              # serve the production build

npm run format         # Prettier write
npm run format:check   # Prettier check
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # Vitest unit tests
npm run test:e2e       # Playwright smoke + responsive screenshots

npm run validate:content     # content report for the current stage
npm run validate:production  # simulate the production gate (exits 1 while unconfirmed)

npm run verify         # format:check + lint + typecheck + test + content + build
```

`npm run test:e2e` builds the app and serves it on port 3100. Run
`npx playwright install chromium` once before the first e2e run.

## Environment variables

| Variable                       | Scope  | Default                 | Purpose                                                                                                                   |
| ------------------------------ | ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `SITE_STAGE`                   | server | `demo`                  | `demo` allows unconfirmed content; `production` enforces the content gate, hides the concept ribbon and enables crawling. |
| `NEXT_PUBLIC_SITE_URL`         | client | `http://localhost:3000` | Canonical origin. Every canonical URL, Open Graph URL and sitemap entry derives from this one value.                      |
| `NEXT_PUBLIC_SHOW_DEMO_BANNER` | client | `true`                  | Set to `false` to hide the concept ribbon without changing the stage.                                                     |
| `CONTACT_DELIVERY_PROVIDER`    | server | `disabled`              | Selects the enquiry delivery adapter. `disabled` transmits nothing.                                                       |
| `CONTACT_RECIPIENT_EMAIL`      | server | _(empty)_               | Destination address once a delivery adapter is implemented.                                                               |

No secret is ever exposed through a `NEXT_PUBLIC_*` variable.

## Demo stage vs production stage

|                | `SITE_STAGE=demo`                                                                   | `SITE_STAGE=production`                                             |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Build          | Always succeeds                                                                     | Fails if any production-visible content still requires confirmation |
| Concept ribbon | Shown (unless disabled)                                                             | Never shown                                                         |
| `robots.txt`   | `Disallow: /`                                                                       | `Allow: /`                                                          |
| Enquiry form   | Validates, transmits nothing, reports "Demo only — this enquiry has not been sent." | Delivers through the configured adapter, or fails honestly          |
| Legal pages    | Show a visible "template, not legal advice" notice                                  | Notice removed — review must have happened first                    |

The gate runs automatically as `prebuild`, so `npm run build` cannot produce a
production bundle containing unconfirmed claims.

## Form delivery status

**Delivery is intentionally disabled.** `src/lib/enquiry-delivery.ts` defines a
`DeliveryAdapter` boundary with a single registered adapter (`disabled`) that
sends nothing and reports `not-configured`.

To enable delivery:

1. Implement an adapter (transactional email, CRM, webhook) in
   `src/lib/enquiry-delivery.ts` and register it in the `adapters` map.
2. Add whatever environment variables it needs, and document them in the table
   above and in `.env.example`.
3. Set `CONTACT_DELIVERY_PROVIDER` to the adapter's id.
4. Replace the in-process rate limiter in `src/lib/rate-limit.ts` with a shared
   store (Redis/KV) before running more than one instance.

The server action never returns a success state unless an adapter reports
success. There is no path through the code that tells a visitor their enquiry
was sent when it was not.

Anti-spam already in place: a honeypot field, full server-side validation,
a request-size limit, and a rate-limit hook.

## Editing content

All business content lives in `src/content` and nothing else needs touching:

- `src/content/business.ts` — identity, phone, address, ABN, and the fact
  registry. **The phone number and address appear nowhere else in the code.**
- `src/content/services.ts` — the six proposed service categories, their
  copy, indicators, FAQs and relationships. Adding, renaming, reordering or
  removing a service is a change to this array only; the grid, the detail
  pages, the sitemap, the form dropdown and the static params all follow.
- `src/content/navigation.ts` — header and footer links.
- `src/content/faqs.ts` — the five FAQ sections on `/faq`. The `FAQPage`
  structured data is generated from the same array the page renders, so the two
  cannot drift apart.
- `src/content/reviews.ts` — testimonials. See the note above: samples never
  reach a production build.

To confirm a fact, change `proposedFact(...)` to `confirmedFact(...)` (and set
`services[].requiresConfirmation` to `false` for a confirmed service), record
the source, then tick the item in `CONTENT_CONFIRMATION.md`.

## Brand assets

The client's logo (`hohmanns-logo.png`, kept at the project root as the master
file) is the source for everything in `public/brand/`:

| File                                         | Use                                                           |
| -------------------------------------------- | ------------------------------------------------------------- |
| `hohmanns-logo.png`                          | full lockup, light backgrounds — header                       |
| `hohmanns-logo-inverse.png`                  | wordmark recoloured white — footer, Open Graph card           |
| `hohmanns-mark.png`                          | the pipe-H mark on its own                                    |
| `hohmanns-mark-inverse.png`                  | the mark for navy backgrounds                                 |
| `src/app/icon.png`, `src/app/apple-icon.png` | app icon: the mark on a navy rounded square                   |
| `src/app/icon.svg`                           | the same mark redrawn as vector, for browsers that prefer SVG |

`src/components/ui/brand-mark.tsx` exposes `<Logo />` and `<LogoMark />`; pass
`tone="inverse"` on dark backgrounds and a height utility such as `h-9`. The
derivatives were generated from the supplied PNG — regenerate them if the
client sends an updated logo, ideally as SVG.

## Hero carousel

`src/components/sections/hero.tsx` is a three-slide carousel: local relevance
and the phone action, guidance for someone with a problem, and the confirmed
local business details. Slide copy and CTAs live in
`src/content/hero-slides.ts` — the component renders one template.

- Slide 1 is the server-rendered default, so the phone number works before
  hydration.
- Autoplay every 8s, paused on hover, while focus is inside the carousel,
  while the tab is hidden, and whenever `prefers-reduced-motion: reduce` is
  set. Manual navigation restarts a single timer.
- Previous/next buttons, three labelled dots, and left/right arrow keys while
  focus is inside the region. Only manual changes are announced.
- Slide 3 uses no stock photograph: it pairs the confirmed address, phone and
  ABN with the stylised map motif and a directions link built from the
  verified address.

### Hero photography

Slides 1 and 2 use two photographs from **Pexels**, listed in
`src/content/hero-photos.curated.ts`:

| Slide | Photo                                                                                                                                              | Photographer  |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1     | [Plumber tightening a pipe joint with a wrench](https://www.pexels.com/photo/plumber-in-blue-uniform-working-on-pipe-repair-with-wrench-32588548/) | Bulat843      |
| 2     | [Plumber's hands fitting steel pipework](https://www.pexels.com/photo/plumber-s-hands-installing-steel-pipes-indoors-6419128/)                     | Anıl Karakaya |

Both are under the Pexels License: free for commercial use, **no attribution
required**, so nothing is printed on the page. The source and photographer are
recorded in the content file so the provenance stays traceable.

Unsplash's free tier has very little usable plumber-at-work photography —
almost all of it is behind the paid Unsplash+ licence — which is why these
came from Pexels. To swap either one, change the Pexels photo id in
`hero-photos.curated.ts`; `objectPosition` there tunes the crop.

Slide 3 carries no stock photograph at all: it pairs the confirmed address,
phone and ABN with the **real Google Maps embed** of the business listing.

### Optional: sourcing hero photos through the Unsplash API

`scripts/select-unsplash-photos.mjs` implements the compliant Unsplash path if
you would rather use it:

```bash
npm run hero:photos                                   # search and list candidates
node scripts/select-unsplash-photos.mjs --slide1=<id> --slide2=<id>
```

It searches `GET /search/photos` with `orientation=landscape` and
`content_filter=high`, filters unusable results, and prints review links. The
second command fetches the two chosen photos, sends the required
`links.download_location` request for each, and writes
`src/content/hero-photos.generated.json` — `urls.regular` with its `ixid`
intact, dimensions, colour, blur hash, `alt_description`, photographer name
and profile, and the photo's Unsplash page.

Anything it writes takes precedence over the curated pair, and on-page
attribution switches on automatically, because the Unsplash API guidelines
require credit where the Pexels License does not.

`UNSPLASH_ACCESS_KEY` is read from `.env.local` (git-ignored) or the
environment, only ever sent in an `Authorization: Client-ID` header, and never
reaches the browser bundle.

Hero photographs are fetched by the browser straight from the image CDN with a
five-width `srcset` (`heroSrcSet` preserves every existing query parameter,
`ixid` included). That keeps a CDN hiccup from failing a server-side optimiser
request and blanking the hero; slide 1 still gets `loading="eager"` and
`fetchpriority="high"`.

## Photography

The site uses **free-licence stock photographs from Unsplash**, listed in
`src/content/photos.ts`. None of them shows this business, its team, its
vehicles or its work — they are placeholders that make the site read as a real
trade website until the client supplies their own shots.

Every image was checked to be under the free **Unsplash License** (commercial
use, no attribution required). Three otherwise-suitable photos were rejected
because they were Unsplash+ (paid) licences. Credits are recorded in
`photos.ts` anyway.

| Slot                | Photographer       | Source                                                 |
| ------------------- | ------------------ | ------------------------------------------------------ |
| Hero background     | Quilia             | [60krlMMeWxU](https://unsplash.com/photos/60krlMMeWxU) |
| About               | bhagya laxmi       | [jaP5ClBdIyU](https://unsplash.com/photos/jaP5ClBdIyU) |
| Service area        | NIR HIMI           | [UzuvmyVJvPs](https://unsplash.com/photos/UzuvmyVJvPs) |
| General plumbing    | Imani              | [vDQ-e3RtaoE](https://unsplash.com/photos/vDQ-e3RtaoE) |
| Blocked drains      | Timur Shakerzianov | [wzIjLL4KB-4](https://unsplash.com/photos/wzIjLL4KB-4) |
| Hot water           | Timur Shakerzianov | [kxuz4YrLxSc](https://unsplash.com/photos/kxuz4YrLxSc) |
| Gas fitting         | Henning Wiekhorst  | [KBytvj1EPl4](https://unsplash.com/photos/KBytvj1EPl4) |
| Leaks & burst pipes | Timur Shakerzianov | [c314Gh8dXAo](https://unsplash.com/photos/c314Gh8dXAo) |
| Commercial          | Immo Wegmann       | [U0jpGKtMtWE](https://unsplash.com/photos/U0jpGKtMtWE) |

### Where they come from at runtime

By default they are served straight from the Unsplash CDN, which already
handles format negotiation and resizing — so `src/components/ui/photo.tsx`
renders a plain `<img>` with an explicit `srcset` rather than routing every
request through Next's image optimiser. `images.unsplash.com` is allowed in
the CSP `img-src`.

To self-host them instead:

```bash
npm run photos                      # downloads into public/images/
# then in .env.local:
NEXT_PUBLIC_PHOTO_SOURCE=local
```

`photoUrl()` in `photos.ts` switches every reference over — nothing else
changes. Do this before launch so the live site has no third-party image
dependency.

### Swapping in the client's own photos

Replace the entries in `src/content/photos.ts` (and `scripts/photo-manifest.mjs`,
which mirrors it for the download script), or drop the real files into
`public/images/` under the same names and set `NEXT_PUBLIC_PHOTO_SOURCE=local`.
Keep the alt text meaningful.

## Illustrations

`src/components/art/illustrations.tsx` now holds only the stylised
service-area map, which sits behind the Google Maps embed as its loading
state. `src/components/sections/pipe-motif.tsx` draws the abstract pipe line
work on inner page headers and the 404. Both are inline SVG using the colour
tokens, so they cost no network requests.

## Map

The contact and home pages embed the business's own Google Maps listing
(CID 2882896361346668586) through the keyless `output=embed` endpoint — no API
key, nothing to bill, no map script in the bundle.

`src/components/ui/google-map.tsx` renders it lazily, so Google is only
contacted once a visitor scrolls the map into view, and the illustrated map
sits behind the frame as the loading state so nothing shifts. Pass
`mode="facade"` to require a click before Google is contacted at all:

```tsx
<GoogleMap ratio="21 / 9" mode="facade" />
```

`frame-src` in the CSP is scoped to `https://www.google.com` and
`https://maps.google.com`. The embed is disclosed in the privacy policy, and
the "Get directions" link uses the listing coordinates rather than the address
string.

## Security notes

`next.config.ts` sets `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy` and a Content-Security-Policy that
locks down `default-src`, `base-uri`, `form-action`, `frame-ancestors`,
`object-src`, `img-src`, `font-src` and `connect-src`.

`script-src`/`style-src` allow `'unsafe-inline'`, because Next.js emits an
inline bootstrap script and this site is fully statically prerendered.
Tightening those two directives requires per-request nonces, which means
middleware and dynamic rendering on every route. That is a deliberate launch
decision, not something to switch on by accident — see the comment in
`next.config.ts`.

`'unsafe-eval'` and a websocket `connect-src` are added **in development only**
(`NODE_ENV === "development"`). React's dev build uses `eval()` for debugging
features such as reconstructing call stacks, and the dev server needs its HMR
socket; without them `npm run dev` logs _"eval() is not supported in this
environment"_. Neither appears in a production build — check with
`curl -I http://localhost:3000` after `npm run build && npm start`.

Also enforced: `poweredByHeader: false`, server-side validation of every form
field, no personal information in logs/URLs/error messages, and `rel="noopener
noreferrer"` on the only external link (Google Maps directions).

## Deployment

Any Node host that supports Next.js 16 works; the project is deployed on
Vercel from `github.com/Omar-Majeed/Plumber-Work`.

### Environment variables on the host

`NEXT_PUBLIC_SITE_URL` drives every canonical URL, Open Graph URL and sitemap
entry. **Either set it to the real domain or leave it out entirely — do not
create it with an empty value.** A blank variable used to crash the build
(`new URL("")` throws while Next collects page data); `resolveSiteUrl` in
`src/lib/site-config.ts` now treats blank as unset and falls back to Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, then localhost. That is
covered by `tests/unit/site-config.test.ts`.

So on Vercel you can simply not set it and canonicals will point at the
deployment domain, or set it to `https://your-domain.com.au` once the real
domain is live.

`SITE_STAGE` is unset by default, which means **demo stage** — and demo stage
serves `robots.txt` with `Disallow: /`. That is deliberate while content is
unconfirmed. Set `SITE_STAGE=production` only after
`npm run validate:production` passes; the `prebuild` gate enforces it.

### Before going live

1. Complete `CONTENT_CONFIRMATION.md`.
2. Set `NEXT_PUBLIC_SITE_URL` to the confirmed domain.
3. Set `SITE_STAGE=production` and confirm the build passes the gate.
4. Configure the enquiry delivery adapter and a shared rate-limit store.
5. Submit `sitemap.xml` and verify the Google Business Profile.

## Launch checklist

→ [CONTENT_CONFIRMATION.md](./CONTENT_CONFIRMATION.md)

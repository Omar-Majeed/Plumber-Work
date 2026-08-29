# Content confirmation checklist

The site publishes **only content confirmed against the business's public
listing**, plus the service catalogue confirmed in the production homepage
specification. Nothing on any public page asserts availability, credentials,
history, pricing, warranties or coverage area, because none of that has been
supplied.

Every published claim is tracked as a `ContentFact` in `src/content/`, and the
build enforces it: `SITE_STAGE=production npm run build` fails if any
production-visible item is unconfirmed. It currently passes.

Run `npm run validate:production` to see the live report.

---

## 1. Confirmed and published

Source: the business's public listing (research snapshot, 27 August 2026).
Reference data only, never fetched at runtime.

- [x] **Legal business name** - Hohmanns Plumbing Services P/L
- [x] **Public category** - Plumbers & Gasfitters
- [x] **Phone** - (07) 4922 4351 (`tel:+61749224351`)
- [x] **Street address** - 290 Bolsover Street, Rockhampton City QLD 4700, Australia
- [x] **ABN** - 48 324 274 959

Source: the production homepage specification supplied by the business.

- [x] **Service catalogue** - the six categories in `src/content/services.ts`

### Address discrepancy - resolve this first

Two public sources disagree about this business:

|        | Yellow Pages listing           | Google Maps listing                       |
| ------ | ------------------------------ | ----------------------------------------- |
| Name   | Hohmanns Plumbing Services P/L | Hohmann&rsquo;s Plumbing Services Pty Ltd |
| Street | 290 Bolsover **Street**        | 290 Bolsover **Lane**                     |

The site shows the Yellow Pages version. The map pin and the "Get directions"
link use the coordinates from the Google listing (-23.3835283, 150.5154954,
CID 2882896361346668586), so they are correct either way.

- [ ] Confirm the correct street and the exact registered name, then update
      `business.legalName` and `business.address` in `src/content/business.ts`.

---

## 2. Deliberately not published

None of the following appears anywhere on the site. Each is content the
business can add later; until it arrives the site stays silent rather than
publishing a plausible guess. None of them blocks a release.

| Item                              | What is needed                                                             | Where it would appear         |
| --------------------------------- | -------------------------------------------------------------------------- | ----------------------------- |
| **Opening hours**                 | The real trading hours                                                     | Location section, footer, JSON-LD |
| **After-hours / emergency**       | Whether out-of-hours work is offered, and on what terms                    | Home, services, FAQ           |
| **QBCC licence number**           | The number, checked against the QBCC public register before publishing     | Footer, About                 |
| **Public email address**          | A real monitored address. The enquiry form is the written path until then  | Footer, Contact               |
| **Customer reviews**              | A verified review source. Invented quotations are never published          | Home                          |
| **Photography**                   | Client-approved photos of the business, team, vehicles and premises        | Hero, Home, About, Services   |

### Why the review section is absent

There is no testimonial section and no empty-state placeholder. Publishing
invented quotations under a real trading name is not something this site will
do, and an "add reviews here" panel on a live page reads as unfinished. When a
verified review source exists, add the section then.

---

## 3. Photography

`src/content/hero-photos.curated.ts` and `src/content/photos.ts` hold licensed
stock photography. **None of it shows this business, its staff, its vehicles or
its work.** Alt text describes the scene only, and no copy anywhere calls the
people in them "our team".

- Hero slides 1 and 2 use Pexels photographs (Pexels License: free for
  commercial use, no attribution required). Credits are recorded in the source
  file so the origin stays traceable.
- **Hero slide 3 has no photograph.** It uses the branded navy treatment,
  because publishing an arbitrary streetscape under "Find Hohmanns in
  Rockhampton City" would imply a location identity the image does not have.
  It needs either client premises photography or an accurately sourced
  Rockhampton image.

### Sourcing Unsplash photography

`scripts/select-unsplash-photos.mjs` calls the official Unsplash search API,
records exactly what the API returns (including `ixid`), and sends the required
`links.download_location` request for each selected photo. It needs a
server-side `UNSPLASH_ACCESS_KEY`:

```
UNSPLASH_ACCESS_KEY=... npm run hero:photos -- --query="plumber at work"
UNSPLASH_ACCESS_KEY=... npm run hero:photos -- --slide1=<id> --slide2=<id>
```

Anything sourced through the API renders on-page photographer and Unsplash
credit automatically, as the API guidelines require. The key is never read in
client code and never committed.

---

## 4. Before launch

- [ ] Resolve the address and registered-name discrepancy above.
- [ ] Replace stock photography with client-approved images, or run the
      Unsplash script with a key and supply a slide 3 photograph.
- [ ] Add any of the section 2 items the business wants published, moving each
      to `confirmedFact()` as it is signed off.
- [ ] Set `SITE_STAGE=production` and `NEXT_PUBLIC_SITE_URL` in the hosting
      environment.
- [ ] Configure `CONTACT_DELIVERY_PROVIDER` and its credentials so enquiries
      are actually delivered. Until then the form reports honestly that it has
      not sent anything.

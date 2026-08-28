# Content confirmation checklist

This site presents as a finished product. To do that it uses **realistic
sample content** — hours, service areas, credentials, promises, the company
story, the FAQ answers and the testimonials are all placeholders written for
the demo.

Every one of them is tracked as a `ContentFact` in `src/content/`, and the
build enforces it: `SITE_STAGE=production npm run build` fails while any
production-visible item below is still unconfirmed.

Run `npm run validate:production` at any time to see the current blocking list.

---

## 1. Confirmed public facts

Source: the business's public listing (research snapshot, 27 August 2026).
Used as reference data only — never fetched at runtime.

- [x] **Legal business name** — Hohmanns Plumbing Services P/L
- [x] **Public category** — Plumbers & Gasfitters
- [x] **Phone** — (07) 4922 4351 (`tel:+61749224351`)
- [x] **Street address** — 290 Bolsover Street, Rockhampton City QLD 4700, Australia
- [x] **ABN** — 48 324 274 959

Everything below is **sample content and not confirmed**.

### Address discrepancy — resolve this first

Two public sources disagree about this business:

|        | Yellow Pages listing           | Google Maps listing                       |
| ------ | ------------------------------ | ----------------------------------------- |
| Name   | Hohmanns Plumbing Services P/L | Hohmann&rsquo;s Plumbing Services Pty Ltd |
| Street | 290 Bolsover **Street**        | 290 Bolsover **Lane**                     |

The site currently shows the Yellow Pages version. The map pin and the
"Get directions" link use the coordinates from the Google listing
(-23.3835283, 150.5154954, CID 2882896361346668586), so they are correct
either way.

- [ ] Confirm the correct street name with the business
- [ ] Confirm whether the trading name carries an apostrophe
- [ ] Update `src/content/business.ts` and the Google Business Profile so the
      name, address and phone match exactly across both — NAP consistency is a
      direct local-SEO ranking factor

---

## 2. Sample content now published on the site

Each row is currently rendered as if it were fact. Replace the value in
`src/content/`, change `proposedFact(...)` to `confirmedFact(...)`, record the
source, then tick the box.

| Item                               | What the site currently says                                                       | Where it appears                                              | Why it matters                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [ ] Opening hours                  | Mon–Fri 7:00am–4:30pm, Sat 8:00am–12:00pm, Sun closed                              | Header strip, contact, footer, service pages, structured data | Wrong hours generate calls nobody answers, and they are published in `openingHoursSpecification`                                            |
| [ ] After-hours call-outs          | "Burst pipes, blocked sewers and gas faults are handled outside office hours"      | Hero, trust strip, FAQ, service pages                         | An availability promise; enforceable under Australian Consumer Law if untrue                                                                |
| [ ] QBCC licence                   | Badge says "QBCC licensed plumber & gasfitter". **No licence number is published** | About, footer                                                 | A number must never be invented — get the real one and check it on the QBCC public register before publishing it                            |
| [ ] Insurance                      | "Public liability insured"                                                         | About, footer                                                 | Needs a current certificate of currency                                                                                                     |
| [ ] Industry membership            | "Master Plumbers member"                                                           | About, footer                                                 | Remove unless the membership is current                                                                                                     |
| [ ] Established 1998 / "25+ years" | "Serving Rockhampton since 1998"                                                   | Hero, about, footer, stats                                    | An invented history is the fastest way to lose trust                                                                                        |
| [ ] Team size                      | "6 licensed tradespeople"                                                          | About, home stats                                             |                                                                                                                                             |
| [ ] Service radius                 | "60km service radius" and the 15-suburb list                                       | Home, services, contact, FAQ, structured data                 | Drives both SEO and customer expectation; published in `areaServed`                                                                         |
| [ ] Upfront pricing                | "You approve the price before any work starts"                                     | Home, FAQ, service pages                                      | Pricing claims are directly enforceable                                                                                                     |
| [ ] Free written quotes            | "Free on scheduled work"                                                           | Home, FAQ                                                     |                                                                                                                                             |
| [ ] No call-out fee                | "There is no separate call-out fee"                                                | FAQ                                                           |                                                                                                                                             |
| [ ] 12-month workmanship warranty  | Stated in hero, promises, process, FAQ, stats                                      | Home, about, FAQ                                              | An enforceable promise — needs the actual written terms                                                                                     |
| [ ] Payment methods and terms      | Cash, EFTPOS, Visa/Mastercard, transfer; 14-day account terms                      | FAQ                                                           |                                                                                                                                             |
| [ ] Company story and values       | Three paragraphs plus three "how we operate" cards                                 | Home, about                                                   |                                                                                                                                             |
| [ ] Email address                  | office@hohmannsplumbing.com.au                                                     | Contact, footer, structured data                              | Domain may not exist — confirm before publishing                                                                                            |
| [ ] Service list and page copy     | Six services, their "what the job covers" lists and FAQs                           | Home, services, service pages                                 | The listing confirms the _category_ only                                                                                                    |
| [ ] FAQ answers                    | 21 answers across five sections                                                    | /faq, `FAQPage` structured data                               | Each one is a public statement about how the business operates                                                                              |
| [ ] Publishing the street address  | Full address shown                                                                 | Home, contact, footer, structured data                        | Some trades prefer not to publish one                                                                                                       |
| [ ] Embedding Google Maps          | Live map on the home and contact pages                                             | Home, contact, privacy policy                                 | Third-party embed — Google sets its own cookies; disclosed in the privacy policy. Pass `mode="facade"` to `<GoogleMap />` for click-to-load |

---

## 3. Testimonials — handled differently on purpose

The three quotes in `src/content/reviews.ts` are **samples**. Inventing
customer reviews under a real trading name is not something this site will
publish, so:

- each entry is flagged `isSample: true` and attributed to "Placeholder name";
- a "Sample layout" note appears above the section in the demo stage;
- `visibleReviews` filters samples out entirely once `SITE_STAGE=production`,
  and the section falls back to "Verified customer reviews will appear here."

- [ ] Connect the business's verified review source (Google Business Profile,
      Product Review, etc.)
- [ ] Replace the contents of `src/content/reviews.ts` with real quotes,
      real first names and the real ratings
- [ ] Set `isSample: false` on each entry
- [ ] Decide whether to publish an `aggregateRating` (only with a verified
      count behind it)

---

## 4. Required brand assets

- [x] Logo supplied by the client (`hohmanns-logo.png`). Inverse, mark-only
      and app-icon derivatives generated from it into `public/brand/`.
- [ ] Ask for the **vector** original (SVG or AI/EPS) if one exists — the
      supplied PNG is 2048px wide, which is enough for the web but not for
      signage or print
- [x] Favicon and app icon generated from the supplied mark
      `src/app/icon.svg` and `src/components/ui/brand-mark.tsx`
- [ ] Confirmation that the navy / aqua / orange palette is approved
- [ ] Any existing brand colours or fonts already used on vehicles, invoices
      or signage

---

## 5. Photography

The site uses **free-licence Unsplash stock photography** (listed in
`src/content/photos.ts`, credited in README.md). None of it shows this
business, its team, its vehicles or its work. It makes the site read as real,
but until the client's own photos are in, the site is showing other people's
premises and hands to your customers — this is the highest-value item on the
list.

Every image was checked to be under the free Unsplash License (commercial use,
no attribution required); three otherwise-suitable photos were rejected for
being Unsplash+ (paid).

Brief: **4:3, at least 1600×1200**, natural daylight, clean branded workwear or
vehicle, a real Rockhampton setting, no staged stock-photo gestures.

- [ ] Owner or lead tradesperson portrait — `/about`
- [ ] Team photo — `/about`
- [ ] Branded vehicle — replaces the stock van on `/` and `/contact`
- [ ] One photo per service — six needed, for the cards and service pages
- [ ] Hero shots — carousel slides 1 and 2 currently use two Pexels
      photographs (free commercial licence, no attribution required). They are
      contextual stock: they do not show this business, and no copy may call
      them "our team" or "our van". Slide 3 uses the real Google Maps listing,
      not a photograph
- [ ] Two to four completed jobs
- [ ] Licence evidence (QBCC card or register screenshot) — for verification
- [ ] Run `npm run photos` and set `NEXT_PUBLIC_PHOTO_SOURCE=local` so the live
      site self-hosts its images instead of depending on the Unsplash CDN

---

## 6. Required legal review

- [ ] `/privacy` reviewed by an Australian legal adviser against the Privacy
      Act 1988 (Cth) and the Australian Privacy Principles
- [ ] `/terms` reviewed, including against Australian Consumer Law
- [ ] Data-retention period for enquiry submissions confirmed and written into
      the privacy policy
- [ ] Complaints-handling contact confirmed
- [ ] Warranty and pricing wording checked against what is actually offered

Both pages are plain-language **templates**. They display a "template, not
legal advice" notice while `SITE_STAGE=demo`, and the source files carry a
`PRE-LAUNCH LEGAL REVIEW REQUIRED` comment. Having these pages does not make
the site compliant.

---

## 7. Required form-delivery configuration

- [ ] Destination for enquiries confirmed (email address, or CRM)
- [ ] Delivery adapter implemented in `src/lib/enquiry-delivery.ts`
- [ ] `CONTACT_DELIVERY_PROVIDER` and `CONTACT_RECIPIENT_EMAIL` set
- [ ] Rate limiting moved from the in-process map to a shared store
- [ ] End-to-end test: a real submission arrives, and a forced failure shows
      the honest error rather than a success message

Until this is done the form validates fully and transmits nothing, reporting
"Demo only — this enquiry has not been sent."

---

## 8. SEO and Google Business tasks

- [ ] Confirm the preferred domain, and set `NEXT_PUBLIC_SITE_URL`
- [ ] Create or claim the Google Business Profile and verify it
- [ ] Make sure the hours, address and phone on this site match the profile
      exactly (NAP consistency)
- [ ] Confirm the suburb list before leaving it in `areaServed`
- [x] `geo` coordinates published, taken from the business's own Google listing
- [ ] Add `aggregateRating` only once a verified review count exists
- [ ] Submit `sitemap.xml` in Google Search Console

**Phase 2 recommendation — suburb pages.** No suburb landing pages have been
created. Thin, near-duplicate suburb pages are doorway pages and are a
liability. Once the real service area is confirmed, add a small number only
where there is genuinely distinct, useful content (local water pressure, common
pipework age, council requirements).

---

## 9. Approved for production

All of the following must be true before `SITE_STAGE=production`:

- [ ] Every box in sections 2–8 above is ticked
- [ ] `npm run validate:production` exits 0
- [ ] Every `proposedFact` that renders in production-visible content has
      become a `confirmedFact` with a recorded source
- [ ] `services[].requiresConfirmation` is `false` for every published service
- [ ] Real reviews have replaced the samples, or the section is hidden
- [ ] The client's logo has replaced the placeholder mark and favicon
- [ ] Privacy and terms have been legally reviewed and the demo notice is gone
- [ ] Enquiry delivery has been tested end to end
- [ ] `NEXT_PUBLIC_SITE_URL` points at the confirmed canonical domain
- [ ] `npm run verify` passes
- [ ] A final read-through confirms no claim appears on the site that the
      business has not put in writing

**Signed off by:** ______________________ **Date:** ____________

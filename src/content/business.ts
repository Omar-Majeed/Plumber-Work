import { confirmedFact, proposedFact, type ContentFact } from "@/lib/content-facts";

/**
 * Single source of truth for business identity.
 *
 * Everything published to a visitor is derived from the five details confirmed
 * against the public business listing for Hohmanns Plumbing Services P/L
 * (research snapshot: 27 August 2026). The listing is reference data only;
 * nothing here is fetched at runtime.
 *
 * Deliberately absent, because none of it has been supplied by the business:
 * opening hours, emergency or after-hours availability, response-time or
 * same-day claims, a QBCC licence number, insurance or membership badges,
 * years in business, team size, ownership history, pricing or warranty
 * promises, and a service radius. Nothing on this site may state any of those
 * until the business confirms them.
 *
 * No phone number, address or ABN literal may appear anywhere else in the
 * codebase.
 */

const LISTING_SOURCE =
  "Public business listing, Yellow Pages (research snapshot, 27 August 2026)";

export const business = {
  legalName: "Hohmanns Plumbing Services P/L",
  displayName: "Hohmanns Plumbing Services",
  shortName: "Hohmanns",
  descriptor: "Plumbers & Gasfitters",
  abn: "48 324 274 959",
  phone: {
    display: "(07) 4922 4351",
    href: "tel:+61749224351",
    /** Digits-only form for structured data. */
    e164: "+61749224351",
  },
  address: {
    street: "290 Bolsover Street",
    locality: "Rockhampton City",
    region: "QLD",
    postcode: "4700",
    country: "Australia",
    countryCode: "AU",
    /** Canonical single-line form used in body copy. */
    singleLine: "290 Bolsover Street, Rockhampton City QLD 4700",
    /** Shorter form for tight spaces such as the hero supporting line. */
    shortLine: "290 Bolsover Street, Rockhampton City",
    /** Canonical multi-line form used in the footer and contact page. */
    lines: [
      "290 Bolsover Street",
      "Rockhampton City QLD 4700",
      "Australia",
    ] as const,
  },
  primaryMarket: "Rockhampton City, Queensland",

  /**
   * Exact position of the business's Google Maps listing.
   *
   * Taken from the Google Maps place page for "Hohmann's Plumbing Services Pty
   * Ltd" (CID 2882896361346668586). Using coordinates rather than a text
   * address means the pin and the directions link are unambiguous.
   *
   * NOTE, address discrepancy to resolve: Google lists the business at
   * 290 Bolsover **Lane**, while the Yellow Pages listing says 290 Bolsover
   * **Street**. Google also spells the name "Hohmann's ... Pty Ltd". Tracked in
   * CONTENT_CONFIRMATION.md; the coordinates below are correct either way.
   */
  geo: {
    latitude: -23.3835283,
    longitude: 150.5154954,
  },

  googleMaps: {
    /** Canonical short link to the listing. */
    placeUrl: "https://maps.google.com/?cid=2882896361346668586",
    cid: "2882896361346668586",
  },
} as const;

/**
 * Google Maps embed.
 *
 * Uses the keyless `output=embed` endpoint, so there is no API key to leak and
 * nothing to bill. The iframe is lazy-loaded, so Google is only contacted once
 * a visitor scrolls the map into view. See `components/ui/google-map.tsx` and
 * the disclosure in the privacy policy.
 */
export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${business.geo.latitude},${business.geo.longitude}`,
)}&z=16&hl=en&output=embed`;

/**
 * Directions link. Built from the listing's coordinates rather than the address
 * string, so it is unaffected by the Street/Lane discrepancy noted above.
 */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${business.geo.latitude},${business.geo.longitude}`,
)}`;

/**
 * Published copy.
 *
 * Every line below restates a verified fact or describes how to make contact.
 * None of it asserts availability, credentials, history, pricing or coverage.
 */
export const siteCopy = {
  /** Local business introduction, home page. */
  introduction: [
    `${business.legalName} is a plumbing and gasfitting business at ${business.address.singleLine}.`,
    "Work is arranged directly with the business. Call the office, or send an enquiry with the job and property details and the business will come back to you about the next step.",
  ] as const,

  /** Four factual reasons to make contact. No availability or credential claims. */
  reasons: [
    {
      title: "A direct phone number",
      detail: `Calls go straight to the business on ${business.phone.display}, not to a booking service.`,
      icon: "phone",
    },
    {
      title: "Based in Rockhampton City",
      detail: `The business operates from ${business.address.street}, ${business.address.locality}.`,
      icon: "map-pin",
    },
    {
      title: "Plumbing and gasfitting",
      detail:
        "General repairs, blocked drains, hot water, gas fitting, leaks and commercial maintenance.",
      icon: "wrench",
    },
    {
      title: "Registered business details",
      detail: `Trading as ${business.legalName}, ABN ${business.abn}.`,
      icon: "badge",
    },
  ] as const,

  /** Three-step enquiry process. Describes the process, promises no timing. */
  process: [
    {
      title: "Call or send an enquiry",
      detail: `Ring ${business.phone.display} during business hours, or use the enquiry form on this page.`,
    },
    {
      title: "Share the job and location details",
      detail:
        "Describe what is happening, which fixture or area is affected, and the suburb or address of the property.",
    },
    {
      title: "Discuss the next step with the business",
      detail:
        "The business will talk through what the job involves and what needs to happen next.",
    },
  ] as const,

  /** Compact verified-fact strip, directly below the hero. */
  verifiedStrip: [
    { label: "Trade", value: business.descriptor, href: undefined },
    { label: "Location", value: business.address.locality, href: undefined },
    { label: "Phone", value: business.phone.display, href: business.phone.href },
    { label: "ABN", value: business.abn, href: undefined },
  ] as readonly {
    readonly label: string;
    readonly value: string;
    readonly href?: string;
  }[],
} as const;

export const businessFacts: readonly ContentFact<unknown>[] = [
  confirmedFact({
    id: "business.legalName",
    label: "Registered legal business name",
    category: "identity",
    value: business.legalName,
    source: LISTING_SOURCE,
    productionVisible: true,
    affects: ["layout", "/", "/about", "footer", "structured-data"],
  }),
  confirmedFact({
    id: "business.descriptor",
    label: "Public trade category (Plumbers & Gasfitters)",
    category: "identity",
    value: business.descriptor,
    source: LISTING_SOURCE,
    productionVisible: true,
    affects: ["header", "footer", "/", "/about"],
  }),
  confirmedFact({
    id: "business.phone",
    label: "Business telephone number",
    category: "contact",
    value: business.phone.display,
    source: LISTING_SOURCE,
    productionVisible: true,
    affects: ["header", "footer", "/", "/contact", "structured-data"],
  }),
  confirmedFact({
    id: "business.address",
    label: "Street address",
    category: "location",
    value: business.address.singleLine,
    source: LISTING_SOURCE,
    productionVisible: true,
    affects: ["footer", "/", "/contact", "structured-data"],
  }),
  confirmedFact({
    id: "business.abn",
    label: "Australian Business Number",
    category: "identity",
    value: business.abn,
    source: LISTING_SOURCE,
    productionVisible: true,
    affects: ["footer", "/", "/contact", "structured-data"],
  }),

  /* ----------------------------------------------------------------------
     Outstanding items. None of these render as a claim anywhere on the site,
     so none of them blocks a production release. Each one is content the
     business can add later; until it arrives, the site simply stays silent
     about it rather than publishing a plausible guess.
     ---------------------------------------------------------------------- */
  proposedFact({
    id: "business.openingHours",
    label: "Opening hours (not published; no hours are shown anywhere)",
    category: "availability",
    value: null,
    source: "Required from the business before any hours can be published",
    productionVisible: false,
    affects: ["/", "/contact", "footer", "structured-data"],
  }),
  proposedFact({
    id: "business.afterHours",
    label: "After-hours or emergency availability (not published)",
    category: "availability",
    value: null,
    source: "Required from the business before any availability claim is made",
    productionVisible: false,
    affects: ["/", "/services", "/faq"],
  }),
  proposedFact({
    id: "business.qbccLicence",
    label: "QBCC contractor licence number (not published)",
    category: "credentials",
    value: null,
    source:
      "Required from the business. Verify against the QBCC public register before publishing a number",
    productionVisible: false,
    affects: ["footer", "/about"],
  }),
  proposedFact({
    id: "business.email",
    label:
      "Public email address (not published; the enquiry form is the written path)",
    category: "contact",
    value: null,
    source: "Required from the business before an address is published",
    productionVisible: false,
    affects: ["footer", "/contact"],
  }),
  proposedFact({
    id: "business.reviews",
    label: "Customer reviews (no review section is published)",
    category: "social-proof",
    value: null,
    source:
      "Required from the business. Connect a verified review source; invented quotations are never published",
    productionVisible: false,
    affects: ["/"],
  }),
  proposedFact({
    id: "business.photography",
    label: "Client-approved photography of the business, team and vehicles",
    category: "asset",
    value: null,
    source:
      "Licensed stock photography is in place. None of it shows this business, its team or its work; replace before launch",
    productionVisible: false,
    affects: ["/", "/about", "/services"],
  }),
];

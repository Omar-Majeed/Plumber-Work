import { confirmedFact, proposedFact, type ContentFact } from "@/lib/content-facts";

/**
 * Single source of truth for business identity.
 *
 * `business` holds the five details confirmed against the public listing for
 * Hohmanns Plumbing Services P/L (research snapshot: 27 August 2026). The
 * listing is reference data only — nothing here is fetched at runtime.
 *
 * `profile` holds realistic SAMPLE content used to present the site as a
 * finished product. Every value in `profile` is a placeholder written for the
 * demo and must be replaced with the business's own details before launch —
 * each one is tracked in `businessFacts` below and in CONTENT_CONFIRMATION.md,
 * and the production content gate blocks a release until they are confirmed.
 *
 * No phone number or address literal may appear anywhere else in the codebase.
 */

const LISTING_SOURCE =
  "Public business listing, Yellow Pages (research snapshot, 27 August 2026)";
const SAMPLE_SOURCE =
  "Sample content written for the demo — replace with the business's own details";

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
    singleLine: "290 Bolsover Street, Rockhampton City, QLD 4700",
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
   * NOTE — address discrepancy to resolve: Google lists the business at
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
 * a visitor scrolls the map into view — see `components/ui/google-map.tsx` and
 * the disclosure in the privacy policy.
 */
export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${business.geo.latitude},${business.geo.longitude}`,
)}&z=16&hl=en&output=embed`;

/* ------------------------------------------------------------------------- */
/* SAMPLE PROFILE — replace before launch                                     */
/* ------------------------------------------------------------------------- */

export interface OpeningHours {
  readonly days: string;
  readonly hours: string;
  readonly closed?: boolean;
}

export const profile = {
  /** Shown as the public email address. */
  email: "office@hohmannsplumbing.com.au",

  established: 1998,
  establishedLabel: "Serving Rockhampton since 1998",

  openingHours: [
    { days: "Monday – Friday", hours: "7:00am – 4:30pm" },
    { days: "Saturday", hours: "8:00am – 12:00pm" },
    { days: "Sunday", hours: "Closed", closed: true },
  ] as readonly OpeningHours[],

  /** Compact form used in the header strip and structured data. */
  hoursSummary: "Mon–Fri 7:00am–4:30pm · Sat 8:00am–12:00pm",

  afterHours: {
    available: true,
    label: "After-hours call-outs",
    detail:
      "Burst pipes, blocked sewers and gas faults are handled outside office hours. Call the same number and follow the prompts.",
  },

  credentials: {
    /**
     * Deliberately no licence number.
     *
     * Publishing an invented QBCC licence number against a real trading name
     * would be a fabricated credential, so the badge stays generic until the
     * business supplies the real number and it has been checked against the
     * QBCC public register. Add it here, then surface it in the footer.
     */
    qbccNumber: null as string | null,
    badges: [
      "QBCC licensed plumber & gasfitter",
      "Public liability insured",
      "Master Plumbers member",
    ] as const,
  },

  promises: [
    {
      title: "Upfront pricing",
      detail: "You approve the price before any work starts. No hourly surprises.",
    },
    {
      title: "12-month workmanship warranty",
      detail: "Every job is backed in writing, on top of manufacturer warranties.",
    },
    {
      title: "Tidy finish",
      detail: "Drop sheets down, boots off, and the site left clean.",
    },
    {
      title: "Free written quotes",
      detail: "On scheduled work — quoted on site or from photos where we can.",
    },
  ] as const,

  stats: [
    { value: "25+", label: "Years in Rockhampton" },
    { value: "6", label: "Licensed tradespeople" },
    { value: "60km", label: "Service radius" },
    { value: "12mth", label: "Workmanship warranty" },
  ] as const,

  serviceAreas: [
    "Rockhampton City",
    "North Rockhampton",
    "Frenchville",
    "Norman Gardens",
    "Park Avenue",
    "Berserker",
    "Wandal",
    "Allenstown",
    "The Range",
    "Kawana",
    "Gracemere",
    "Parkhurst",
    "Yeppoon",
    "Emu Park",
    "Mount Morgan",
  ] as const,

  serviceRadiusNote:
    "Based in Rockhampton City and working across the region, from Gracemere out to the Capricorn Coast.",

  payment: {
    methods: ["Cash", "EFTPOS", "Visa & Mastercard", "Bank transfer"] as const,
    terms:
      "Payment on completion for domestic work, 14-day terms for account customers.",
  },

  story: [
    "Hohmanns Plumbing Services has worked out of Bolsover Street since the late nineties, and most of the work still comes from people who have used us before or been sent by a neighbour.",
    "The jobs are the ordinary ones: a hot water unit that quit on a Sunday, a drain that has been slow for months, a gas cooktop that needs connecting properly. We turn up when we say we will, explain what we found, and give you the price before we start.",
    "It is a small team, which is deliberate. You are dealing with the people doing the work, not a call centre, and the tradesperson who quoted the job is usually the one who does it.",
  ] as const,

  values: [
    {
      title: "Straight answers",
      detail:
        "If a repair will only buy you six months, we say so. If it is worth repairing, we say that too.",
    },
    {
      title: "One point of contact",
      detail:
        "Ring the office and you get someone in Rockhampton who knows the job you booked.",
    },
    {
      title: "Priced before we start",
      detail:
        "You see the number and agree to it first. Variations get discussed, not assumed.",
    },
  ] as const,
} as const;

/**
 * Directions link. Built from the listing's coordinates rather than the address
 * string, so it is unaffected by the Street/Lane discrepancy noted above.
 */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${business.geo.latitude},${business.geo.longitude}`,
)}`;

export const emailHref = `mailto:${profile.email}`;

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
     Sample content. Each of these renders on the site as finished copy, so
     each one blocks a production release until the business confirms it.
     ---------------------------------------------------------------------- */
  proposedFact({
    id: "business.openingHours",
    label: "Opening hours (currently Mon–Fri 7:00–4:30, Sat 8:00–12:00)",
    category: "availability",
    value: profile.hoursSummary,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/contact", "footer", "structured-data"],
  }),
  proposedFact({
    id: "business.afterHours",
    label: "After-hours / emergency call-out availability",
    category: "availability",
    value: profile.afterHours.available,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/services", "/services/[slug]", "/faq", "header"],
  }),
  proposedFact({
    id: "business.qbccLicence",
    label: "QBCC contractor licence number (no number is published yet)",
    category: "credentials",
    value: profile.credentials.qbccNumber,
    source:
      "Required from the business — verify against the QBCC public register before publishing a number",
    productionVisible: true,
    affects: ["/about", "footer", "structured-data"],
  }),
  proposedFact({
    id: "business.credentialBadges",
    label: "Licence, insurance and membership claims shown as badges",
    category: "credentials",
    value: profile.credentials.badges,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/about", "footer"],
  }),
  proposedFact({
    id: "business.established",
    label: 'Year established and "25+ years" claim',
    category: "identity",
    value: profile.established,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/about", "footer"],
  }),
  proposedFact({
    id: "business.story",
    label: "Company story, values and team size",
    category: "identity",
    value: profile.story,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/about"],
  }),
  proposedFact({
    id: "business.stats",
    label: "Headline statistics (years, team size, radius, warranty)",
    category: "identity",
    value: profile.stats,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/about"],
  }),
  proposedFact({
    id: "business.serviceArea",
    label: "Suburbs served and 60km travel radius",
    category: "location",
    value: profile.serviceAreas,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/services", "/faq", "structured-data"],
  }),
  proposedFact({
    id: "business.pricing",
    label: "Upfront pricing, free quotes and payment terms",
    category: "pricing",
    value: profile.promises,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/contact", "/faq", "/services/[slug]"],
  }),
  proposedFact({
    id: "business.warranty",
    label: "12-month workmanship warranty",
    category: "pricing",
    value: "12 months",
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/", "/about", "/faq"],
  }),
  proposedFact({
    id: "content.faq",
    label: "FAQ answers on /faq (booking, pricing, urgent, licensing, area)",
    category: "service",
    value: "faqGroups",
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/faq", "structured-data"],
  }),
  proposedFact({
    id: "business.email",
    label: "Public enquiry email address",
    category: "contact",
    value: profile.email,
    source: SAMPLE_SOURCE,
    productionVisible: true,
    affects: ["/contact", "footer", "form-delivery", "structured-data"],
  }),
  proposedFact({
    id: "business.socialProfiles",
    label: "Social media profiles",
    category: "social-proof",
    value: null,
    source: "Required from the business — footer icons stay off until supplied",
    productionVisible: false,
    affects: ["footer", "structured-data"],
  }),
  proposedFact({
    id: "business.reviews",
    label: "Verified review source, rating and review count",
    category: "social-proof",
    value: null,
    source:
      "Required from the business — the sample testimonials are demo-stage only and never render in production",
    productionVisible: true,
    affects: ["/"],
  }),
  proposedFact({
    id: "business.addressDisplay",
    label: "Confirmation that the street address may be published",
    category: "location",
    value: business.address.singleLine,
    source:
      "Required from the business — some trades prefer not to publish an address",
    productionVisible: true,
    affects: ["/", "/contact", "footer", "structured-data"],
  }),
  proposedFact({
    id: "business.addressDiscrepancy",
    label:
      'Bolsover STREET (Yellow Pages) vs Bolsover LANE (Google), and "Hohmanns \u2026 P/L" vs "Hohmann\u2019s \u2026 Pty Ltd"',
    category: "location",
    value: business.address.street,
    source:
      "Two public sources disagree \u2014 confirm the correct street and legal-name spelling with the business, then fix it here and on the Google Business Profile",
    productionVisible: true,
    affects: [
      "/",
      "/contact",
      "footer",
      "structured-data",
      "google-business-profile",
    ],
  }),
  confirmedFact({
    id: "business.geo",
    label: "Map coordinates of the business's Google Maps listing",
    category: "location",
    value: `${business.geo.latitude}, ${business.geo.longitude}`,
    source:
      "Google Maps place listing, CID 2882896361346668586 (checked 27 August 2026)",
    productionVisible: true,
    affects: ["/", "/contact", "structured-data"],
  }),
  confirmedFact({
    id: "asset.logo",
    label: "Brand logo (supplied by the client as hohmanns-logo.png)",
    category: "asset",
    value: "public/brand/hohmanns-logo.png",
    source:
      "Supplied by the client, 27 August 2026. Inverse, mark-only and app-icon derivatives generated from it.",
    productionVisible: true,
    affects: ["header", "footer", "favicon", "open-graph"],
  }),
  proposedFact({
    id: "asset.photography",
    label: "Genuine owner / team / vehicle / completed-job photography",
    category: "asset",
    value: null,
    source:
      "Free-licence Unsplash stock is in place so the site reads as real. None of it shows this business, its team, its vans or its work — replace before launch.",
    productionVisible: true,
    affects: ["/", "/about", "/services/[slug]"],
  }),
  proposedFact({
    id: "legal.reviewedPolicies",
    label: "Australian legal review of privacy policy and website terms",
    category: "credentials",
    value: null,
    source: "Required before launch — templates only at present",
    productionVisible: true,
    affects: ["/privacy", "/terms"],
  }),
] as const;

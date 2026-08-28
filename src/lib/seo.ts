import type { Metadata } from "next";
import { business, profile } from "@/content/business";
import { allFaqItems } from "@/content/faqs";
import { absoluteUrl, siteUrl } from "@/lib/site-config";

interface PageMetaInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  /** Set false for utility pages that should stay out of the index. */
  readonly indexable?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  indexable = true,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? undefined : { index: false, follow: true },
    // Images come from the `opengraph-image` / `twitter-image` file
    // conventions in src/app, so they are generated once and stay in sync.
    openGraph: {
      title,
      description,
      url,
      siteName: business.displayName,
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * LocalBusiness (Plumber) structured data.
 *
 * Kept in step with what the page actually says. Hours, email and service
 * areas mirror the sample profile in `content/business.ts`; the coordinates
 * come from the business's own Google Maps listing. Aggregate ratings, reviews
 * and price range stay omitted until the business supplies verified values —
 * see CONTENT_CONFIRMATION.md.
 */
export function plumberStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${siteUrl}/#business`,
    name: business.displayName,
    legalName: business.legalName,
    url: siteUrl,
    telephone: business.phone.e164,
    email: profile.email,
    taxID: business.abn,
    vatID: business.abn,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postcode,
      addressCountry: business.address.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "16:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "12:00",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    hasMap: business.googleMaps.placeUrl,
    areaServed: profile.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
  };
}

/** FAQPage markup for /faq, generated from the same content the page renders. */
export function faqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbStructuredData(
  crumbs: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

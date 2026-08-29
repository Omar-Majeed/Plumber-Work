import type { Metadata } from "next";
import { business } from "@/content/business";
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
 * Carries only what the page itself publishes and the business has confirmed:
 * name, legal name, phone, postal address and ABN, plus a link to the business's
 * own Google Maps listing.
 *
 * Deliberately omitted, because none of it is confirmed: openingHoursSpecification,
 * geo coordinates, areaServed, aggregateRating, review and priceRange. Markup that
 * asserts more than the page does is exactly the kind of claim a search engine
 * penalises and a business cannot stand behind. See CONTENT_CONFIRMATION.md.
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
    hasMap: business.googleMaps.placeUrl,
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

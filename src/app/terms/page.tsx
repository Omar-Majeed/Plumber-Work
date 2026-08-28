import type { Metadata } from "next";
import { business } from "@/content/business";
import { PageHeader } from "@/components/sections/page-header";
import { LegalBody, type LegalSection } from "@/components/sections/legal-body";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Website terms",
  description: `Terms of use for the ${business.displayName} website.`,
  path: "/terms",
});

/*
 * PRE-LAUNCH LEGAL REVIEW REQUIRED.
 * Plain-language template only. Must be reviewed by an Australian legal
 * adviser, including against Australian Consumer Law, before publication.
 * Tracked in CONTENT_CONFIRMATION.md.
 */
const sections: readonly LegalSection[] = [
  {
    heading: "About these terms",
    paragraphs: [
      `These terms apply to your use of this website, operated by ${business.legalName} (ABN ${business.abn}). By using the site you accept them.`,
    ],
  },
  {
    heading: "Information on this site",
    paragraphs: [
      "The information published here is general in nature. It is not advice about your specific plumbing, gasfitting or drainage situation, and it should not be relied on as a substitute for an inspection.",
      "Service categories described on this site are indicative. Nothing on the site is an offer to perform particular work, and no work is agreed until it is confirmed directly with the business.",
    ],
  },
  {
    heading: "Quotes, pricing and scheduling",
    paragraphs: [
      "No price, quote, availability or timeframe is offered through this website. Anything of that kind is agreed directly between you and the business.",
    ],
  },
  {
    heading: "Enquiries",
    paragraphs: [
      "Sending an enquiry through this site does not create a booking and does not guarantee a response within any particular timeframe. If a matter is urgent, call the business.",
      "For gas leaks, contact your gas supplier's emergency line or emergency services first.",
    ],
  },
  {
    heading: "External links",
    paragraphs: [
      "This site links to Google Maps for directions and embeds a Google Map on the contact and home pages. The business is not responsible for the content, availability or privacy practices of external sites.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "The design, text and graphics on this site are owned by the business or used with permission, and may not be reproduced without consent.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "To the extent permitted by law, the business is not liable for loss arising from reliance on general information published on this site. Nothing in these terms excludes rights you have under Australian Consumer Law.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: ["These terms are governed by the laws of Queensland, Australia."],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Website terms"
        crumbs={crumbs}
        intro={<p>The terms that apply to your use of this website.</p>}
      />
      <LegalBody sections={sections} />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

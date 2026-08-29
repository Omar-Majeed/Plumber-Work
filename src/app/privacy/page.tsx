import type { Metadata } from "next";
import { business } from "@/content/business";
import { PageHeader } from "@/components/sections/page-header";
import { LegalBody, type LegalSection } from "@/components/sections/legal-body";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description: `How ${business.displayName} handles personal information submitted through this website.`,
  path: "/privacy",
});

/*
 * PRE-LAUNCH LEGAL REVIEW REQUIRED.
 * Plain-language template only. Must be reviewed by an Australian legal
 * adviser against the Privacy Act 1988 (Cth) and the Australian Privacy
 * Principles before publication. Tracked in CONTENT_CONFIRMATION.md.
 */
const sections: readonly LegalSection[] = [
  {
    heading: "What this policy covers",
    paragraphs: [
      `This policy describes how ${business.legalName} handles personal information collected through this website. It does not cover information you provide by phone or in person, or information handled by third parties.`,
    ],
  },
  {
    heading: "What is collected",
    paragraphs: [
      "The enquiry form on this site asks for the details needed to respond to you:",
    ],
    bullets: [
      "Your name",
      "Your phone number",
      "Your suburb or postcode",
      "The type of work your enquiry is about",
      "Optionally, your email address, a preferred contact time and a message",
    ],
  },
  {
    heading: "How it is used",
    paragraphs: [
      "Details submitted through the enquiry form are used only to respond to that enquiry. They are not sold, rented or used for marketing lists.",
      "This website does not run analytics, advertising, chat or review scripts, and it does not set its own tracking cookies.",
    ],
  },
  {
    heading: "Google Maps",
    paragraphs: [
      "The contact page and the home page embed a Google Map showing where the business is. The map is only loaded once you scroll it into view. If you never reach it, nothing is requested from Google.",
      "When it does load, Google receives your IP address and may set its own cookies, under Google's privacy policy rather than this one. Use the \u201cGet directions\u201d link instead if you would prefer not to load it.",
    ],
  },
  {
    heading: "How long it is kept",
    paragraphs: [
      "Enquiry details are kept for as long as needed to respond to the enquiry and to meet record-keeping obligations, then deleted. The exact retention period will be confirmed before this site is published.",
    ],
  },
  {
    heading: "Access and correction",
    paragraphs: [
      `You can ask what personal information the business holds about you, ask for it to be corrected, or ask for it to be deleted, by calling ${business.phone.display} or writing to ${business.address.singleLine}.`,
    ],
  },
  {
    heading: "Complaints",
    paragraphs: [
      "If you believe your personal information has been mishandled, contact the business first. If you are not satisfied with the response, you can contact the Office of the Australian Information Commissioner.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "This policy may be updated. The current version is always the one published on this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy policy"
        crumbs={crumbs}
        intro={
          <p>How personal information submitted through this website is handled.</p>
        }
      />
      <LegalBody sections={sections} />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

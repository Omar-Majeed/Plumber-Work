import type { Metadata } from "next";
import { business } from "@/content/business";
import { PageHeader } from "@/components/sections/page-header";
import { LocationSection } from "@/components/sections/location-section";
import { ContactSection } from "@/components/sections/contact-section";
import { CallButton } from "@/components/ui/call-button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Call ${business.displayName} on ${business.phone.display} or send an enquiry. ${business.address.singleLine}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={`Call ${business.phone.display}, or send the details.`}
        crumbs={crumbs}
        intro={
          <p>
            A phone call reaches the business directly. If it is easier to write the
            job down, send the enquiry form instead.
          </p>
        }
        actions={<CallButton size="lg" variant="primary" />}
      />

      <LocationSection />
      <ContactSection />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

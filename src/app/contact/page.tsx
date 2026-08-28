import type { Metadata } from "next";
import { business } from "@/content/business";
import { PageHeader } from "@/components/sections/page-header";
import { LocationContact } from "@/components/sections/location-contact";
import { ServiceAreas } from "@/components/sections/service-areas";
import { GoogleMap } from "@/components/ui/google-map";
import { FinalCta } from "@/components/sections/final-cta";
import { CallButton } from "@/components/ui/call-button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Call ${business.displayName} on ${business.phone.display}, email the office, or send an enquiry from ${business.address.locality} and the surrounding area. Open Mon–Fri 7:00am–4:30pm.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={`Call ${business.phone.display}, or send the details.`}
        crumbs={crumbs}
        intro={
          <p>
            A phone call is the quickest way to reach us — the office is open
            weekdays from 7:00am. If it is easier to write it down, send the form
            and we will ring you back.
          </p>
        }
        actions={<CallButton size="lg" variant="primary" />}
      />

      <LocationContact withForm headingLevel="h2" />

      <section className="section bg-white">
        <div className="shell flex flex-col gap-6">
          <h2 className="text-[var(--colour-navy-900)]">Where to find us</h2>
          <GoogleMap ratio="21 / 9" />
        </div>
      </section>

      <ServiceAreas />
      <FinalCta callbackHref="#enquiry" />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

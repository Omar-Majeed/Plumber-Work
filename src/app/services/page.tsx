import type { Metadata } from "next";
import { business } from "@/content/business";
import { services } from "@/content/services";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceGrid } from "@/components/sections/service-grid";
import { WhyContact } from "@/components/sections/why-contact";
import { ContactSection } from "@/components/sections/contact-section";
import { CallButton } from "@/components/ui/call-button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Plumbing & gasfitting services",
  description: `Plumbing, blocked drains, hot water, gas fitting, leak repairs and commercial maintenance from ${business.displayName} in ${business.address.locality}. Call ${business.phone.display}.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Plumbing and gasfitting services."
        crumbs={crumbs}
        intro={
          <p>
            {services.length} service categories covering domestic and commercial
            plumbing, drainage, hot water and licensed gas work. Each has its own
            page describing the work it involves.
          </p>
        }
        actions={<CallButton size="lg" variant="primary" />}
      />

      <section className="section bg-white">
        <div className="shell">
          <ServiceGrid headingLevel="h2" />
        </div>
      </section>

      <WhyContact />
      <ContactSection />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

import type { Metadata } from "next";
import { business } from "@/content/business";
import { services } from "@/content/services";
import { ServiceAreas } from "@/components/sections/service-areas";
import { Promises } from "@/components/sections/promises";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceGrid } from "@/components/sections/service-grid";
import { FinalCta } from "@/components/sections/final-cta";
import { CallButton } from "@/components/ui/call-button";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Plumbing & gasfitting services",
  description: `Plumbing, blocked drains, hot water, gas fitting and commercial maintenance from ${business.displayName} in ${business.address.locality}. Call ${business.phone.display}.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proposed service structure"
        title="Services being confirmed for launch."
        crumbs={crumbs}
        intro={
          <p>
            The public listing confirms the category{" "}
            {business.descriptor.toLowerCase()}. The {services.length} categories
            below are a proposal for how enquiries could be organised — each one
            will be confirmed, adjusted or removed with the business before the site
            goes live.
          </p>
        }
        actions={
          <>
            <CallButton size="lg" variant="primary" />
            <ButtonLink href="/contact#enquiry" size="lg" variant="outline-inverse">
              Request a callback
            </ButtonLink>
          </>
        }
      />

      <section className="section bg-white">
        <div className="shell flex flex-col gap-8">
          <ServiceGrid />
          <p className="measure text-sm text-[var(--colour-muted)]">
            Each category has its own page with general background information about
            the problem area. Nothing on those pages describes work the business has
            confirmed it carries out.
          </p>
        </div>
      </section>

      <Promises />
      <ServiceAreas />
      <FinalCta />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

import type { Metadata } from "next";
import { business, siteCopy } from "@/content/business";
import { PageHeader } from "@/components/sections/page-header";
import { PhotoImage } from "@/components/ui/photo";
import { photos } from "@/content/photos";
import { ContactSection } from "@/components/sections/contact-section";
import { CallButton } from "@/components/ui/call-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "About the business",
  description: `${business.legalName}, ${business.descriptor.toLowerCase()} at ${business.address.singleLine}. Call ${business.phone.display}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={`${business.descriptor} in ${business.address.locality}.`}
        crumbs={crumbs}
        intro={
          <p>
            {business.legalName}, operating from {business.address.street}.
          </p>
        }
        actions={<CallButton size="lg" variant="primary" />}
      />

      <section className="section bg-white">
        <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <SectionHeading title="How the business works." />
            <div className="measure flex flex-col gap-4 text-[1.0625rem] leading-relaxed text-[var(--colour-muted)]">
              {siteCopy.introduction.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
              <p>
                The six service categories on this site describe the work covered.
                If a job does not fit neatly into one of them, call the office and
                describe it.
              </p>
            </div>
          </div>
          <PhotoImage
            photo={photos.about}
            ratio="4 / 3"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="w-full rounded-[var(--radius-card)]"
          />
        </div>
      </section>

      <section className="section bg-[var(--colour-cream-50)]">
        <div className="shell flex flex-col gap-10">
          <SectionHeading title="Registered business details." />
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Registered name", value: business.legalName },
              { label: "Trade category", value: business.descriptor },
              { label: "ABN", value: business.abn },
              { label: "Address", value: business.address.singleLine },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 border-t border-[var(--colour-line)] pt-5"
              >
                <dt className="text-[0.6875rem] font-medium tracking-[0.14em] text-[var(--colour-aqua-700)] uppercase">
                  {item.label}
                </dt>
                <dd className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContactSection />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

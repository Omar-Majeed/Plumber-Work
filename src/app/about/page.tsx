import type { Metadata } from "next";
import { BadgeCheck, Quote } from "lucide-react";
import { business, profile } from "@/content/business";
import { PageHeader } from "@/components/sections/page-header";
import { PhotoImage } from "@/components/ui/photo";
import { photos, servicePhotos } from "@/content/photos";
import { FinalCta } from "@/components/sections/final-cta";
import { CallButton } from "@/components/ui/call-button";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "About the business",
  description: `${business.legalName} — ${business.descriptor.toLowerCase()} at ${business.address.singleLine}. ${profile.establishedLabel}. Call ${business.phone.display}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Hohmanns"
        title="A small Rockhampton team that answers its own phone."
        crumbs={crumbs}
        intro={<p>{profile.establishedLabel}, working out of Bolsover Street.</p>}
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
        <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Our story" title="Same address, same trade." />
            <div className="measure flex flex-col gap-4 text-[1.0625rem] text-[var(--colour-muted)]">
              {profile.story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <PhotoImage
            photo={photos.about}
            ratio="4 / 3"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="w-full rounded-[var(--radius-card)]"
          />
        </div>
      </section>

      <section className="section on-navy bg-[var(--colour-navy-900)] text-white">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            eyebrow="By the numbers"
            title="What that adds up to."
            tone="dark"
          />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[2.5rem] leading-none font-medium tracking-[-0.03em] text-[var(--colour-aqua-500)]">
                  {stat.value}
                </dd>
                <dd className="text-sm text-white/70">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            eyebrow="How we operate"
            title="Three things we do not budge on."
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {profile.values.map((value) => (
              <li
                key={value.title}
                className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white p-6"
              >
                <Quote
                  aria-hidden="true"
                  className="size-5 text-[var(--colour-aqua-700)]"
                  strokeWidth={1.75}
                />
                <h3 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                  {value.title}
                </h3>
                <p className="text-[0.9375rem] text-[var(--colour-muted)]">
                  {value.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-[var(--colour-cream-50)]">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="Licences and cover"
              title="Licensed, insured, and happy to show you."
              intro={
                <p>
                  Plumbing, drainage and gas work in Queensland is licensed work.
                  Ask to see the paperwork before a job starts — we would rather you
                  did.
                </p>
              }
            />
            <ul className="flex flex-col gap-3">
              {profile.credentials.badges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[var(--colour-line)] bg-white p-4 text-[0.9375rem] text-[var(--colour-navy-900)]"
                >
                  <BadgeCheck
                    aria-hidden="true"
                    className="size-5 shrink-0 text-[var(--colour-aqua-700)]"
                    strokeWidth={1.75}
                  />
                  {badge}
                </li>
              ))}
            </ul>
            <p className="measure text-sm text-[var(--colour-muted)]">
              {business.legalName} · ABN {business.abn} ·{" "}
              {business.address.singleLine}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              "hot-water-systems",
              "gas-fitting",
              "blocked-drains",
              "commercial-plumbing-and-maintenance",
            ].map((slug) => (
              <PhotoImage
                key={slug}
                photo={servicePhotos[slug]!}
                ratio="1 / 1"
                sizes="(min-width: 1024px) 260px, 45vw"
                decorative
                className="w-full rounded-[var(--radius-card)]"
              />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

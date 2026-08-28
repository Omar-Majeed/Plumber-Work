import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { business, profile } from "@/content/business";
import { faqGroups } from "@/content/faqs";
import { PageHeader } from "@/components/sections/page-header";
import { FinalCta } from "@/components/sections/final-cta";
import { CallButton } from "@/components/ui/call-button";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbStructuredData,
  faqStructuredData,
  pageMetadata,
} from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
] as const;

export const metadata: Metadata = pageMetadata({
  title: "Frequently asked questions",
  description: `Booking, pricing, warranties, after-hours call-outs and service areas — answers from ${business.displayName} in ${business.address.locality}. Call ${business.phone.display}.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Frequently asked questions"
        title="The questions we get asked most."
        crumbs={crumbs}
        intro={
          <p>
            Booking, pricing, warranties, urgent problems and the area we cover. If
            your question is not here, ring the office on {business.phone.display}{" "}
            and ask.
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
        <div className="shell grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-14">
          {/* On-page navigation. Anchors, not JavaScript. */}
          <nav
            aria-label="FAQ sections"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="eyebrow text-[var(--colour-aqua-700)]">On this page</h2>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-0">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border border-[var(--colour-line)] px-3 text-[0.9375rem] text-[var(--colour-navy-900)] transition-colors duration-200 hover:border-[var(--colour-aqua-700)] hover:text-[var(--colour-aqua-700)] lg:border-0 lg:border-l-2 lg:border-l-[var(--colour-line)] lg:px-4 lg:hover:border-l-[var(--colour-aqua-500)]"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-12">
            {faqGroups.map((group) => (
              <div
                key={group.id}
                id={group.id}
                className="flex scroll-mt-28 flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-[1.75rem] text-[var(--colour-navy-900)]">
                    {group.title}
                  </h2>
                  <p className="measure text-[0.9375rem] text-[var(--colour-muted)]">
                    {group.summary}
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-[var(--colour-line)] rounded-[var(--radius-card)] border border-[var(--colour-line)]">
                  {group.items.map((item) => (
                    <details key={item.question} className="group p-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1.0625rem] font-medium text-[var(--colour-navy-900)]">
                        {item.question}
                        <span
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-[var(--colour-aqua-700)] transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="measure mt-3 text-[0.9375rem] text-[var(--colour-muted)]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <aside className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-[var(--colour-cream-50)] p-6">
              <HelpCircle
                aria-hidden="true"
                className="size-6 text-[var(--colour-aqua-700)]"
                strokeWidth={1.5}
              />
              <h2 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                Still not sure?
              </h2>
              <p className="measure text-[0.9375rem] text-[var(--colour-muted)]">
                The office is open {profile.hoursSummary}. Describe the problem and
                we will tell you whether it needs a visit, and what it is likely to
                involve.
              </p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <CallButton size="md" variant="primary" />
                <Link
                  href="/contact#enquiry"
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--colour-line)] bg-white px-4 text-[0.9375rem] font-medium text-[var(--colour-navy-900)] transition-colors duration-200 hover:border-[var(--colour-aqua-700)] hover:text-[var(--colour-aqua-700)]"
                >
                  Send an enquiry
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FinalCta />
      <JsonLd data={breadcrumbStructuredData(crumbs)} />
      <JsonLd data={faqStructuredData()} />
    </>
  );
}

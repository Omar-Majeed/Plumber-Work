import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { business, siteCopy } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";
import { PhotoImage } from "@/components/ui/photo";
import { photos } from "@/content/photos";

/**
 * Local business introduction.
 *
 * Two-column editorial composition. The copy restates the registered business
 * details and how contact works; it makes no claim about history, ownership,
 * team size or trading years, none of which the business has supplied.
 */
export function LocalIntroduction() {
  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div className="shell reveal grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <PhotoImage
          photo={photos.about}
          ratio="4 / 3"
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="w-full rounded-[var(--radius-card)]"
        />

        <div className="flex flex-col gap-6">
          <SectionHeading title="A Rockhampton business for plumbing and gasfitting." />

          <div className="measure flex flex-col gap-4 text-[1.0625rem] leading-relaxed text-[var(--colour-muted)]">
            {siteCopy.introduction.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="flex flex-col gap-3 border-t border-[var(--colour-line)] pt-6 text-[0.9375rem]">
            <div className="flex flex-wrap gap-x-3">
              <dt className="min-w-[5.5rem] text-[var(--colour-muted)]">Phone</dt>
              <dd>
                <a
                  href={business.phone.href}
                  data-testid="call-link"
                  className="font-medium text-[var(--colour-navy-900)] underline-offset-4 hover:underline"
                >
                  {business.phone.display}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="min-w-[5.5rem] text-[var(--colour-muted)]">Address</dt>
              <dd className="text-[var(--colour-navy-900)]">
                {business.address.singleLine}
              </dd>
            </div>
          </dl>

          <Link
            href="/about"
            className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-[8px] text-[0.9375rem] font-medium text-[var(--colour-aqua-700)] underline-offset-4 hover:underline"
          >
            About {business.shortName}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

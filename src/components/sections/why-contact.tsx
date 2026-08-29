import { BadgeCheck, MapPin, Phone, Wrench } from "lucide-react";
import { siteCopy } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = {
  phone: Phone,
  "map-pin": MapPin,
  wrench: Wrench,
  badge: BadgeCheck,
} as const;

/**
 * Four factual reasons to make contact.
 *
 * Informational section: no CTA, by design. Every point restates a verified
 * detail rather than a selling claim, so there is nothing here the business
 * would have to stand behind that it has not already published.
 */
export function WhyContact() {
  return (
    <section className="section bg-white">
      <div className="shell reveal flex flex-col gap-10">
        <SectionHeading title="What you can rely on when you get in touch." />

        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {siteCopy.reasons.map((reason) => {
            const Icon = icons[reason.icon];
            return (
              <li
                key={reason.title}
                className="flex gap-4 border-t border-[var(--colour-line)] pt-6"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--colour-aqua-100)] text-[var(--colour-aqua-700)]">
                  <Icon
                    aria-hidden="true"
                    className="size-[18px]"
                    strokeWidth={2}
                  />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                    {reason.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-[var(--colour-muted)]">
                    {reason.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

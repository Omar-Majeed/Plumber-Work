import { siteCopy } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Three-step enquiry process.
 *
 * No CTA and no call panel: the contact section below is the single closing
 * conversion area, and repeating the phone button here is what made the
 * previous page feel relentless.
 */
export function Process() {
  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div className="shell reveal flex flex-col gap-10">
        <SectionHeading title="How an enquiry works." />

        <ol className="grid gap-x-10 gap-y-8 md:grid-cols-3">
          {siteCopy.process.map((step, position) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-display)] text-[2rem] leading-none font-medium text-[var(--colour-aqua-500)]"
              >
                {position + 1}
              </span>
              <h3 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                <span className="sr-only">{`Step ${position + 1}: `}</span>
                {step.title}
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-[var(--colour-muted)]">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

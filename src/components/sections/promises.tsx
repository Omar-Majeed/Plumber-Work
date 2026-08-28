import { Check } from "lucide-react";
import { profile } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * SAMPLE CONTENT: pricing, quoting and warranty promises are demo
 * placeholders — see CONTENT_CONFIRMATION.md.
 */
export function Promises() {
  return (
    <section className="section bg-white">
      <div className="shell flex flex-col gap-8 md:gap-10">
        <SectionHeading
          eyebrow="How we work"
          title="No surprises on the invoice."
          intro={
            <p>
              The parts of a plumbing job people actually worry about — the price,
              the mess, and whether it will hold — handled the same way every time.
            </p>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.promises.map((promise) => (
            <li
              key={promise.title}
              className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-[var(--colour-cream-50)] p-5"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--colour-aqua-100)] text-[var(--colour-aqua-700)]">
                <Check aria-hidden="true" className="size-[18px]" strokeWidth={2} />
              </span>
              <h3 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                {promise.title}
              </h3>
              <p className="text-[0.9375rem] text-[var(--colour-muted)]">
                {promise.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

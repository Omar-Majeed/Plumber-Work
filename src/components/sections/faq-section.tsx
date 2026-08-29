import { homepageFaqs } from "@/content/faqs";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Home page FAQ.
 *
 * Native `<details>` disclosure: keyboard-operable, screen-reader-announced
 * and functional before hydration, with no JavaScript of its own. No CTA
 * follows it, by design.
 */
export function FaqSection() {
  return (
    <section id="faq" className="section bg-white">
      <div className="shell reveal flex flex-col gap-10">
        <SectionHeading title="Questions people ask first." />

        <div className="divide-y divide-[var(--colour-line)] border-y border-[var(--colour-line)]">
          {homepageFaqs.map((faq) => (
            <details key={faq.question} className="disclosure group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-medium text-[var(--colour-navy-900)] transition-colors duration-200 group-open:text-[var(--colour-aqua-700)] hover:text-[var(--colour-aqua-700)] [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="relative inline-block size-4 shrink-0 transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-open:rotate-[135deg]"
                >
                  <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rounded-full bg-[var(--colour-aqua-700)]" />
                  <span className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 rounded-full bg-[var(--colour-aqua-700)]" />
                </span>
              </summary>
              <p className="measure pb-5 text-[0.9375rem] leading-relaxed text-[var(--colour-muted)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

import { MessageSquareQuote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Reviews placeholder.
 *
 * No names, quotes, stars or counts are rendered — inventing social proof is
 * the fastest way to make an otherwise honest site untrustworthy. Delete this
 * component's usage in `src/app/page.tsx` to hide the section entirely until
 * a verified review source is connected.
 */
export function ReviewsEmptyState() {
  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div className="shell flex flex-col items-center gap-6">
        <SectionHeading
          eyebrow="Customer feedback"
          title="Verified reviews belong here."
          align="center"
        />
        <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--colour-line)] bg-white px-6 py-10 text-center">
          <MessageSquareQuote
            aria-hidden="true"
            className="size-6 text-[var(--colour-aqua-700)]"
            strokeWidth={1.5}
          />
          <p className="text-[0.9375rem] font-medium text-[var(--colour-navy-900)]">
            Verified customer reviews will appear here.
          </p>
          <p className="measure text-sm text-[var(--colour-muted)]">
            Connect the business&rsquo;s verified review source before publishing
            testimonials or a rating.
          </p>
        </div>
      </div>
    </section>
  );
}

import { Quote, Star } from "lucide-react";
import { reviewsAreSamples, visibleReviews } from "@/content/reviews";
import { SectionHeading } from "@/components/ui/section-heading";
import { isDemoStage } from "@/lib/site-config";

/**
 * Customer feedback.
 *
 * The quotes in `src/content/reviews.ts` are samples written for the demo, so
 * they are attributed to a placeholder name and are filtered out entirely once
 * SITE_STAGE=production. Publishing invented reviews under a real trading name
 * is not something this site will do — connect the business's verified review
 * source and they publish themselves.
 */
export function Testimonials() {
  const hasReviews = visibleReviews.length > 0;

  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div className="shell flex flex-col gap-8">
        <SectionHeading
          eyebrow="Customer feedback"
          title="What people say afterwards."
          intro={
            reviewsAreSamples && isDemoStage ? (
              <p>
                <span className="font-medium text-[var(--colour-navy-900)]">
                  Sample layout.
                </span>{" "}
                These quotes are placeholders so the section can be reviewed —
                connect the business&rsquo;s verified review source before launch.
                They are never rendered in a production build.
              </p>
            ) : undefined
          }
        />

        {hasReviews ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {visibleReviews.map((review) => (
              <li key={review.quote.slice(0, 32)} className="flex">
                <figure className="flex w-full flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      role="img"
                      aria-label={`Rated ${review.rating} out of 5`}
                      className="flex items-center gap-0.5 text-[var(--colour-orange-500)]"
                    >
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className="size-4"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ))}
                    </span>
                    <Quote
                      aria-hidden="true"
                      className="size-5 text-[var(--colour-aqua-500)]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <blockquote className="text-[0.9375rem] text-[var(--colour-ink)]">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex flex-col gap-0.5 border-t border-[var(--colour-line)] pt-4 text-sm">
                    <span className="font-medium text-[var(--colour-navy-900)]">
                      {review.author}
                      {review.isSample ? (
                        <span className="ml-2 rounded-full bg-[var(--colour-cream-50)] px-2 py-0.5 text-[0.6875rem] font-normal text-[var(--colour-muted)] ring-1 ring-[var(--colour-line)]">
                          sample
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[var(--colour-muted)]">
                      {review.job} · {review.suburb}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--colour-line)] bg-white px-6 py-12 text-center">
            <Quote
              aria-hidden="true"
              className="size-6 text-[var(--colour-aqua-700)]"
              strokeWidth={1.5}
            />
            <p className="text-[0.9375rem] font-medium text-[var(--colour-navy-900)]">
              Verified customer reviews will appear here.
            </p>
            <p className="measure text-sm text-[var(--colour-muted)]">
              Connect the business&rsquo;s verified review source to publish
              testimonials and a rating.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

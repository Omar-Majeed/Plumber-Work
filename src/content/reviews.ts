import { isProductionStage } from "@/lib/site-config";

/**
 * Sample testimonials.
 *
 * These are written for the demo so the section can be designed and reviewed.
 * They are NOT real customer reviews, and inventing reviews for a real trading
 * business is not something to publish, so:
 *
 *   1. every entry is flagged `isSample: true`;
 *   2. `visibleReviews` returns an empty list once SITE_STAGE=production, and
 *      the section renders its "connect a verified review source" state
 *      instead;
 *   3. the demo build shows a small note under the heading saying they are
 *      samples.
 *
 * Replace this file's contents with reviews pulled from the business's
 * verified source (Google Business Profile, Product Review, etc.), set
 * `isSample: false`, and the section publishes itself.
 */

export interface Review {
  readonly quote: string;
  readonly author: string;
  readonly suburb: string;
  readonly job: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly isSample: boolean;
}

export const sampleReviews: readonly Review[] = [
  {
    quote:
      "Hot water went out on the Saturday morning and the new unit was in before dinner. Told me what it would cost before he started and that is exactly what I paid.",
    author: "Placeholder name",
    suburb: "Frenchville",
    job: "Hot water replacement",
    rating: 5,
    isSample: true,
  },
  {
    quote:
      "Our shower had been draining slowly for the better part of a year. They camera'd the line, found roots at a joint, and explained the options without pushing the expensive one.",
    author: "Placeholder name",
    suburb: "Wandal",
    job: "Blocked drain",
    rating: 5,
    isSample: true,
  },
  {
    quote:
      "Booked in for a gas cooktop connection. Turned up on time, did the compliance paperwork on the spot, and cleaned up after themselves. No complaints at all.",
    author: "Placeholder name",
    suburb: "Norman Gardens",
    job: "Gas fitting",
    rating: 5,
    isSample: true,
  },
] as const;

/** Empty in production so sample content can never be published. */
export const visibleReviews: readonly Review[] = isProductionStage
  ? sampleReviews.filter((review) => !review.isSample)
  : sampleReviews;

export const reviewsAreSamples = visibleReviews.some((review) => review.isSample);

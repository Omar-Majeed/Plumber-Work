import { business, directionsUrl } from "@/content/business";
import { heroPhotos, type HeroPhoto } from "@/content/hero-photos";
import { services } from "@/content/services";

/**
 * Hero carousel content.
 *
 * Three slides, one message each. Every claim restates a verified business
 * fact or describes the site's own navigation; nothing here asserts
 * availability, credentials, history or coverage.
 */

export interface HeroAction {
  readonly label: string;
  readonly href: string;
  readonly variant: "primary" | "quiet";
  readonly isPhone?: boolean;
  readonly external?: boolean;
}

export interface HeroSlide {
  readonly id: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly body: string;
  /** At most two actions, per the CTA hierarchy. */
  readonly actions: readonly HeroAction[];
  /** One short supporting line beneath the actions. */
  readonly supporting?: string;
  /**
   * Full-bleed background. `null` uses the branded navy treatment, which is
   * also the runtime fallback when a remote image fails to load.
   */
  readonly photo: HeroPhoto | null;
}

/** Compact service line for slide 2, built from the catalogue. */
const serviceLine = services.map((service) => service.title).join(" · ");

export const heroSlides: readonly HeroSlide[] = [
  {
    id: "introduction",
    eyebrow:
      `${business.descriptor} · ${business.address.locality.replace(" City", "")}`.toUpperCase(),
    heading: "Local plumbing help starts with one direct call.",
    body: `Contact ${business.displayName} for plumbing and gasfitting services in ${business.address.locality.replace(" City", "")}.`,
    actions: [
      {
        label: `Call ${business.phone.display}`,
        href: business.phone.href,
        variant: "primary",
        isPhone: true,
      },
      { label: "Send an enquiry", href: "#enquiry", variant: "quiet" },
    ],
    supporting: business.address.shortLine,
    photo: heroPhotos.slide1,
  },
  {
    id: "services",
    eyebrow: "PLUMBING & GASFITTING SERVICES",
    heading: "The right starting point for every plumbing job.",
    body: "Explore general repairs, blocked drains, hot water systems, gas fitting, leak repairs and commercial maintenance.",
    actions: [{ label: "Explore services", href: "/services", variant: "primary" }],
    supporting: serviceLine,
    photo: heroPhotos.slide2,
  },
  {
    id: "location",
    eyebrow: "ROCKHAMPTON CITY",
    heading: `Find ${business.shortName} in ${business.address.locality}.`,
    body: business.address.singleLine,
    actions: [
      {
        label: "Get directions",
        href: directionsUrl,
        variant: "primary",
        external: true,
      },
    ],
    supporting: `${business.legalName} · ABN ${business.abn}`,
    /**
     * No photograph is published here yet.
     *
     * Slide 3 needs either client-approved premises photography or an
     * accurately sourced Rockhampton image. Neither has been supplied, and
     * publishing an arbitrary streetscape beneath "Find Hohmanns in
     * Rockhampton City" would imply a location identity the image does not
     * have. The branded navy treatment is used until a real photograph
     * arrives; see CONTENT_CONFIRMATION.md.
     */
    photo: null,
  },
];

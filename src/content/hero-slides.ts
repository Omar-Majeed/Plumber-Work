import { business, directionsUrl } from "@/content/business";
import { heroPhotos, type HeroPhoto } from "@/content/hero-photos";

/**
 * Hero carousel content.
 *
 * Three slides, kept as data so the component renders one template rather than
 * three near-identical blocks. Every business detail comes from
 * `content/business.ts` — nothing is retyped here.
 *
 * Copy is deliberately free of availability, pricing, licence, warranty,
 * response-time and review claims. Only the five confirmed facts (legal name,
 * trade category, phone, address, ABN) are stated.
 */

export interface HeroAction {
  readonly label: string;
  readonly href: string;
  readonly variant: "primary" | "outline-inverse";
  /** Marks the telephone action so tests and analytics can find it. */
  readonly isPhone?: boolean;
}

export interface HeroDetail {
  readonly label: string;
  readonly value: string;
}

export interface HeroSlide {
  readonly id: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly copy: string;
  readonly actions: readonly HeroAction[];
  /** Neutral enquiry categories — not a statement of services offered. */
  readonly chips?: readonly string[];
  /** Confirmed business details, shown on the local-proof slide. */
  readonly details?: readonly HeroDetail[];
  /** Stock photograph, or null to use the branded navy treatment. */
  readonly photo: HeroPhoto | null;
  /** The local-proof slide uses the map motif instead of a photograph. */
  readonly visual: "photo" | "map";
}

const callAction: HeroAction = {
  label: `Call ${business.phone.display}`,
  href: business.phone.href,
  variant: "primary",
  isPhone: true,
};

export const heroSlides: readonly HeroSlide[] = [
  {
    id: "local",
    eyebrow: `${business.descriptor} · ${business.address.locality.replace(" City", "")}`,
    heading: "Rockhampton plumbing, one direct call away.",
    copy: `Contact ${business.displayName} for plumbing and gasfitting enquiries in Rockhampton.`,
    actions: [
      callAction,
      { label: "Request a callback", href: "#enquiry", variant: "outline-inverse" },
    ],
    photo: heroPhotos.slide1,
    visual: "photo",
  },
  {
    id: "enquiry",
    eyebrow: "Start with the problem",
    heading: "Plumbing or gasfitting issue? Start here.",
    copy: "Tell us what is happening and where you are located. We will use your details to respond to your enquiry.",
    actions: [
      { label: "Request a callback", href: "#enquiry", variant: "primary" },
      {
        label: "Call now",
        href: business.phone.href,
        variant: "outline-inverse",
        isPhone: true,
      },
    ],
    // Neutral enquiry categories. These describe what you can write to us
    // about — they are not a list of confirmed services or capabilities.
    chips: [
      "Plumbing enquiry",
      "Gasfitting enquiry",
      "Property or site details",
      "General question",
    ],
    photo: heroPhotos.slide2,
    visual: "photo",
  },
  {
    id: "local-proof",
    eyebrow: "Local business details",
    heading: `Based in ${business.address.locality}.`,
    copy: `Speak directly with ${business.displayName} or view the business location.`,
    details: [
      { label: "Address", value: business.address.singleLine },
      { label: "Phone", value: business.phone.display },
      { label: "ABN", value: business.abn },
    ],
    actions: [
      { label: "Get directions", href: directionsUrl, variant: "primary" },
      {
        label: "Call the business",
        href: business.phone.href,
        variant: "outline-inverse",
        isPhone: true,
      },
    ],
    photo: null,
    visual: "map",
  },
];

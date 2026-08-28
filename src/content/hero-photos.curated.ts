/**
 * Hero photography currently in use.
 *
 * Sourced from Pexels by hand. Unsplash's free tier has very little usable
 * plumber-at-work photography — nearly all of it sits behind the paid
 * Unsplash+ licence — so these come from Pexels instead, where the subject
 * matter is unambiguous.
 *
 * Both are under the Pexels License: free for commercial use, no attribution
 * required and no permission needed. Credits are recorded here anyway so the
 * source stays traceable, but nothing is printed on the page — a client site
 * should not advertise where its stock came from.
 *
 * CONTEXTUAL STOCK IMAGERY: neither photograph shows Hohmanns Plumbing
 * Services, its staff, its vehicles or its work. Alt text describes the scene
 * only, and no copy anywhere calls these "our team". Replace with authentic
 * Hohmanns photography when the client can supply it.
 *
 * If `scripts/select-unsplash-photos.mjs` is ever run with an
 * UNSPLASH_ACCESS_KEY, its API-sourced metadata takes precedence over these
 * and attribution switches on automatically, as the Unsplash API guidelines
 * require.
 */

export interface CuratedPhoto {
  readonly id: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly blurHash: null;
  readonly alt: string;
  readonly photographer: { readonly name: string; readonly profileUrl: string };
  readonly photoUrl: string;
  readonly objectPosition: { readonly desktop: string; readonly mobile: string };
  /** Pexels does not require on-page credit; the Unsplash API does. */
  readonly requiresAttribution: false;
}

const pexels = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export const curatedHeroPhotos: {
  slide1: CuratedPhoto;
  slide2: CuratedPhoto;
} = {
  slide1: {
    id: "pexels-32588548",
    url: pexels("32588548"),
    width: 1600,
    height: 1067,
    color: "#23405a",
    blurHash: null,
    alt: "A plumber in blue workwear tightening a metal pipe joint with a wrench",
    photographer: {
      name: "Bulat843",
      profileUrl: "https://www.pexels.com/@bulat843/",
    },
    photoUrl:
      "https://www.pexels.com/photo/plumber-in-blue-uniform-working-on-pipe-repair-with-wrench-32588548/",
    objectPosition: { desktop: "50% 50%", mobile: "50% 50%" },
    requiresAttribution: false,
  },
  slide2: {
    id: "pexels-6419128",
    url: pexels("6419128"),
    width: 1600,
    height: 1067,
    color: "#2b3a44",
    blurHash: null,
    alt: "Close-up of a plumber's hands fitting steel pipework indoors",
    photographer: {
      name: "Anıl Karakaya",
      profileUrl: "https://www.pexels.com/@anilkarakaya/",
    },
    photoUrl:
      "https://www.pexels.com/photo/plumber-s-hands-installing-steel-pipes-indoors-6419128/",
    objectPosition: { desktop: "50% 50%", mobile: "50% 50%" },
    requiresAttribution: false,
  },
};

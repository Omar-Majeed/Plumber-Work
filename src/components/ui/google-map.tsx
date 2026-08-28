"use client";

import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { business, directionsUrl, mapEmbedUrl } from "@/content/business";
import { MapPanel } from "@/components/art/illustrations";
import { cn } from "@/lib/cn";

/**
 * Google Maps embed for the business's listing.
 *
 * Implementation notes:
 *  - Keyless: it uses the `output=embed` endpoint, so there is no API key in
 *    the client bundle and nothing to bill.
 *  - `loading="lazy"` means Google is not contacted until a visitor scrolls
 *    the map into view, keeping it off the critical path.
 *  - The wrapper fixes the aspect ratio, so nothing shifts when it loads, and
 *    the illustrated map sits behind it as the loading state.
 *  - It is a third party: the privacy policy discloses it, and the caption
 *    below the frame says so.
 *
 * `mode="facade"` shows the illustrated map with a "Show interactive map"
 * button and only loads Google on click. That keeps roughly 30 Lighthouse
 * performance points on whichever page carries it, and means Google is never
 * contacted unless the visitor asks — worth switching to if the map is
 * secondary content on that page.
 */
export function GoogleMap({
  className,
  ratio = "4 / 3",
  mode = "embed",
  showCaption = true,
  frameClassName,
}: {
  className?: string;
  /** CSS aspect-ratio value for the map frame. */
  ratio?: string;
  mode?: "embed" | "facade";
  /** The hero slide carries its own directions CTA, so it hides the caption. */
  showCaption?: boolean;
  frameClassName?: string;
}) {
  const [loaded, setLoaded] = useState(mode === "embed");

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-[var(--colour-navy-900)]",
          frameClassName,
        )}
        style={{ aspectRatio: ratio }}
      >
        {/* Behind the embed: the loading state, and the facade before opt-in. */}
        <MapPanel className="absolute inset-0 h-full w-full rounded-none border-0" />

        {loaded ? (
          <iframe
            src={mapEmbedUrl}
            title={`Map showing ${business.displayName}, ${business.address.singleLine}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen={false}
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--colour-navy-950)]/55 p-6 text-center">
            <MapPin
              aria-hidden="true"
              className="size-6 text-[var(--colour-aqua-500)]"
              strokeWidth={1.75}
            />
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--colour-orange-500)] px-5 py-3 text-[0.9375rem] font-medium text-[var(--colour-navy-950)] transition-colors duration-200 hover:bg-[var(--colour-orange-600)]"
            >
              Show interactive map
            </button>
            <span className="text-xs text-white/75">
              Loads Google Maps, which sets its own cookies.
            </span>
          </div>
        )}
      </div>

      {showCaption ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--colour-muted)]">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-1.5 font-medium text-[var(--colour-aqua-700)] underline underline-offset-4"
          >
            Get directions
            <ExternalLink aria-hidden="true" className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <span>Map data © Google.</span>
        </p>
      ) : null}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element --
   These photographs are served straight from the Unsplash CDN, which already
   negotiates format and size. Routing them through next/image would add a
   server-side fetch per request for no benefit, so a plain <img> with an
   explicit srcset is the correct primitive here. Local, self-hosted images
   elsewhere in the project do use next/image. */

import { photoUrl, photoWidths, type Photo } from "@/content/photos";
import { cn } from "@/lib/cn";

interface PhotoImageProps {
  photo: Photo;
  /** CSS aspect-ratio for the frame, e.g. "4 / 3". */
  ratio?: string;
  /** The `sizes` attribute — how wide the image renders at each breakpoint. */
  sizes?: string;
  /** Set on above-the-fold imagery only. */
  priority?: boolean;
  className?: string;
  /** Extra classes for the <img> itself, e.g. a different object-position. */
  imageClassName?: string;
  /** Decorative images pass an empty alt; the default uses the photo's alt. */
  decorative?: boolean;
}

export function PhotoImage({
  photo,
  ratio = "4 / 3",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className,
  imageClassName,
  decorative = false,
}: PhotoImageProps) {
  const srcSet = photoWidths
    .map((width) => `${photoUrl(photo, width)} ${width}w`)
    .join(", ");

  return (
    <div
      className={cn("overflow-hidden bg-[var(--colour-navy-800)]", className)}
      style={{ aspectRatio: ratio }}
    >
      <img
        src={photoUrl(photo, 1280)}
        srcSet={srcSet}
        sizes={sizes}
        alt={decorative ? "" : photo.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}

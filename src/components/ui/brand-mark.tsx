import Image from "next/image";
import { business } from "@/content/business";
import { cn } from "@/lib/cn";

/**
 * Brand assets.
 *
 * The client's logo, supplied as a transparent PNG. Three derivatives are
 * generated from it and live in `public/brand/`:
 *
 *   hohmanns-logo.png          full lockup, for light backgrounds
 *   hohmanns-logo-inverse.png  wordmark recoloured white, for navy
 *   hohmanns-mark.png          the pipe-H mark alone
 *   hohmanns-mark-inverse.png  the mark for navy
 *
 * The lockup already contains the business name, so it is decorative wherever
 * the name is also present as text; where it stands alone (the header, the
 * footer) it carries the accessible name.
 */

const LOCKUP = { width: 1821, height: 411 };
const MARK = { width: 311, height: 411 };

interface LogoProps {
  /** "inverse" is the white-wordmark version for navy backgrounds. */
  tone?: "brand" | "inverse";
  /** Tailwind height utility, e.g. "h-9". Width follows the aspect ratio. */
  className?: string;
  /** Set on the header logo, which is above the fold. */
  priority?: boolean;
  /** Leave empty when adjacent text already names the business. */
  decorative?: boolean;
}

export function Logo({
  tone = "brand",
  className,
  priority = false,
  decorative = false,
}: LogoProps) {
  return (
    // The inline-flex wrapper stops the image being stretched to the width of
    // a column-flex parent, which would squash the lockup.
    <span className="inline-flex">
      <Image
        src={
          tone === "inverse"
            ? "/brand/hohmanns-logo-inverse.png"
            : "/brand/hohmanns-logo.png"
        }
        alt={decorative ? "" : `${business.displayName}, ${business.descriptor}`}
        width={LOCKUP.width}
        height={LOCKUP.height}
        priority={priority}
        className={cn("w-auto max-w-full", className)}
      />
    </span>
  );
}

export function LogoMark({
  tone = "brand",
  className,
  decorative = true,
}: LogoProps) {
  return (
    <span className="inline-flex">
      <Image
        src={
          tone === "inverse"
            ? "/brand/hohmanns-mark-inverse.png"
            : "/brand/hohmanns-mark.png"
        }
        alt={decorative ? "" : business.displayName}
        width={MARK.width}
        height={MARK.height}
        className={cn("w-auto max-w-full", className)}
      />
    </span>
  );
}

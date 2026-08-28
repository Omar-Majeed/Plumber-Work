import { cn } from "@/lib/cn";

/**
 * Stylised service-area map.
 *
 * Drawn for this site in the brand palette — technical line work on a navy
 * ground, the way a plumbing schematic reads. It sits behind the Google Maps
 * embed as its loading state, so the map frame is never blank.
 *
 * The service and vehicle illustrations that used to live here were replaced
 * by photography — see `src/content/photos.ts`.
 */

const LINE = "var(--colour-aqua-500)";
const ACCENT = "var(--colour-orange-500)";
const PAPER_DEEP = "var(--colour-navy-950)";

function Grid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern
          id={`grid-${id}`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 0H0v24"
            fill="none"
            stroke={LINE}
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`glow-${id}`} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="var(--colour-navy-800)" />
          <stop offset="100%" stopColor={PAPER_DEEP} />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#glow-${id})`} />
      <rect width="400" height="300" fill={`url(#grid-${id})`} />
    </>
  );
}

interface SceneProps {
  className?: string;
}

/* -------------------------------------------------------------------------
   Service-area map panel
   ------------------------------------------------------------------------- */

export function MapPanel({ className }: SceneProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-[var(--colour-navy-900)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 300"
        aria-hidden="true"
        focusable="false"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <Grid id="map" />

        {/* river — the Fitzroy bend through town */}
        <path
          d="M-10 96q70 6 110 44t92 40q52 2 84-30t134-26v34q-96-6-128 26t-96 30q-64-2-100-40T-10 132z"
          fill={LINE}
          fillOpacity="0.16"
        />
        <path
          d="M-10 112q72 8 112 44t90 38q52 2 86-30t132-26"
          fill="none"
          stroke={LINE}
          strokeWidth="2"
          strokeOpacity="0.55"
        />

        {/* road grid */}
        <g stroke={LINE} strokeWidth="1.5" strokeOpacity="0.3" fill="none">
          <path d="M56 0v300M124 0v300M192 0v300M260 0v300M328 0v300" />
          <path d="M0 52h400M0 196h400M0 248h400" />
        </g>
        <g stroke={LINE} strokeWidth="2.5" strokeOpacity="0.55" fill="none">
          <path d="M0 224h400" />
          <path d="M226 0v300" />
        </g>

        {/* radius ring */}
        <circle
          cx="226"
          cy="224"
          r="86"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
          strokeDasharray="5 7"
          strokeOpacity="0.6"
        />
        <circle
          cx="226"
          cy="224"
          r="140"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
          strokeDasharray="5 7"
          strokeOpacity="0.32"
        />

        {/* pin */}
        <g transform="translate(226 224)">
          <path
            d="M0-34c-12 0-22 10-22 22 0 16 22 34 22 34s22-18 22-34c0-12-10-22-22-22Z"
            fill={ACCENT}
          />
          <circle cx="0" cy="-12" r="7.5" fill={PAPER_DEEP} />
        </g>
      </svg>
    </div>
  );
}

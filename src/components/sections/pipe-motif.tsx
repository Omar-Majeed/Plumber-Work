/**
 * Original decorative motif: a schematic run of pipework with two elbows and a
 * junction, drawn as thin strokes so it reads as a technical drawing rather
 * than an illustration. Purely decorative and hidden from assistive tech.
 */
export function PipeMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 420"
      aria-hidden="true"
      focusable="false"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="pipe-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--colour-aqua-500)" stopOpacity="0.85" />
          <stop
            offset="100%"
            stopColor="var(--colour-aqua-500)"
            stopOpacity="0.05"
          />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#pipe-fade)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M-20 96h180a28 28 0 0 1 28 28v96a28 28 0 0 0 28 28h324" />
        <path d="M-20 148h150a28 28 0 0 1 28 28v96a28 28 0 0 0 28 28h354" />
        <path d="M312 -20v104a28 28 0 0 0 28 28h200" />
        <path d="M392 440V300a28 28 0 0 1 28-28h120" />
      </g>
      <g
        fill="none"
        stroke="var(--colour-aqua-500)"
        strokeOpacity="0.5"
        strokeWidth="1.25"
      >
        <circle cx="216" cy="248" r="5" />
        <circle cx="340" cy="112" r="5" />
        <circle cx="420" cy="272" r="5" />
      </g>
    </svg>
  );
}

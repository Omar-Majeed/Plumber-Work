import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";

interface PhotoPlaceholderProps {
  /** Shown to the visitor. Kept short and honest. */
  label: string;
  /** Internal photography brief — visible so the client can act on it. */
  brief: string;
  /** CSS aspect-ratio value, e.g. "4 / 3". */
  ratio?: string;
  className?: string;
}

/**
 * Marked placeholder for genuine photography.
 *
 * No stock imagery and no generated "team" photos are used anywhere on this
 * site. Replace this component with a real `next/image` once the client
 * supplies assets — see CONTENT_CONFIRMATION.md.
 */
export function PhotoPlaceholder({
  label,
  brief,
  ratio = "4 / 3",
  className,
}: PhotoPlaceholderProps) {
  return (
    <figure
      className={cn(
        "relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-dashed border-[var(--colour-line)] bg-[var(--colour-cream-50)] p-5",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 14px, rgba(18,54,86,0.05) 14px 15px)",
        }}
      />
      <figcaption className="relative flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--colour-navy-800)] ring-1 ring-[var(--colour-line)]">
          <Camera aria-hidden="true" className="size-3.5" />
          Image placeholder
        </span>
        <span className="text-[0.9375rem] font-medium text-[var(--colour-navy-900)]">
          {label}
        </span>
        <span className="measure text-[0.8125rem] text-[var(--colour-muted)]">
          {brief}
        </span>
      </figcaption>
    </figure>
  );
}

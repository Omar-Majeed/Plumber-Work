import { business } from "@/content/business";
import { CallButton } from "@/components/ui/call-button";

interface CallPanelProps {
  heading: string;
  copy?: string;
  callLabel?: string;
  className?: string;
}

export function CallPanel({
  heading,
  copy,
  callLabel = "Call now",
  className,
}: CallPanelProps) {
  return (
    <aside
      className={`on-navy flex flex-col gap-4 rounded-[var(--radius-card)] bg-[var(--colour-navy-900)] p-6 text-white sm:p-8 ${className ?? ""}`}
    >
      <h3 className="max-w-[24ch] text-white">{heading}</h3>
      <p className="measure text-[0.9375rem] text-white/75">
        {copy ??
          `Call ${business.displayName} directly on ${business.phone.display}.`}
      </p>
      <CallButton label={callLabel} variant="primary" size="lg" className="w-fit" />
    </aside>
  );
}

import { Clock, MapPin, ShieldCheck, BadgeCheck } from "lucide-react";
import { business, profile } from "@/content/business";

/**
 * Trust strip beneath the hero.
 *
 * SAMPLE CONTENT: hours, radius, warranty and licence claims are demo
 * placeholders — see CONTENT_CONFIRMATION.md.
 */
const cells = [
  {
    icon: Clock,
    label: "Open today",
    value: "7:00am - 4:30pm",
    note: "After-hours call-outs available",
  },
  {
    icon: MapPin,
    label: "Rockhampton & region",
    value: "60km service radius",
    note: business.address.street,
  },
  {
    icon: BadgeCheck,
    label: "Licensed & insured",
    value: "QBCC plumber & gasfitter",
    note: "Public liability cover",
  },
  {
    icon: ShieldCheck,
    label: "Backed in writing",
    value: "12-month workmanship warranty",
    note: profile.establishedLabel,
  },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Why customers call Hohmanns"
      className="border-b border-[var(--colour-line)] bg-white"
    >
      <div className="shell">
        <div className="grid grid-cols-2 gap-px bg-[var(--colour-line)] lg:grid-cols-4">
          {cells.map(({ icon: Icon, label, value, note }) => (
            <div
              key={label}
              className="flex flex-col gap-1.5 bg-white px-4 py-5 lg:px-6 lg:py-7"
            >
              <Icon
                aria-hidden="true"
                className="size-[18px] shrink-0 text-[var(--colour-aqua-700)]"
                strokeWidth={1.75}
              />
              <span className="text-[0.9375rem] font-medium text-[var(--colour-navy-900)]">
                {label}
              </span>
              <span className="text-sm text-[var(--colour-ink)]">{value}</span>
              <span className="text-xs text-[var(--colour-muted)]">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

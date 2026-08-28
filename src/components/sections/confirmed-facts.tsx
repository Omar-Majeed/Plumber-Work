import { MapPin, Phone, Droplet, Flame } from "lucide-react";
import { business } from "@/content/business";

/**
 * Confirmed-facts strip.
 *
 * Every cell states something verified against the public listing, or says
 * plainly that the detail is still to be confirmed. This replaces the usual
 * "24/7 · Licensed · Guaranteed" trust badges, none of which can be supported
 * at the proposal stage.
 */
const cells = [
  {
    icon: MapPin,
    label: business.address.locality,
    value: business.address.street,
    pending: false,
  },
  {
    icon: Phone,
    label: "Direct phone",
    value: business.phone.display,
    pending: false,
  },
  {
    icon: Droplet,
    label: "Plumbing",
    value: "Service details to confirm",
    pending: true,
  },
  {
    icon: Flame,
    label: "Gasfitting",
    value: "Service details to confirm",
    pending: true,
  },
] as const;

export function ConfirmedFacts() {
  return (
    <section
      aria-label="Confirmed business details"
      className="border-b border-[var(--colour-line)] bg-white"
    >
      <div className="shell">
        <div className="grid grid-cols-2 gap-px bg-[var(--colour-line)] lg:grid-cols-4">
          {cells.map(({ icon: Icon, label, value, pending }) => (
            <div
              key={label}
              className="flex items-start gap-3 bg-white px-4 py-5 lg:px-6 lg:py-7"
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-[18px] shrink-0 text-[var(--colour-aqua-700)]"
                strokeWidth={1.75}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.9375rem] font-medium text-[var(--colour-navy-900)]">
                  {label}
                </span>
                <span
                  className={
                    pending
                      ? "text-sm text-[var(--colour-muted)] italic"
                      : "text-sm text-[var(--colour-muted)]"
                  }
                >
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

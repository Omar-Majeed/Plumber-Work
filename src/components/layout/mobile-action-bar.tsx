import Link from "next/link";
import { Phone, PhoneOutgoing } from "lucide-react";
import { business } from "@/content/business";

/**
 * Sticky mobile actions. The body reserves matching bottom padding via the
 * `data-mobile-bar` attribute set in the root layout, so page content is
 * never obscured, and safe-area insets are respected on notched devices.
 */
export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--colour-line)] bg-white/95 backdrop-blur-[2px] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        <a
          href={business.phone.href}
          data-testid="call-link"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--colour-orange-500)] px-3 text-[0.9375rem] font-medium text-[var(--colour-navy-950)] transition-colors duration-200 hover:bg-[var(--colour-orange-600)]"
        >
          <Phone aria-hidden="true" className="size-[18px]" />
          Call now
        </a>
        <Link
          href="/contact#enquiry"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--colour-aqua-500)] px-3 text-[0.9375rem] font-medium text-[var(--colour-navy-950)] transition-colors duration-200 hover:bg-[var(--colour-aqua-700)] hover:text-white"
        >
          <PhoneOutgoing aria-hidden="true" className="size-[18px]" />
          Request callback
        </Link>
      </div>
    </div>
  );
}

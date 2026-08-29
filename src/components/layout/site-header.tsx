import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { business } from "@/content/business";
import { Logo } from "@/components/ui/brand-mark";
import { CallButton } from "@/components/ui/call-button";
import { HeaderShell } from "@/components/layout/header-shell";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";

/** Quiet navy contact strip. Scrolls away; the navigation row below sticks. */
function ContactStrip() {
  return (
    <div className="bg-[var(--colour-navy-950)] text-white/80">
      <div className="shell flex items-center justify-between gap-3 py-2 text-[0.8125rem]">
        <p className="flex min-w-0 items-center gap-1.5">
          <MapPin
            aria-hidden="true"
            className="size-3.5 text-[var(--colour-aqua-500)]"
          />
          <span className="truncate">{`${business.address.locality}, ${business.address.region}`}</span>
        </p>
        <a
          href={business.phone.href}
          data-testid="call-link"
          className="flex shrink-0 items-center gap-1.5 rounded-[6px] whitespace-nowrap text-white transition-colors duration-200 hover:text-[var(--colour-aqua-500)]"
        >
          <Phone aria-hidden="true" className="size-3.5" />
          <span>{business.phone.display}</span>
        </a>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <HeaderShell strip={<ContactStrip />}>
      <div className="shell flex items-center justify-between gap-3 py-2.5">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 shrink items-center rounded-[8px]"
        >
          <Logo className="h-7 sm:h-8" priority />
          <span className="sr-only">{`${business.displayName}, home`}</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NavLinks />
          {/* Display utilities go on wrappers, not on the controls themselves:
              Tailwind emits `inline-flex` after `hidden`, so a `hidden` class
              on an already-`inline-flex` button loses the cascade. */}
          <span className="hidden sm:flex">
            <CallButton size="md" variant="primary" />
          </span>
          <span className="flex sm:hidden">
            <a
              href={business.phone.href}
              data-testid="call-link"
              className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--colour-orange-500)] text-[var(--colour-navy-950)] transition-colors duration-200 hover:bg-[var(--colour-orange-600)]"
            >
              <Phone aria-hidden="true" className="size-[18px]" />
              <span className="sr-only">{`Call ${business.displayName} on ${business.phone.display}`}</span>
            </a>
          </span>
          <MobileNav />
        </div>
      </div>
    </HeaderShell>
  );
}

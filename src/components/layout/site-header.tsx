import Link from "next/link";
import { Phone } from "lucide-react";
import { business } from "@/content/business";
import { Logo } from "@/components/ui/brand-mark";
import { CallButton } from "@/components/ui/call-button";
import { HeaderShell } from "@/components/layout/header-shell";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";

export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="shell flex items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 shrink items-center rounded-[8px]"
        >
          <Logo className="h-7 sm:h-8 lg:h-9" priority />
          <span className="sr-only">{`${business.displayName} — home`}</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NavLinks />
          {/* Display utilities are applied to wrappers, not to the controls
              themselves: Tailwind emits `inline-flex` after `hidden`, so a
              `hidden` class on a button that is already `inline-flex` would
              lose the cascade regardless of class order. */}
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

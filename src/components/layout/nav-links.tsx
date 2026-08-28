"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { primaryNavigation, type NavItem } from "@/content/navigation";
import { services } from "@/content/services";
import { ServiceIcon } from "@/components/ui/service-icon";
import { cn } from "@/lib/cn";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-[8px] px-3 text-[0.9375rem] font-medium transition-colors duration-200";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Site" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {primaryNavigation.map((item) =>
          item.menu === "services" ? (
            <ServicesMenu key={item.href} item={item} pathname={pathname} />
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className={cn(
                  linkClass,
                  isCurrent(pathname, item.href)
                    ? "text-[var(--colour-aqua-700)]"
                    : "text-[var(--colour-navy-800)] hover:text-[var(--colour-aqua-700)]",
                )}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

/**
 * Services dropdown.
 *
 * A disclosure, not a menubar: the trigger is a button that opens a panel of
 * ordinary links, which is what screen-reader users expect from site
 * navigation. It opens on hover for mouse users and on click or Enter for
 * everyone else, closes on Escape, on a click outside, when the pointer
 * leaves, when focus leaves the group, and when a link inside it is followed.
 *
 * "All services" is the first item in the panel, so the /services page is
 * still one interaction away — the trigger itself does not navigate.
 */
function ServicesMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = isCurrent(pathname, item.href);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={(event) => {
          // A mouse click arrives after pointerenter has already opened the
          // panel, so toggling here would close it again. Keyboard activation
          // reports detail === 0 and does toggle.
          if (event.detail === 0) setOpen((value) => !value);
          else setOpen(true);
        }}
        className={cn(
          linkClass,
          current
            ? "text-[var(--colour-aqua-700)]"
            : "text-[var(--colour-navy-800)] hover:text-[var(--colour-aqua-700)]",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2",
          "w-[min(640px,calc(100vw-64px))]",
        )}
      >
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white shadow-[0_24px_48px_-28px_rgba(7,24,39,0.55)]">
          <ul className="grid gap-1 p-3 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onClick={() => setOpen(false)}
                  aria-current={
                    pathname === `/services/${service.slug}` ? "page" : undefined
                  }
                  className="group flex gap-3 rounded-[var(--radius-control)] p-3 transition-colors duration-200 hover:bg-[var(--colour-cream-50)]"
                >
                  <ServiceIcon name={service.icon} className="size-9" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[0.9375rem] font-medium text-[var(--colour-navy-900)] group-hover:text-[var(--colour-aqua-700)]">
                      {service.title}
                    </span>
                    <span className="line-clamp-2 text-[0.8125rem] text-[var(--colour-muted)]">
                      {service.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-[var(--colour-line)] bg-[var(--colour-cream-50)] px-3 py-2">
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-control)] px-3 text-[0.9375rem] font-medium text-[var(--colour-aqua-700)]"
            >
              All services
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

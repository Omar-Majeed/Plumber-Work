"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { primaryNavigation } from "@/content/navigation";
import { business } from "@/content/business";
import { services } from "@/content/services";
import { cn } from "@/lib/cn";

const rowClass =
  "flex min-h-11 w-full items-center justify-between gap-3 border-b border-[var(--colour-line)] py-3 text-base font-medium";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const servicesId = useId();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  // Close on Escape and on a click outside the menu.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll();
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) closeAll();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--colour-line)] text-[var(--colour-navy-900)] transition-colors duration-200 hover:border-[var(--colour-aqua-700)]"
      >
        {open ? (
          <X aria-hidden="true" className="size-[18px]" />
        ) : (
          <Menu aria-hidden="true" className="size-[18px]" />
        )}
        <span className="sr-only">Menu</span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-[var(--colour-line)] bg-white",
          "shadow-[0_16px_28px_-24px_rgba(7,24,39,0.6)]",
        )}
      >
        <nav aria-label="Site" className="shell py-3">
          <ul className="flex flex-col">
            {primaryNavigation.map((item) =>
              item.menu === "services" ? (
                <li key={item.href}>
                  {/* Disclosure rather than a link: the sub-list's first item
                      is "All services", so /services stays reachable. */}
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls={servicesId}
                    onClick={() => setServicesOpen((value) => !value)}
                    className={cn(
                      rowClass,
                      isCurrent(item.href)
                        ? "text-[var(--colour-aqua-700)]"
                        : "text-[var(--colour-navy-900)]",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 text-[var(--colour-muted)] transition-transform duration-200",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <ul
                    id={servicesId}
                    hidden={!servicesOpen}
                    className="border-b border-[var(--colour-line)] bg-[var(--colour-cream-50)]"
                  >
                    <li>
                      <Link
                        href={item.href}
                        onClick={closeAll}
                        className="flex min-h-11 items-center py-2.5 pl-4 text-[0.9375rem] font-medium text-[var(--colour-aqua-700)]"
                      >
                        All services
                      </Link>
                    </li>
                    {services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          onClick={closeAll}
                          aria-current={
                            pathname === `/services/${service.slug}`
                              ? "page"
                              : undefined
                          }
                          className={cn(
                            "flex min-h-11 items-center py-2.5 pl-4 text-[0.9375rem]",
                            pathname === `/services/${service.slug}`
                              ? "text-[var(--colour-aqua-700)]"
                              : "text-[var(--colour-navy-900)]",
                          )}
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    onClick={closeAll}
                    className={cn(
                      rowClass,
                      isCurrent(item.href)
                        ? "text-[var(--colour-aqua-700)]"
                        : "text-[var(--colour-navy-900)]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
            <li>
              <a
                href={business.phone.href}
                onClick={closeAll}
                className="flex min-h-11 items-center py-3 text-base font-medium text-[var(--colour-navy-900)]"
              >
                {`Call ${business.phone.display}`}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

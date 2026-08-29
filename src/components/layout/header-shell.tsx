"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Two-level header.
 *
 * The navy contact strip scrolls away; the navigation row below it is
 * `position: sticky`, so it reserves its own space and the page never shifts
 * when the sticky state engages. Elevation is driven by an IntersectionObserver
 * on a zero-height sentinel rather than a scroll handler, which keeps the work
 * off the main thread during scrolling.
 */
export function HeaderShell({
  strip,
  children,
}: {
  strip: ReactNode;
  children: ReactNode;
}) {
  const [elevated, setElevated] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setElevated(!entry?.isIntersecting),
      { threshold: 1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <header>
      {strip}
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <div
        className={cn(
          "sticky top-0 z-40 border-b bg-white transition-shadow duration-200",
          elevated
            ? "border-[var(--colour-line)] shadow-[0_6px_20px_-16px_rgba(7,24,39,0.55)]"
            : "border-[var(--colour-line)]",
        )}
      >
        {children}
      </div>
    </header>
  );
}

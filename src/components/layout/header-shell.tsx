"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Adds a subtle elevation to the sticky header once the page has scrolled. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white transition-shadow duration-200",
        elevated
          ? "border-[var(--colour-line)] shadow-[0_6px_20px_-16px_rgba(7,24,39,0.55)]"
          : "border-transparent",
      )}
    >
      {children}
    </header>
  );
}

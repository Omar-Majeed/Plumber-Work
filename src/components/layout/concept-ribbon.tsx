"use client";

import { useState } from "react";
import { X } from "lucide-react";

/**
 * Quiet demo-stage notice. Rendered only when `NEXT_PUBLIC_SHOW_DEMO_BANNER`
 * is not "false" and the site is not running in the production stage — see
 * `lib/site-config.ts`. State lives in the layout, so dismissing it persists
 * across client-side navigation within the session.
 */
export function ConceptRibbon() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="note"
      aria-label="Website concept notice"
      className="border-b border-[var(--colour-line)] bg-[var(--colour-cream-50)] text-[var(--colour-navy-800)]"
    >
      <div className="shell flex items-center justify-between gap-3 py-2">
        <p className="text-[0.8125rem] leading-snug">
          <span className="font-medium">Website concept</span>
          {" — services and business details pending client confirmation."}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-[8px] text-[var(--colour-muted)] transition-colors duration-200 hover:text-[var(--colour-navy-900)]"
        >
          <X aria-hidden="true" className="size-4" />
          <span className="sr-only">Dismiss website concept notice</span>
        </button>
      </div>
    </div>
  );
}

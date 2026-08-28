import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { isDemoStage } from "@/lib/site-config";

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

/**
 * Shared renderer for the privacy and terms templates.
 *
 * PRE-LAUNCH LEGAL REVIEW REQUIRED. The wording in these pages is a plain-
 * language template written for a demo. It has not been reviewed against the
 * Privacy Act 1988 (Cth), the Australian Privacy Principles, or Australian
 * Consumer Law, and it must be reviewed by an Australian legal adviser before
 * this site is published. See CONTENT_CONFIRMATION.md.
 */
export function LegalBody({
  sections,
  footer,
}: {
  sections: readonly LegalSection[];
  footer?: ReactNode;
}) {
  return (
    <section className="section bg-white">
      <div className="shell flex max-w-[760px] flex-col gap-8">
        {isDemoStage ? (
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-[var(--colour-cream-50)] p-4">
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-[18px] shrink-0 text-[var(--colour-orange-700)]"
            />
            <p className="text-sm text-[var(--colour-navy-900)]">
              <span className="font-medium">Template, not legal advice.</span> This
              wording is a starting point for the demo and requires review by an
              Australian legal adviser before the site is published.
            </p>
          </div>
        ) : null}

        {sections.map((section) => (
          <div key={section.heading} className="flex flex-col gap-3">
            <h2 className="text-[1.375rem] text-[var(--colour-navy-900)]">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[1.0625rem] text-[var(--colour-muted)]"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[1.0625rem] text-[var(--colour-muted)]">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {footer}
      </div>
    </section>
  );
}

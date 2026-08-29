import { siteCopy } from "@/content/business";

/**
 * Compact strip of verified business facts, directly below the hero.
 *
 * Every value here is confirmed against the public business listing. No CTA:
 * the header and the hero already carry the call action, and repeating it here
 * is exactly the conversion noise this layout is meant to avoid.
 */
export function VerifiedStrip() {
  return (
    <section
      aria-label="Business details"
      className="border-b border-[var(--colour-line)] bg-[var(--colour-cream-50)]"
    >
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-7 py-8 md:py-9 lg:grid-cols-4">
        {siteCopy.verifiedStrip.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-[var(--colour-aqua-700)] uppercase">
              {item.label}
            </span>
            {item.href ? (
              <a
                href={item.href}
                data-testid="call-link"
                className="text-[1.0625rem] font-medium text-[var(--colour-navy-900)] underline-offset-4 hover:underline"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-[1.0625rem] font-medium text-[var(--colour-navy-900)]">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

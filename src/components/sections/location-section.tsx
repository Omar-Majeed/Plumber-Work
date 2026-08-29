import { ExternalLink } from "lucide-react";
import { business, directionsUrl } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";
import { GoogleMap } from "@/components/ui/google-map";

/**
 * Location.
 *
 * Warm cream section with a navy information panel. One action, Get
 * directions. The phone is ordinary linked contact information, not a second
 * large button competing with it.
 */
export function LocationSection() {
  return (
    <section id="location" className="section bg-[var(--colour-cream-50)]">
      <div className="shell reveal flex flex-col gap-10">
        <SectionHeading
          eyebrow="Rockhampton City"
          title={`Where to find ${business.shortName}.`}
        />

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-[var(--colour-navy-950)] p-7 text-white md:p-8">
            <dl className="flex flex-col gap-5 text-[0.9375rem]">
              <div className="flex flex-col gap-1">
                <dt className="text-[0.6875rem] font-medium tracking-[0.14em] text-[var(--colour-aqua-500)] uppercase">
                  Address
                </dt>
                <dd className="text-[1.0625rem] text-white">
                  {business.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[0.6875rem] font-medium tracking-[0.14em] text-[var(--colour-aqua-500)] uppercase">
                  Phone
                </dt>
                <dd>
                  <a
                    href={business.phone.href}
                    data-testid="call-link"
                    className="text-[1.0625rem] text-white underline-offset-4 hover:underline"
                  >
                    {business.phone.display}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-[0.6875rem] font-medium tracking-[0.14em] text-[var(--colour-aqua-500)] uppercase">
                  Registered business
                </dt>
                <dd className="text-white/85">
                  <span className="block">{business.legalName}</span>
                  <span className="block">ABN {business.abn}</span>
                </dd>
              </div>
            </dl>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-fit items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--colour-orange-500)] px-5 py-3 text-base font-medium text-[var(--colour-navy-950)] transition-colors duration-200 hover:bg-[var(--colour-orange-600)]"
            >
              Get directions
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>

          <GoogleMap ratio="16 / 11" mode="facade" showCaption />
        </div>
      </div>
    </section>
  );
}

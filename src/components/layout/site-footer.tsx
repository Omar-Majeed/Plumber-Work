import Link from "next/link";
import { business, directionsUrl, emailHref, profile } from "@/content/business";
import { legalNavigation, primaryNavigation } from "@/content/navigation";
import { services } from "@/content/services";
import { Logo } from "@/components/ui/brand-mark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-navy bg-[var(--colour-navy-950)] text-white/80">
      <div className="shell grid gap-10 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <Logo tone="inverse" className="h-10" />
          <p className="measure text-sm text-white/70">
            {profile.establishedLabel}. Plumbing, drainage and gasfitting across
            Rockhampton and the Capricorn Coast.
          </p>
          <ul className="flex flex-col gap-1.5 text-xs text-white/55">
            {profile.credentials.badges.map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-[0.08em] text-white/55 uppercase">
            Contact
          </h2>
          <address className="flex flex-col gap-2 text-sm not-italic">
            <a
              href={business.phone.href}
              data-testid="call-link"
              className="w-fit font-medium text-white transition-colors duration-200 hover:text-[var(--colour-aqua-500)]"
            >
              {business.phone.display}
            </a>
            <a
              href={emailHref}
              className="w-fit break-words text-white/75 transition-colors duration-200 hover:text-[var(--colour-aqua-500)]"
            >
              {profile.email}
            </a>
            <span className="text-white/70">
              {business.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-[var(--colour-aqua-500)] underline underline-offset-4 transition-colors duration-200 hover:text-white"
            >
              Get directions
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </address>
          <div className="flex flex-col gap-1 text-sm text-white/70">
            {profile.openingHours.map((entry) => (
              <span key={entry.days}>
                {entry.days}: {entry.hours}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-[0.08em] text-white/55 uppercase">
            Services
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-9 items-center text-white/80 transition-colors duration-200 hover:text-[var(--colour-aqua-500)]"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-[0.08em] text-white/55 uppercase">
            Pages
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="inline-flex min-h-9 items-center text-white/80 transition-colors duration-200 hover:text-[var(--colour-aqua-500)]"
              >
                Home
              </Link>
            </li>
            {[...primaryNavigation, ...legalNavigation].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-white/80 transition-colors duration-200 hover:text-[var(--colour-aqua-500)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName} · ABN {business.abn}
          </p>
          <p>{business.primaryMarket}</p>
        </div>
      </div>
    </footer>
  );
}

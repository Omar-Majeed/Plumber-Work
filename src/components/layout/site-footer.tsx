import Link from "next/link";
import { business } from "@/content/business";
import {
  legalNavigation,
  primaryNavigation,
  secondaryNavigation,
} from "@/content/navigation";
import { services } from "@/content/services";
import { Logo } from "@/components/ui/brand-mark";

/**
 * Site footer.
 *
 * Plain text links only. The phone is ordinary contact information here, not
 * another orange call-to-action: the header and the contact section already
 * carry that action.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-navy bg-[var(--colour-navy-900)] text-white">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-4">
          <Logo className="h-8" tone="inverse" />
          <p className="measure text-[0.9375rem] text-white/65">
            {business.descriptor} in {business.address.locality}. Plumbing, drainage
            and licensed gas work arranged directly with the business.
          </p>
          <address className="flex flex-col gap-1 text-[0.9375rem] text-white/75 not-italic">
            <a
              href={business.phone.href}
              data-testid="call-link"
              className="w-fit text-white underline-offset-4 hover:underline"
            >
              {business.phone.display}
            </a>
            {business.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>

        <nav aria-label="Services" className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-[0.08em] text-white/55 uppercase">
            Services
          </h2>
          <ul className="flex flex-col gap-2 text-[0.9375rem]">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More" className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-[0.08em] text-white/55 uppercase">
            Pages
          </h2>
          <ul className="flex flex-col gap-2 text-[0.9375rem]">
            {[...primaryNavigation, ...secondaryNavigation, ...legalNavigation].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/12">
        <div className="shell flex flex-col gap-1.5 py-6 text-[0.8125rem] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName}
          </p>
          <p>
            {business.descriptor} · ABN {business.abn}
          </p>
        </div>
      </div>
    </footer>
  );
}

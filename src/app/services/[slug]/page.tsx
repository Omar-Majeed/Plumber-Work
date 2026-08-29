import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CircleAlert, Phone } from "lucide-react";
import { business, directionsUrl } from "@/content/business";
import { getRelatedServices, getService, services } from "@/content/services";
import { PageHeader } from "@/components/sections/page-header";
import { PhotoImage } from "@/components/ui/photo";
import { servicePhotos } from "@/content/photos";
import { CallButton } from "@/components/ui/call-button";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbStructuredData, pageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return pageMetadata({
      title: "Service not found",
      description: "This service page could not be found.",
      path: `/services/${slug}`,
      indexable: false,
    });
  }

  return pageMetadata({
    title: `${service.title} in Rockhampton`,
    description: `${service.summary} Call ${business.displayName} on ${business.phone.display} for ${service.title.toLowerCase()} in ${business.address.locality}.`,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const related = getRelatedServices(service);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ] as const;

  return (
    <>
      <PageHeader
        eyebrow={`${business.address.locality} & surrounds`}
        title={service.headline}
        crumbs={crumbs}
        intro={<p>{service.summary}</p>}
        actions={
          <>
            <CallButton size="lg" variant="primary" />
            <ButtonLink href="/contact#enquiry" size="lg" variant="outline-inverse">
              Request a callback
            </ButtonLink>
          </>
        }
      />

      <section className="section bg-white">
        <div className="shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
          <div className="flex flex-col gap-10">
            <PhotoImage
              photo={servicePhotos[service.slug]!}
              ratio="16 / 9"
              sizes="(min-width: 1024px) 700px, 100vw"
              priority
              className="w-full rounded-[var(--radius-card)]"
            />

            <div className="flex flex-col gap-4">
              <p className="text-[1.0625rem] font-medium text-[var(--colour-navy-900)]">
                {service.promise}
              </p>
              {service.intro.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="measure text-[1.0625rem] text-[var(--colour-muted)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[var(--colour-navy-900)]">
                What the job usually covers
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-[var(--radius-control)] border border-[var(--colour-line)] bg-[var(--colour-cream-50)] p-3.5 text-[0.9375rem] text-[var(--colour-ink)]"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--colour-aqua-700)]"
                      strokeWidth={2}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[var(--colour-navy-900)]">
                Signs people usually notice first
              </h2>
              <p className="measure text-[0.9375rem] text-[var(--colour-muted)]">
                General guidance on this problem area, so you can describe the job
                accurately when you call. It is not advice about your specific
                situation. That needs a look.
              </p>
              <ul className="flex flex-col gap-2">
                {service.indicators.map((indicator) => (
                  <li
                    key={indicator}
                    className="flex items-start gap-2.5 rounded-[var(--radius-control)] border border-[var(--colour-line)] bg-white p-3.5 text-[0.9375rem] text-[var(--colour-ink)]"
                  >
                    <CircleAlert
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[var(--colour-aqua-700)]"
                      strokeWidth={1.75}
                    />
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[var(--colour-navy-900)]">Common questions</h2>
              <div className="flex flex-col divide-y divide-[var(--colour-line)] rounded-[var(--radius-card)] border border-[var(--colour-line)]">
                {service.faqs.map((faq) => (
                  <details key={faq.question} className="group p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.0625rem] font-medium text-[var(--colour-navy-900)]">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="text-[var(--colour-aqua-700)] transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="measure mt-3 text-[0.9375rem] text-[var(--colour-muted)]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
              <p className="text-[0.9375rem] text-[var(--colour-muted)]">
                More answers on the{" "}
                <Link
                  href="/faq"
                  className="font-medium text-[var(--colour-aqua-700)] underline underline-offset-4"
                >
                  frequently asked questions page
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-[var(--colour-cream-50)] p-6">
              <h2 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                Office details
              </h2>
              <address className="flex flex-col gap-1 text-[0.9375rem] text-[var(--colour-muted)] not-italic">
                {business.address.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <a
                  href={business.phone.href}
                  data-testid="call-link"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 font-medium text-[var(--colour-navy-900)] underline decoration-[var(--colour-aqua-500)] underline-offset-4"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {business.phone.display}
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-[var(--colour-aqua-700)] underline underline-offset-4"
                >
                  Get directions
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </address>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section bg-[var(--colour-cream-50)]">
          <div className="shell flex flex-col gap-8">
            <SectionHeading title="Other work we take on" as="h2" />
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white p-5 transition-colors duration-200 hover:border-[var(--colour-aqua-700)]"
                  >
                    <span className="text-[1.0625rem] font-medium text-[var(--colour-navy-900)]">
                      {item.title}
                    </span>
                    <span className="text-[0.9375rem] text-[var(--colour-muted)]">
                      {item.summary}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.9375rem] font-medium text-[var(--colour-aqua-700)]">
                      Explore service
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <JsonLd data={breadcrumbStructuredData(crumbs)} />
    </>
  );
}

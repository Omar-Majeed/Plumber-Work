import { ExternalLink, MapPin, Phone, Clock, Mail, FileText } from "lucide-react";
import { business, directionsUrl, emailHref, profile } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { GoogleMap } from "@/components/ui/google-map";

interface LocationContactProps {
  /** The contact page adds the full enquiry form beside the details. */
  withForm?: boolean;
  headingLevel?: "h2" | "h3";
}

export function LocationContact({
  withForm = false,
  headingLevel = "h2",
}: LocationContactProps) {
  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div
        className={
          withForm
            ? "shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
            : "shell grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14"
        }
      >
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Find the business"
            title={`${business.address.locality}, Queensland`}
            as={headingLevel}
          />

          <dl className="flex flex-col divide-y divide-[var(--colour-line)] rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white">
            <DetailRow icon={MapPin} label="Address">
              <span className="not-italic">
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
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-[var(--colour-aqua-700)] underline underline-offset-4"
              >
                Get directions
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </DetailRow>

            <DetailRow icon={Phone} label="Phone">
              <a
                href={business.phone.href}
                data-testid="call-link"
                className="font-medium text-[var(--colour-navy-900)] underline decoration-[var(--colour-aqua-500)] underline-offset-4"
              >
                {business.phone.display}
              </a>
            </DetailRow>

            <DetailRow icon={Mail} label="Email">
              <a
                href={emailHref}
                className="break-words text-[var(--colour-navy-900)] underline decoration-[var(--colour-aqua-500)] underline-offset-4"
              >
                {profile.email}
              </a>
            </DetailRow>

            <DetailRow icon={Clock} label="Opening hours">
              <ul className="flex flex-col gap-1">
                {profile.openingHours.map((entry) => (
                  <li key={entry.days} className="flex flex-wrap gap-x-3">
                    <span className="min-w-[9.5rem]">{entry.days}</span>
                    <span
                      className={
                        entry.closed
                          ? "text-[var(--colour-muted)]"
                          : "font-medium text-[var(--colour-navy-900)]"
                      }
                    >
                      {entry.hours}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-[var(--colour-muted)]">
                {profile.afterHours.detail}
              </p>
            </DetailRow>

            <DetailRow icon={FileText} label="ABN">
              <span>{business.abn}</span>
            </DetailRow>
          </dl>
        </div>

        {withForm ? (
          <EnquiryForm variant="page" headingLevel="h2" />
        ) : (
          <GoogleMap ratio="16 / 11" />
        )}
      </div>
    </section>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5">
      <dt className="flex items-center gap-3 text-sm font-medium text-[var(--colour-navy-900)]">
        <Icon
          aria-hidden="true"
          className="size-[18px] shrink-0 text-[var(--colour-aqua-700)]"
          strokeWidth={1.75}
        />
        {label}
      </dt>
      <dd className="mt-1 pl-[30px] text-[0.9375rem] text-[var(--colour-ink)]">
        {children}
      </dd>
    </div>
  );
}

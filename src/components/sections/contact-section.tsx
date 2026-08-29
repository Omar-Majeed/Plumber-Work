import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { business } from "@/content/business";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Closing contact section.
 *
 * The only large conversion block after the hero: one phone action and the
 * working enquiry form. The hero's "Send an enquiry" link targets `#enquiry`,
 * which is the id the form itself carries.
 */
export function ContactSection() {
  const points = [
    { icon: Phone, text: `Calls go to the business on ${business.phone.display}` },
    { icon: MapPin, text: business.address.singleLine },
    {
      icon: ShieldCheck,
      text: "Your details are used only to respond to this enquiry",
    },
  ];

  return (
    <section
      id="contact"
      className="on-navy relative isolate overflow-hidden bg-[var(--colour-navy-950)] text-white"
    >
      {/* Restrained line texture, drawn in brand aqua at low opacity. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.07]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--colour-aqua-500)" strokeWidth="2" strokeLinecap="round">
          <path d="M-20 120h240a48 48 0 0 1 48 48v96a48 48 0 0 0 48 48h190" />
          <path d="M-20 300h150a48 48 0 0 0 48-48v-92a48 48 0 0 1 48-48h180" />
          <path d="M1220 460H980a48 48 0 0 1-48-48v-96a48 48 0 0 0-48-48H700" />
        </g>
      </svg>

      <div className="shell grid gap-10 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14 lg:py-24">
        <div className="flex flex-col gap-6">
          <SectionHeading
            tone="dark"
            eyebrow="Contact Hohmanns"
            title="Tell us what you need help with."
            intro={
              <p>
                Send the job and property details through the form, or call the
                office to talk it through.
              </p>
            }
          />

          <ul className="flex flex-col gap-3 text-[0.9375rem] text-white/70">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-[18px] shrink-0 text-[var(--colour-aqua-500)]"
                  strokeWidth={1.9}
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <a
            href={business.phone.href}
            data-testid="call-link"
            className="inline-flex min-h-[48px] w-fit items-center justify-center gap-2 rounded-[var(--radius-control)] bg-[var(--colour-orange-500)] px-5 py-3 text-base font-medium text-[var(--colour-navy-950)] transition-colors duration-200 hover:bg-[var(--colour-orange-600)]"
          >
            <Phone aria-hidden="true" className="size-[18px]" />
            {`Call ${business.phone.display}`}
          </a>
        </div>

        <EnquiryForm variant="hero" headingLevel="h3" />
      </div>
    </section>
  );
}

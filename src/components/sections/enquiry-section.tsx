import { Clock, Phone, ShieldCheck } from "lucide-react";
import { business, profile } from "@/content/business";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { CallButton } from "@/components/ui/call-button";

/**
 * Home-page enquiry section.
 *
 * The hero's "Request a callback" actions target `#enquiry`, which is the id
 * the form itself carries — so this section is what those links scroll to.
 */
export function EnquirySection() {
  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Request a callback"
            title="Rather write it down than explain it on the phone?"
            intro={
              <p>
                Send the details and we will call you back. If it is urgent, ringing
                the office is still the fastest way to reach us.
              </p>
            }
          />

          <ul className="flex flex-col gap-3 text-[0.9375rem] text-[var(--colour-muted)]">
            {[
              {
                icon: Phone,
                text: `Straight through to the office on ${business.phone.display}`,
              },
              { icon: Clock, text: `Office hours: ${profile.hoursSummary}` },
              {
                icon: ShieldCheck,
                text: "Your details are used only to respond to this enquiry",
              },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 size-[18px] shrink-0 text-[var(--colour-aqua-700)]"
                  strokeWidth={1.75}
                />
                {text}
              </li>
            ))}
          </ul>

          <CallButton size="lg" variant="primary" className="w-fit" />
        </div>

        <EnquiryForm variant="page" headingLevel="h3" />
      </div>
    </section>
  );
}

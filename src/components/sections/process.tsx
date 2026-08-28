import { SectionHeading } from "@/components/ui/section-heading";
import { CallPanel } from "@/components/sections/call-panel";
import { business } from "@/content/business";

const steps = [
  {
    title: "Call or send an enquiry",
    copy: "Tell us what the problem is, where it is, and how urgent it feels. Photos help if you have them.",
  },
  {
    title: "We book a time and price the job",
    copy: "You get a time window and, for scheduled work, a fixed price in writing before anyone starts.",
  },
  {
    title: "The job gets done and left clean",
    copy: "Drop sheets down, the work explained when we finish, and 12 months of workmanship warranty behind it.",
  },
] as const;

export function Process() {
  return (
    <section className="section bg-white">
      <div className="shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="A simple enquiry process"
            title="Know what happens next."
            intro={
              <p>
                Three steps between picking up the phone and having it sorted — no
                quoting portal, no chasing.
              </p>
            }
          />
          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 border-t border-[var(--colour-line)] py-5 first:border-t-0 first:pt-0"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--colour-aqua-500)] font-[family-name:var(--font-display)] text-sm text-[var(--colour-aqua-700)]"
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[1.0625rem] text-[var(--colour-navy-900)]">
                    <span className="sr-only">{`Step ${index + 1}: `}</span>
                    {step.title}
                  </h3>
                  <p className="measure text-[0.9375rem] text-[var(--colour-muted)]">
                    {step.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <CallPanel
          heading="Need a plumber in Rockhampton today?"
          copy={`Call ${business.displayName} on ${business.phone.display} and speak to someone in the office, not a call centre.`}
        />
      </div>
    </section>
  );
}

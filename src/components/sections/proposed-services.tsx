import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/sections/service-grid";
import { ButtonLink } from "@/components/ui/button";

export function ProposedServices() {
  return (
    <section className="section bg-[var(--colour-cream-50)]">
      <div className="shell flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title="Plumbing, drainage and gas — all from one team."
            intro={
              <p>
                Domestic repairs, hot water, blocked drains and licensed gas work,
                plus scheduled maintenance for local businesses.
              </p>
            }
          />
          <ButtonLink
            href="/services"
            variant="outline"
            size="md"
            className="w-fit shrink-0"
          >
            All services
          </ButtonLink>
        </div>
        <ServiceGrid />
      </div>
    </section>
  );
}

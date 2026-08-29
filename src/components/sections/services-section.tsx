import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceGrid } from "@/components/sections/service-grid";
import { ButtonLink } from "@/components/ui/button";

/**
 * Complete service catalogue.
 *
 * All six services render from `content/services.ts`; the homepage never
 * defines its own copy of the list. One section-level action only: cards carry
 * text links, not buttons, so the section has a single loud next step.
 */
export function ServicesSection() {
  return (
    <section id="services" className="section bg-white">
      <div className="shell reveal flex flex-col gap-10">
        <SectionHeading
          eyebrow="Our services"
          title="Plumbing and gasfitting support for the jobs that matter."
          intro={
            <p>
              Six service categories covering domestic and commercial plumbing,
              drainage, hot water and licensed gas work.
            </p>
          }
        />
        <ServiceGrid />
        <div>
          <ButtonLink href="/services" variant="outline" size="md">
            View all services
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

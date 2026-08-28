import { MapPin } from "lucide-react";
import { business, profile } from "@/content/business";
import { SectionHeading } from "@/components/ui/section-heading";
import { PhotoImage } from "@/components/ui/photo";
import { photos } from "@/content/photos";
import { CallButton } from "@/components/ui/call-button";

/**
 * SAMPLE CONTENT: the suburb list and 60km radius are demo placeholders —
 * see CONTENT_CONFIRMATION.md.
 */
export function ServiceAreas() {
  return (
    <section className="section bg-white">
      <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Where we work"
            title="Rockhampton, and the region around it."
            intro={<p>{profile.serviceRadiusNote}</p>}
          />
          <ul className="flex flex-wrap gap-2">
            {profile.serviceAreas.map((area) => (
              <li
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--colour-line)] bg-[var(--colour-cream-50)] px-3 py-1.5 text-[0.8125rem] text-[var(--colour-navy-900)]"
              >
                <MapPin
                  aria-hidden="true"
                  className="size-3.5 text-[var(--colour-aqua-700)]"
                  strokeWidth={1.75}
                />
                {area}
              </li>
            ))}
          </ul>
          <p className="measure text-sm text-[var(--colour-muted)]">
            Not on the list? Call {business.phone.display} and ask — if we cannot
            get to you we will say so straight away.
          </p>
          <CallButton size="md" variant="primary" className="w-fit" />
        </div>

        <PhotoImage
          photo={photos.serviceArea}
          ratio="4 / 3"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="w-full rounded-[var(--radius-card)]"
        />
      </div>
    </section>
  );
}

import { business, profile } from "@/content/business";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PhotoImage } from "@/components/ui/photo";
import { photos } from "@/content/photos";

/**
 * Vertical-stack composition, deliberately not another image/text split.
 *
 * This section sits between the enquiry block and the service-areas block,
 * both of which are two-column splits. Running a third split here would give
 * the page four consecutive alternating rows, which reads as template rhythm.
 * Headline, then a full-width photo band, then the stats row.
 */
export function AboutPreview() {
  return (
    <section className="section bg-white">
      <div className="shell flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading title="A Rockhampton business you can actually get on the phone." />
          <ButtonLink
            href="/about"
            variant="outline"
            size="md"
            className="w-fit shrink-0"
          >
            More about {business.shortName}
          </ButtonLink>
        </div>

        <div className="measure flex flex-col gap-4 text-[1.0625rem] text-[var(--colour-muted)]">
          <p>{profile.story[0]}</p>
          <p>{profile.story[2]}</p>
        </div>

        <PhotoImage
          photo={photos.about}
          ratio="21 / 9"
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="w-full rounded-[var(--radius-card)]"
        />

        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--colour-line)] pt-8 sm:grid-cols-4">
          {profile.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-[family-name:var(--font-display)] text-[2rem] leading-none font-medium tracking-[-0.02em] text-[var(--colour-navy-900)]">
                {stat.value}
              </dd>
              <dd className="text-[0.8125rem] text-[var(--colour-muted)]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

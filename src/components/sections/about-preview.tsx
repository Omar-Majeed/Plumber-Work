import { business, profile } from "@/content/business";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PhotoImage } from "@/components/ui/photo";
import { photos } from "@/content/photos";

export function AboutPreview() {
  return (
    <section className="section bg-white">
      <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="About Hohmanns"
            title="A Rockhampton business you can actually get on the phone."
          />
          <div className="measure flex flex-col gap-4 text-[1.0625rem] text-[var(--colour-muted)]">
            <p>{profile.story[0]}</p>
            <p>{profile.story[2]}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--colour-line)] pt-6 sm:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-[1.75rem] leading-none font-medium tracking-[-0.02em] text-[var(--colour-navy-900)]">
                  {stat.value}
                </dd>
                <dd className="text-[0.8125rem] text-[var(--colour-muted)]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <ButtonLink href="/about" variant="outline" size="md" className="w-fit">
            More about {business.shortName}
          </ButtonLink>
        </div>

        <PhotoImage
          photo={photos.about}
          ratio="4 / 3"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="w-full rounded-[var(--radius-card)]"
        />
      </div>
    </section>
  );
}

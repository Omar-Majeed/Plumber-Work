import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/services";
import { PhotoImage } from "@/components/ui/photo";
import { servicePhotos } from "@/content/photos";
import { ServiceIcon } from "@/components/ui/service-icon";

/** Content-driven service grid, shared by the home page and /services. */
export function ServiceGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.slug} className="flex">
          <article className="group flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--colour-line)] bg-white transition-colors duration-200 hover:border-[var(--colour-aqua-700)]">
            <PhotoImage
              photo={servicePhotos[service.slug]!}
              ratio="4 / 3"
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              decorative
              className="w-full"
              imageClassName="transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <div className="flex flex-1 flex-col gap-2.5 p-5">
              <div className="flex items-center gap-3">
                <ServiceIcon name={service.icon} className="size-9" />
                <h3 className="text-[var(--colour-navy-900)]">{service.title}</h3>
              </div>
              <p className="text-[0.9375rem] text-[var(--colour-muted)]">
                {service.summary}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-1 text-[0.9375rem] font-medium text-[var(--colour-aqua-700)]"
              >
                Explore service
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
                <span className="sr-only">: {service.title}</span>
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

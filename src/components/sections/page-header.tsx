import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { PipeMotif } from "@/components/sections/pipe-motif";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  crumbs?: readonly Crumb[];
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  actions,
}: PageHeaderProps) {
  return (
    <section className="on-navy relative overflow-hidden bg-[var(--colour-navy-900)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 0% 0%, var(--colour-navy-800) 0%, var(--colour-navy-900) 55%, var(--colour-navy-950) 100%)",
        }}
      />
      <PipeMotif className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 lg:block" />

      <div className="shell relative flex flex-col gap-5 py-10 md:py-14 lg:py-16">
        {crumbs ? <Breadcrumbs crumbs={crumbs} /> : null}
        {eyebrow ? (
          <p className="eyebrow text-[var(--colour-aqua-500)]">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-[18ch] text-white">{title}</h1>
        {intro ? (
          <div className="measure text-[1.0625rem] text-white/75">{intro}</div>
        ) : null}
        {actions ? (
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}

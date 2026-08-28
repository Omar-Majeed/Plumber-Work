import { business } from "@/content/business";
import { CallButton } from "@/components/ui/call-button";
import { ButtonLink } from "@/components/ui/button";
import { PipeMotif } from "@/components/sections/pipe-motif";

export default function NotFound() {
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

      <div className="shell relative flex flex-col gap-6 py-20 md:py-28">
        <p className="eyebrow text-[var(--colour-aqua-500)]">Error 404</p>
        <h1 className="max-w-[18ch] text-white">That page isn&rsquo;t here.</h1>
        <p className="measure text-[1.0625rem] text-white/75">
          The link may be out of date. You can go back to the home page, or call{" "}
          {business.displayName} directly on {business.phone.display}.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <CallButton size="lg" variant="primary" />
          <ButtonLink href="/" size="lg" variant="outline-inverse">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

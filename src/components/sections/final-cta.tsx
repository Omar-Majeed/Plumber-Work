import { business } from "@/content/business";
import { CallButton } from "@/components/ui/call-button";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta({
  callbackHref = "/contact#enquiry",
}: {
  callbackHref?: string;
}) {
  return (
    <section className="on-navy bg-[var(--colour-navy-950)] text-white">
      <div className="shell flex flex-col gap-6 py-14 md:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="max-w-[20ch] text-white">
            Talk to {business.displayName}.
          </h2>
          <p className="measure text-[1.0625rem] text-white/70">
            {business.address.singleLine}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CallButton size="lg" variant="primary" />
          <ButtonLink href={callbackHref} size="lg" variant="outline-inverse">
            Request a callback
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

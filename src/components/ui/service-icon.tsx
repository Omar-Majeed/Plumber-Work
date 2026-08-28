import {
  Building2,
  Droplets,
  Flame,
  ShowerHead,
  Waves,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/content/services";
import { cn } from "@/lib/cn";

const icons: Record<ServiceIconKey, LucideIcon> = {
  wrench: Wrench,
  drain: Waves,
  "hot-water": ShowerHead,
  gas: Flame,
  leak: Droplets,
  commercial: Building2,
};

/**
 * Service icons are decorative: every one sits beside a text label, so they
 * are hidden from assistive technology.
 */
export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconKey;
  className?: string;
}) {
  const Icon = icons[name];
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--colour-aqua-100)] text-[var(--colour-aqua-700)]",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </span>
  );
}

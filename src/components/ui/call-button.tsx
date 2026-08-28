import { Phone } from "lucide-react";
import { business } from "@/content/business";
import {
  ButtonLink,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";

interface CallButtonProps {
  /** Defaults to "Call (07) 4922 4351" so the number is always visible. */
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function CallButton({
  label,
  variant = "primary",
  size = "md",
  className,
}: CallButtonProps) {
  return (
    <ButtonLink
      href={business.phone.href}
      variant={variant}
      size={size}
      className={className}
      data-testid="call-link"
    >
      <Phone aria-hidden="true" className="size-[18px] shrink-0" />
      <span>{label ?? `Call ${business.phone.display}`}</span>
    </ButtonLink>
  );
}

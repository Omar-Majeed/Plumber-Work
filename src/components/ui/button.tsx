import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "outline-inverse" | "quiet";

export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] " +
  "font-medium text-center leading-tight transition-colors duration-200 " +
  "min-h-[44px] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Reserved for the highest-priority call action.
  primary:
    "bg-[var(--colour-orange-500)] text-[var(--colour-navy-950)] border border-transparent hover:bg-[var(--colour-orange-600)]",
  secondary:
    "bg-[var(--colour-aqua-500)] text-[var(--colour-navy-950)] border border-transparent hover:bg-[var(--colour-aqua-700)] hover:text-white",
  outline:
    "bg-white text-[var(--colour-navy-900)] border border-[var(--colour-line)] hover:border-[var(--colour-aqua-700)] hover:text-[var(--colour-aqua-700)]",
  "outline-inverse":
    "bg-transparent text-white border border-white/45 hover:border-[var(--colour-aqua-500)] hover:text-[var(--colour-aqua-500)]",
  quiet:
    "bg-transparent text-[var(--colour-aqua-700)] border border-transparent hover:text-[var(--colour-navy-900)] underline underline-offset-4 decoration-1",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-4 py-2.5 text-[0.9375rem]",
  lg: "px-5 py-3 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Renders an internal `next/link`, an external anchor, or a plain anchor. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: AnchorProps) {
  const classes = buttonClass(variant, size, className);
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: NativeButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

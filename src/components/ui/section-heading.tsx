import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  as?: "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "start",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow",
            isDark
              ? "text-[var(--colour-aqua-500)]"
              : "text-[var(--colour-aqua-700)]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn(
          isDark ? "text-white" : "text-[var(--colour-navy-900)]",
          "max-w-[22ch]",
          align === "center" && "mx-auto",
        )}
      >
        {title}
      </Heading>
      {intro ? (
        <div
          className={cn(
            "measure text-[1.0625rem]",
            isDark ? "text-white/75" : "text-[var(--colour-muted)]",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </div>
      ) : null}
    </div>
  );
}

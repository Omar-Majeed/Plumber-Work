import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  readonly name: string;
  readonly path: string;
}

export function Breadcrumbs({
  crumbs,
  tone = "dark",
}: {
  crumbs: readonly Crumb[];
  tone?: "dark" | "light";
}) {
  const linkClass =
    tone === "dark"
      ? "text-white/65 hover:text-[var(--colour-aqua-500)]"
      : "text-[var(--colour-muted)] hover:text-[var(--colour-aqua-700)]";
  const currentClass =
    tone === "dark" ? "text-white/90" : "text-[var(--colour-navy-900)]";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className={
                    tone === "dark"
                      ? "size-3.5 text-white/35"
                      : "size-3.5 text-[var(--colour-muted)]"
                  }
                />
              ) : null}
              {isLast ? (
                <span aria-current="page" className={currentClass}>
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className={`${linkClass} underline underline-offset-4 transition-colors duration-200`}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

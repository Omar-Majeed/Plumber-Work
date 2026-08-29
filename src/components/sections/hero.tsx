"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { heroSlides, type HeroAction, type HeroSlide } from "@/content/hero-slides";
import { heroPhotoUrl, heroSrcSet, withReferral } from "@/content/hero-photos";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/cn";

const COUNT = heroSlides.length;
const AUTOPLAY_MS = 7500;
const TRANSITION_MS = 600;
/** Horizontal travel before a gesture counts as a swipe rather than a scroll. */
const SWIPE_THRESHOLD = 48;

/**
 * Hero carousel.
 *
 * Full-bleed photography with a right-to-left navy gradient: dense behind the
 * copy on the right, light over the photograph's subject on the left. Slides
 * are stacked in a single grid cell and cross-faded, so the hero height never
 * changes and nothing below it moves.
 *
 * Slide 1 is rendered by the server and is usable before hydration: its links
 * are real anchors, so the phone action works with JavaScript disabled.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [restart, setRestart] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const regionId = useId();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  /**
   * Moves to a slide and records which way it travelled, so the outgoing slide
   * leaves towards the side the incoming one came from.
   */
  const go = useCallback((next: number, travel?: 1 | -1) => {
    setIndex((current) => {
      const target = ((next % COUNT) + COUNT) % COUNT;
      if (target === current) return current;
      setPrevious(current);
      setDirection(
        travel ??
          // Wrapping between the last and first slide keeps travelling the way
          // the visitor was already going, rather than snapping backwards.
          ((target - current + COUNT) % COUNT === 1 ? 1 : -1),
      );
      return target;
    });
    // Bump the restart key so the pending timer is replaced by exactly one
    // fresh timer. Competing intervals are the classic carousel bug.
    setRestart((value) => value + 1);
  }, []);

  /** Pause while the tab is in the background. */
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /** Exactly one timer, rebuilt whenever the slide, pause state or restart changes. */
  useEffect(() => {
    if (paused || reducedMotion || COUNT < 2) return;
    const timer = window.setTimeout(() => {
      setPrevious(index);
      setDirection(1);
      setIndex((current) => (current + 1) % COUNT);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reducedMotion, restart]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1, -1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1, 1);
    }
  };

  return (
    <section
      aria-label="Highlights"
      aria-roledescription="carousel"
      id={regionId}
      className="relative isolate overflow-hidden bg-[var(--colour-navy-950)]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => {
        const point = event.touches[0];
        touchStart.current = point ? { x: point.clientX, y: point.clientY } : null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const point = event.changedTouches[0];
        touchStart.current = null;
        if (!start || !point) return;
        const dx = point.clientX - start.x;
        const dy = point.clientY - start.y;
        // Only treat it as a swipe when the gesture is clearly horizontal, so
        // vertical scrolling through the hero is never intercepted.
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
          const travel = dx < 0 ? 1 : -1;
          go(index + travel, travel);
        }
      }}
    >
      <div className="grid min-h-[clamp(520px,86svh,620px)] grid-cols-1 grid-rows-1 sm:min-h-[640px] lg:min-h-[700px]">
        {heroSlides.map((slide, position) => (
          <Slide
            key={slide.id}
            slide={slide}
            position={position}
            active={position === index}
            leaving={position === previous}
            direction={direction}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      <Controls
        index={index}
        onSelect={go}
        reducedMotion={reducedMotion}
        regionId={regionId}
      />
    </section>
  );
}

function Slide({
  slide,
  position,
  active,
  leaving,
  direction,
  reducedMotion,
}: {
  slide: HeroSlide;
  position: number;
  active: boolean;
  leaving: boolean;
  direction: 1 | -1;
  reducedMotion: boolean;
}) {
  const Heading = position === 0 ? "h1" : "h2";
  const { photo } = slide;

  /**
   * Slides travel horizontally as they change: the incoming one arrives from
   * the direction of travel, the outgoing one leaves the opposite way, and
   * everything else waits off-stage without transitioning so it cannot be seen
   * sliding back to its starting position.
   */
  const offset = active ? 0 : (leaving ? -1 : 1) * direction * 6;
  const animated = active || leaving;

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${position + 1} of ${COUNT}`}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "relative [grid-area:1/1]",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={
        reducedMotion
          ? undefined
          : {
              transform: `translate3d(${offset}%, 0, 0)`,
              transition: animated
                ? `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`
                : undefined,
            }
      }
    >
      {/* Background: full-bleed photograph, or the branded navy treatment. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: photo?.color ?? "var(--colour-navy-900)" }}
      >
        {photo ? (
          // next/image is deliberately not used here: the hero photographs are
          // served straight from the stock CDN, whose URLs the Next optimiser
          // rejects. A plain <img> with an explicit srcset lets that CDN do the
          // resizing and format negotiation instead, which is what it is for.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPhotoUrl(photo.url, 1600)}
            srcSet={heroSrcSet(photo.url)}
            sizes="100vw"
            alt=""
            width={photo.width}
            height={photo.height}
            /* Only the first slide competes for the LCP budget. */
            loading={position === 0 ? "eager" : "lazy"}
            fetchPriority={position === 0 ? "high" : "low"}
            decoding={position === 0 ? "sync" : "async"}
            className={cn(
              "size-full object-cover [object-position:var(--pos-mobile)] lg:[object-position:var(--pos-desktop)]",
              // Restarting the animation on each activation is what makes the
              // drift read as live rather than as a photograph that has simply
              // stopped at a larger size.
              active && !reducedMotion && "ken-burns",
            )}
            key={active ? "active" : "idle"}
            style={
              {
                "--pos-mobile": photo.objectPosition.mobile,
                "--pos-desktop": photo.objectPosition.desktop,
              } as React.CSSProperties
            }
          />
        ) : (
          <BrandedBackdrop />
        )}
        {/* Readability gradient. Vertical on mobile where the copy sits low,
            right-to-left on desktop where it sits in the right column. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,24,39,0.45)_0%,rgba(7,24,39,0.82)_55%,rgba(7,24,39,0.94)_100%)] lg:bg-[linear-gradient(to_left,rgba(7,24,39,0.94)_0%,rgba(7,24,39,0.92)_38%,rgba(7,24,39,0.6)_62%,rgba(7,24,39,0.22)_100%)]" />
        {/* Consistent brand wash, so all three slides read as one system. */}
        <div className="absolute inset-0 bg-[var(--colour-navy-950)]/18 mix-blend-multiply" />
      </div>

      <div className="shell flex min-h-[clamp(520px,86svh,620px)] items-end pt-14 pb-24 sm:min-h-[640px] sm:pb-28 lg:min-h-[700px] lg:items-center lg:pt-16 lg:pb-24">
        <div className="grid w-full lg:grid-cols-[1fr_minmax(0,46%)]">
          <div className="hidden lg:block" aria-hidden="true" />
          <div className="flex max-w-[540px] flex-col gap-4 text-white">
            <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-[var(--colour-aqua-500)] uppercase">
              {slide.eyebrow}
            </p>

            <Heading className="text-[clamp(2.375rem,1.5rem+3.2vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.028em] text-white">
              {slide.heading}
            </Heading>

            <p className="text-[1.0625rem] leading-relaxed text-white/80 md:text-[1.125rem]">
              {slide.body}
            </p>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
              {slide.actions.map((action) => (
                <HeroCta key={action.label} action={action} />
              ))}
            </div>

            {slide.supporting ? (
              <p className="text-[0.8125rem] text-white/55">{slide.supporting}</p>
            ) : null}

            {photo?.requiresAttribution ? (
              <p className="text-[0.6875rem] text-white/45">
                Photo by{" "}
                <a
                  href={withReferral(photo.photographer.profileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white/70"
                >
                  {photo.photographer.name}
                </a>{" "}
                on{" "}
                <a
                  href={withReferral("https://unsplash.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white/70"
                >
                  Unsplash
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Branded treatment used when a slide has no approved photograph. */
function BrandedBackdrop() {
  return (
    <div className="size-full bg-[radial-gradient(120%_90%_at_18%_35%,var(--colour-navy-800)_0%,var(--colour-navy-950)_70%)]">
      <svg
        aria-hidden="true"
        className="size-full opacity-[0.14]"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="var(--colour-aqua-500)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M120 470h190a40 40 0 0 0 40-40V250a40 40 0 0 1 40-40h180" />
          <path d="M120 560h300a40 40 0 0 0 40-40V330a40 40 0 0 1 40-40h140" />
          <path d="M210 150v120a40 40 0 0 0 40 40h120" />
        </g>
        <g fill="var(--colour-aqua-500)">
          <circle cx="570" cy="210" r="9" />
          <circle cx="640" cy="290" r="9" />
          <circle cx="370" cy="310" r="9" />
        </g>
      </svg>
    </div>
  );
}

function HeroCta({ action }: { action: HeroAction }) {
  const primary =
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[var(--radius-control)] " +
    "bg-[var(--colour-orange-500)] px-5 py-3 text-base font-medium text-[var(--colour-navy-950)] " +
    "transition-colors duration-200 hover:bg-[var(--colour-orange-600)]";
  const quiet =
    "inline-flex min-h-[48px] items-center gap-1.5 rounded-[8px] px-1 text-base font-medium " +
    "text-white underline decoration-white/40 underline-offset-[6px] transition-colors " +
    "duration-200 hover:decoration-white";

  const className = action.variant === "primary" ? primary : quiet;
  const content = (
    <>
      {action.isPhone ? <Phone aria-hidden="true" className="size-[18px]" /> : null}
      <span>{action.label}</span>
      {action.variant === "quiet" ? (
        <ArrowRight aria-hidden="true" className="size-4" />
      ) : null}
    </>
  );

  if (action.isPhone || action.external || action.href.startsWith("#")) {
    return (
      <a
        href={action.href}
        className={className}
        data-testid={action.isPhone ? "call-link" : undefined}
        {...(action.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

function Controls({
  index,
  onSelect,
  reducedMotion,
  regionId,
}: {
  index: number;
  onSelect: (next: number, travel?: 1 | -1) => void;
  reducedMotion: boolean;
  regionId: string;
}) {
  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-white/25 " +
    "bg-[var(--colour-navy-950)]/35 text-white backdrop-blur-[2px] transition-colors duration-200 " +
    "hover:border-[var(--colour-aqua-500)] hover:text-[var(--colour-aqua-500)]";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="shell pointer-events-auto flex items-center gap-3 pb-6 lg:pb-8">
        <button
          type="button"
          aria-controls={regionId}
          onClick={() => onSelect(index - 1, -1)}
          className={arrow}
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
          <span className="sr-only">Previous slide</span>
        </button>
        <button
          type="button"
          aria-controls={regionId}
          onClick={() => onSelect(index + 1, 1)}
          className={arrow}
        >
          <ChevronRight aria-hidden="true" className="size-5" />
          <span className="sr-only">Next slide</span>
        </button>

        <div className="ml-2 flex items-center gap-2">
          {heroSlides.map((slide, position) => (
            <button
              key={slide.id}
              type="button"
              aria-controls={regionId}
              aria-current={position === index ? "true" : undefined}
              onClick={() => onSelect(position, position > index ? 1 : -1)}
              className="group inline-flex h-11 items-center px-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full",
                  reducedMotion ? undefined : "transition-all duration-200",
                  position === index
                    ? "w-7 bg-[var(--colour-aqua-500)]"
                    : "w-2.5 bg-white/35 group-hover:bg-white/60",
                )}
              />
              <span className="sr-only">{`Slide ${position + 1}: ${slide.eyebrow.toLowerCase()}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

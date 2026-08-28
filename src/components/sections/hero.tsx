"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import { heroSlides, type HeroAction, type HeroSlide } from "@/content/hero-slides";
import { heroPhotoUrl, heroSrcSet, withReferral } from "@/content/hero-photos";
import { GoogleMap } from "@/components/ui/google-map";
import { PipeMotif } from "@/components/sections/pipe-motif";
import { buttonClass } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/cn";

const AUTOPLAY_MS = 8000;
const TRANSITION_MS = 520;
const COUNT = heroSlides.length;

/**
 * Homepage hero carousel.
 *
 * Three slides: local relevance and the phone action, guidance for someone
 * with a problem, and the confirmed local business details. Slide content
 * lives in `content/hero-slides.ts` so this file renders one template.
 *
 * Behaviour: autoplay every 8s, paused while the pointer is over it, while
 * focus is inside it, while the tab is hidden, and whenever the visitor
 * prefers reduced motion. Manual navigation restarts a single timer. Slide 1
 * is the server-rendered default, so the phone number is usable before
 * hydration.
 */

export function Hero() {
  const [index, setIndex] = useState(0);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  /** Bumped on any manual navigation so the autoplay timer restarts cleanly. */
  const [restart, setRestart] = useState(0);
  /** Only manual changes are announced; automatic ones stay quiet. */
  const [announcement, setAnnouncement] = useState("");

  const reducedMotion = usePrefersReducedMotion();
  const regionId = useId();
  const regionRef = useRef<HTMLElement>(null);

  const goTo = useCallback((next: number, announce = true) => {
    const target = (next + COUNT) % COUNT;
    setIndex(target);
    setRestart((value) => value + 1);
    if (announce) {
      setAnnouncement(
        `Slide ${target + 1} of ${COUNT}: ${heroSlides[target]!.heading}`,
      );
    }
  }, []);

  // Pause while the tab is in the background. Nothing is read synchronously
  // here, so the server and first client render stay identical.
  useEffect(() => {
    const onVisibility = () => setDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Exactly one timer at a time: it is keyed on the current slide and on the
  // manual-navigation counter, so every change tears the old one down first.
  const paused = pointerPaused || focusPaused || documentHidden || reducedMotion;
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(
      () => setIndex((value) => (value + 1) % COUNT),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index, paused, restart]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Never hijack typing, and only act on keys pressed inside the carousel.
    const target = event.target as HTMLElement;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Hohmanns Plumbing Services highlights"
      className="on-navy relative isolate overflow-hidden bg-[var(--colour-navy-900)] text-white"
      onPointerEnter={() => setPointerPaused(true)}
      onPointerLeave={() => setPointerPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setFocusPaused(false);
        }
      }}
      onKeyDown={onKeyDown}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 8% 0%, var(--colour-navy-800) 0%, var(--colour-navy-900) 48%, var(--colour-navy-950) 100%)",
        }}
      />

      <div className="shell relative py-10 md:py-14 lg:py-16">
        <div className="grid" id={regionId}>
          {heroSlides.map((slide, slideIndex) => (
            <Slide
              key={slide.id}
              slide={slide}
              position={slideIndex}
              active={slideIndex === index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <Controls
          index={index}
          controls={regionId}
          onPrevious={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
          onSelect={(next) => goTo(next)}
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}

function Slide({
  slide,
  position,
  active,
  reducedMotion,
}: {
  slide: HeroSlide;
  position: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const Heading = position === 0 ? "h1" : "h2";

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${position + 1} of ${COUNT}`}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        "grid items-center gap-8 [grid-area:1/1] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        transition: reducedMotion ? undefined : `opacity ${TRANSITION_MS}ms ease`,
      }}
    >
      {/* Message first in the DOM and first on mobile: the phone action is
          reachable without scrolling past a tall image. */}
      <div
        className="flex flex-col gap-5"
        style={
          reducedMotion || !active
            ? undefined
            : { animation: `rise-in ${TRANSITION_MS}ms ease-out both` }
        }
      >
        <p className="eyebrow text-[var(--colour-aqua-500)]">{slide.eyebrow}</p>

        <Heading className="max-w-[17ch] text-white">{slide.heading}</Heading>

        <p className="measure text-[1.0625rem] text-white/80 md:text-[1.125rem]">
          {slide.copy}
        </p>

        {slide.chips ? (
          <ul className="flex flex-wrap gap-2">
            {slide.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] text-white/80"
              >
                {chip}
              </li>
            ))}
          </ul>
        ) : null}

        {slide.details ? (
          <dl className="flex flex-col gap-2 border-l-2 border-[var(--colour-aqua-500)] pl-4 text-[0.9375rem]">
            {slide.details.map((detail) => (
              <div key={detail.label} className="flex flex-wrap gap-x-3">
                <dt className="min-w-[4.5rem] text-white/55">{detail.label}</dt>
                <dd className="text-white">{detail.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
          {slide.actions.map((action) => (
            <HeroCta key={action.label} action={action} />
          ))}
        </div>
      </div>

      <div className="lg:pl-2">
        {slide.visual === "map" ? (
          // The real Google listing, not an illustration: this slide's whole
          // job is verifiable local proof.
          <GoogleMap
            ratio="4 / 3"
            showCaption={false}
            frameClassName="border-white/12 lg:aspect-[16/11]"
            className="w-full"
          />
        ) : (
          <HeroVisual slide={slide} priority={position === 0} />
        )}
      </div>
    </div>
  );
}

function HeroCta({ action }: { action: HeroAction }) {
  const className = buttonClass(action.variant, "lg");
  const icon = action.isPhone ? (
    <Phone aria-hidden="true" className="size-[18px] shrink-0" />
  ) : action.label === "Get directions" ? (
    <MapPin aria-hidden="true" className="size-[18px] shrink-0" />
  ) : (
    <ArrowRight aria-hidden="true" className="size-[18px] shrink-0" />
  );

  // tel: and the external directions link are plain anchors; in-page and
  // internal destinations use the router.
  if (action.href.startsWith("#") || action.href.startsWith("/")) {
    return (
      <Link href={action.href} className={className}>
        {icon}
        {action.label}
      </Link>
    );
  }

  const external = action.href.startsWith("http");
  return (
    <a
      href={action.href}
      data-testid={action.isPhone ? "call-link" : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {icon}
      {action.label}
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  );
}

function HeroVisual({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const photo = slide.photo;

  // No metadata yet (the Unsplash selection tool has not been run) or a failed
  // image: a branded panel keeps the slide composed. Deliberately silent —
  // it reads as part of the design, not as an apology for a missing asset.
  if (!photo) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/12 bg-[var(--colour-navy-950)] lg:aspect-[16/11]">
        <PipeMotif className="absolute inset-0 h-full w-full opacity-90" />
      </div>
    );
  }

  return (
    <figure
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/12 lg:aspect-[16/11]"
      style={
        {
          backgroundColor: photo.color,
          "--op-mobile": photo.objectPosition.mobile,
          "--op-desktop": photo.objectPosition.desktop,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          Unsplash's CDN already negotiates format and size, and fetching the
          photo in the browser rather than through the Next optimiser means a
          hiccup at Unsplash cannot 500 the hero. `fetchPriority` and eager
          loading give slide 1 the same LCP treatment next/image would. */}
      <img
        src={heroPhotoUrl(photo.url, 1600)}
        srcSet={heroSrcSet(photo.url)}
        sizes="(min-width: 1024px) 46vw, 100vw"
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover [object-position:var(--op-mobile)] lg:[object-position:var(--op-desktop)]"
      />
      {/* Credit is shown only where the licence requires it — the Unsplash
          API guidelines do, the Pexels License does not. Source and
          photographer are recorded in src/content either way. */}
      {photo.requiresAttribution ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(7,24,39,0.85)] to-transparent"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-3 text-[0.75rem] leading-snug text-white/85">
            Photo by{" "}
            <a
              href={withReferral(photo.photographer.profileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--colour-aqua-500)]"
            >
              {photo.photographer.name}
            </a>{" "}
            on{" "}
            <a
              href={withReferral(photo.photoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--colour-aqua-500)]"
            >
              Unsplash
            </a>
          </figcaption>
        </>
      ) : null}
    </figure>
  );
}

function Controls({
  index,
  controls,
  onPrevious,
  onNext,
  onSelect,
}: {
  index: number;
  controls: string;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (next: number) => void;
}) {
  const arrow =
    "inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 hover:border-[var(--colour-aqua-500)] hover:text-[var(--colour-aqua-500)]";

  return (
    <div className="mt-8 flex items-center gap-4 md:mt-10">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          aria-controls={controls}
          className={arrow}
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
          <span className="sr-only">Previous slide</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-controls={controls}
          className={arrow}
        >
          <ChevronRight aria-hidden="true" className="size-5" />
          <span className="sr-only">Next slide</span>
        </button>
      </div>

      <ul className="flex items-center gap-1">
        {heroSlides.map((slide, slideIndex) => (
          <li key={slide.id}>
            <button
              type="button"
              onClick={() => onSelect(slideIndex)}
              aria-controls={controls}
              aria-current={slideIndex === index ? "true" : undefined}
              className="group inline-flex size-11 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-200",
                  slideIndex === index
                    ? "w-7 bg-[var(--colour-aqua-500)]"
                    : "w-2.5 bg-white/30 group-hover:bg-white/60",
                )}
              />
              <span className="sr-only">
                {`Go to slide ${slideIndex + 1} of ${COUNT}`}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

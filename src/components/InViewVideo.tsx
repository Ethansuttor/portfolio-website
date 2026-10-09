'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** A muted loop that plays only while on screen, with a pause button. Visitors
 *  who've asked for reduced motion start paused on the poster frame and can
 *  press play themselves. Render it inside a `relative` parent; the button is
 *  placed with `controlClassName`. */
export function InViewVideo({
  src,
  poster,
  label,
  className = "",
  controlClassName = "top-3 right-3",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  controlClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  // null until the visitor presses the button; until then, follow their motion setting.
  const [choice, setChoice] = useState<"playing" | "paused" | null>(null);
  const paused = choice ? choice === "paused" : reducedMotion;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Paused means paused: no observer, so scrolling past can't restart it.
    if (paused) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [paused]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        className={className}
      />
      <button
        type="button"
        onClick={() => setChoice(paused ? "playing" : "paused")}
        aria-label={paused ? "Play video" : "Pause video"}
        className={`silk absolute z-10 inline-flex items-center justify-center gap-1.5 min-w-8 min-h-8 px-2 bg-background/85 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer ${controlClassName}`}
      >
        {paused ? (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        )}
        {paused ? "Play" : "Pause"}
      </button>
    </>
  );
}

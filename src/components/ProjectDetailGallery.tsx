'use client';

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ProjectImage } from "@/lib/projects";

export function ProjectDetailGallery({ images }: { images: ProjectImage[] }) {
  const [active, setActive] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Lock body scroll and register keyboard shortcuts when full screen is open.
  // Plain `overflow: hidden` doesn't actually stop background scroll on iOS
  // Safari, which was letting the page drift under the fixed modal and made
  // the header (and its close button) scroll out of view. Pinning the body
  // with `position: fixed` and restoring the scroll offset on close fixes that.
  useEffect(() => {
    if (!isFullscreen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const originalStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      body.style.position = originalStyle.position;
      body.style.top = originalStyle.top;
      body.style.left = originalStyle.left;
      body.style.right = originalStyle.right;
      body.style.overflow = originalStyle.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, handlePrev, handleNext]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-primary-container/40 transition-colors duration-300 overflow-hidden bg-background p-3 flex items-center justify-center group">
        {images[active].video ? (
          // No click-to-zoom overlay on a clip — it would swallow the transport
          // controls. The Full Screen button in the corner still works.
          <video
            key={images[active].src}
            src={images[active].src}
            poster={images[active].poster}
            aria-label={images[active].alt}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute inset-0 w-full h-full cursor-zoom-in text-left z-0"
            aria-label={`Open full screen view for ${images[active].caption}`}
          >
            <Image
              src={images[active].src}
              alt={images[active].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none z-1" />

        {/* Caption badge — moves up out of the way of a clip's transport bar */}
        <span
          className={`absolute left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1 z-1 pointer-events-none ${
            images[active].video ? "top-3" : "bottom-3"
          }`}
        >
          {images[active].caption}
        </span>

        {/* Full screen toggle button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-background/85 hover:bg-background text-on-surface border border-outline-variant/30 hover:border-primary text-[0.65rem] font-bold uppercase tracking-wider transition-all duration-200 shadow-md group/btn cursor-pointer"
          aria-label="View full screen"
        >
          <svg
            className="w-3.5 h-3.5 text-primary group-hover/btn:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          <span className="hidden sm:inline">Full Screen</span>
        </button>
      </div>

      {/* Thumbnails below gallery (if multiple images) */}
      {images.length > 1 && (
        <div
          className={`grid gap-2 ${
            images.length === 2
              ? "grid-cols-2"
              : images.length === 4
              ? "grid-cols-4"
              : "grid-cols-3"
          }`}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View ${img.caption}`}
              aria-pressed={i === active}
              className={`relative aspect-[4/3] border overflow-hidden transition-all duration-200 cursor-pointer bg-transparent p-0 ${
                i === active
                  ? "border-primary-container ring-1 ring-primary-container/50"
                  : "border-outline-variant/20 opacity-50 hover:opacity-80 hover:border-outline-variant/50"
              }`}
            >
              <Image src={img.poster ?? img.src} alt={img.alt} fill sizes="160px" className="object-cover" />
              {img.video && <PlayBadge />}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal — rendered through a portal into document.body
          so it escapes any ancestor with a `transform`/`filter` (e.g. the
          BorderGlow project card), which would otherwise trap `position: fixed`
          inside that card instead of the real browser viewport and leave the
          close button unreachable. */}
      {isFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 h-dvh z-[100] bg-black/95 backdrop-blur-md flex flex-col p-3 sm:p-4 md:p-6 animate-in fade-in duration-200 select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Full screen photo viewer"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0 flex-1">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-2.5 py-1 border border-primary/30 w-fit shrink-0">
                  Image {active + 1} of {images.length}
                </span>
                <span className="text-xs md:text-sm font-semibold text-white/90 truncate min-w-0">
                  {images[active].caption}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer shrink-0"
                aria-label="Close full screen viewer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Close (ESC)</span>
              </button>
            </div>

            {/* Main Image Area — flex-1 min-h-0 gives the fill image a real
                height without ever exceeding the viewport, so nothing overflows. */}
            <div className="relative flex-1 min-h-0 my-3 sm:my-4">
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-primary text-white border border-white/20 hover:border-primary transition-all duration-200 cursor-pointer shadow-lg group"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {images[active].video ? (
                <video
                  key={images[active].src}
                  src={images[active].src}
                  poster={images[active].poster}
                  aria-label={images[active].alt}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="absolute inset-0 w-full h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <Image
                  src={images[active].src}
                  alt={images[active].alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-primary text-white border border-white/20 hover:border-primary transition-all duration-200 cursor-pointer shadow-lg group"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div
                className="flex justify-center items-center gap-3 pt-3 border-t border-white/10 flex-wrap max-w-full shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`relative w-16 h-12 border overflow-hidden transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      i === active
                        ? "border-primary ring-2 ring-primary/50 opacity-100 scale-105"
                        : "border-white/20 opacity-40 hover:opacity-80"
                    }`}
                    aria-label={`Switch to image ${i + 1}`}
                  >
                    <Image src={img.poster ?? img.src} alt={img.alt} fill sizes="64px" className="object-cover" />
                    {img.video && <PlayBadge />}
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}


/** Marks a thumbnail whose slot holds a clip rather than a still. */
function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-background/30 pointer-events-none">
      <svg className="w-1/3 h-1/3 max-w-8 max-h-8 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { BUILD_LOG_HREF, RESUME_HREF } from "@/lib/site";

/** Home page sections. Rendered as plain hash links rather than buttons, so they
 *  update the URL and can be copied or middle-clicked; globals.css sets
 *  `scroll-behavior: smooth` so the jump still animates. */
const sectionItems = [
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

const MOBILE_MENU_ID = "mobile-menu";

const desktopLinkClass =
  "nav-link font-sans uppercase tracking-[0.2em] text-[0.75rem] text-[#e2e2e2] opacity-70 hover:text-primary hover:opacity-100";

export function Header() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    // Track scroll position for header background
    setScrolled(window.scrollY > 20);

    // Determine active section
    let current = '';
    for (const { id } of sectionItems) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) {
        current = id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Take the initial measurement in a rAF rather than calling handleScroll()
    // straight from the effect body. A synchronous setState there triggers a
    // cascading re-render; rAF still runs before paint, so there's no flash.
    const raf = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // While the menu is open: lock body scroll, move focus into the panel, close
  // on Escape, and keep Tab cycling between the panel and its toggle so focus
  // can't wander into the page hidden behind the overlay. The panel is `inert`
  // while closed, which takes its links out of the tab order entirely.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    document.body.style.overflow = 'hidden';

    const focusables = () =>
      [
        toggleRef.current,
        ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []),
      ].filter((el): el is HTMLElement => el !== null);

    focusables()[1]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // The panel is md:hidden, so widening past the breakpoint (e.g. rotating a
    // tablet) would otherwise leave an invisible menu holding the scroll lock.
    const desktop = window.matchMedia('(min-width: 768px)');
    const onBreakpoint = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 h-16 flex justify-between items-center px-8 border-none transition-all duration-300 ${
        scrolled ? 'bg-[#131313]/95 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-[#131313]/80 backdrop-blur-xl'
      }`}>
        {/* Logo */}
        <a href="#top" className="text-xl font-bold tracking-tighter text-[#e2e2e2] hover:text-primary transition-colors">
          Ethan Suttor
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {sectionItems.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`${desktopLinkClass} ${activeSection === id ? 'active' : ''}`}
            >
              {label}
            </a>
          ))}
          {/* A fifth link doesn't fit beside the logo and resume button at
              tablet widths — everything wraps to two lines at 768px — so it
              waits for lg. The home page's latest-entry strip links there too. */}
          <Link href={BUILD_LOG_HREF} className={`${desktopLinkClass} hidden lg:inline`}>
            Build Log
          </Link>
        </div>

        {/* Desktop CTA */}
        <a
          href={RESUME_HREF}
          download
          className="hidden md:flex cta-primary bg-primary-container text-on-primary-container px-6 py-2 font-sans uppercase tracking-widest text-[0.75rem] items-center justify-center font-bold"
        >
          Download Resume
        </a>

        {/* Mobile Hamburger */}
        <button
          ref={toggleRef}
          type="button"
          className={`md:hidden flex flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none ${mobileMenuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls={MOBILE_MENU_ID}
        >
          <span className="hamburger-line block w-5 h-[2px] bg-on-surface"></span>
          <span className="hamburger-line block w-5 h-[2px] bg-on-surface"></span>
          <span className="hamburger-line block w-5 h-[2px] bg-on-surface"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        aria-hidden="true"
        className={`mobile-menu-overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        id={MOBILE_MENU_ID}
        ref={menuRef}
        inert={!mobileMenuOpen}
        className={`mobile-menu fixed top-0 right-0 w-72 h-full z-50 bg-surface-container-high border-l border-outline-variant/20 flex flex-col pt-20 px-8 md:hidden ${mobileMenuOpen ? 'open' : ''}`}
      >
        <div className="flex flex-col gap-2">
          {sectionItems.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={closeMenu}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`py-4 px-4 font-sans uppercase tracking-[0.2em] text-sm transition-all ${
                activeSection === id
                  ? 'text-primary bg-primary-container/10 border-l-2 border-l-primary-container'
                  : 'text-on-surface/70 hover:text-primary hover:bg-surface-container-highest/50'
              }`}
            >
              {label}
            </a>
          ))}
          <Link
            href={BUILD_LOG_HREF}
            onClick={closeMenu}
            className="py-4 px-4 font-sans uppercase tracking-[0.2em] text-sm transition-all text-on-surface/70 hover:text-primary hover:bg-surface-container-highest/50"
          >
            Build Log
          </Link>
        </div>

        <div className="mt-auto mb-8">
          <a
            href={RESUME_HREF}
            download
            onClick={closeMenu}
            className="cta-primary block w-full bg-primary-container text-on-primary-container px-6 py-4 font-sans uppercase tracking-widest text-[0.75rem] text-center font-bold"
          >
            Download Resume
          </a>
        </div>
      </div>
    </>
  );
}

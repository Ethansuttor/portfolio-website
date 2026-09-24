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

/** The home page's build log preview. Tracked for the active state, but the nav
 *  link itself goes to the full log page. */
const BUILD_LOG_SECTION_ID = "build-log";

/** Every home section, in page order. About has no nav link, so nothing lights
 *  up while it is on screen instead of the section above staying lit. */
const trackedIds = ["projects", BUILD_LOG_SECTION_ID, "about", "skills", "experience", "contact"];

const MOBILE_MENU_ID = "mobile-menu";

const desktopLinkClass =
  "nav-link text-[0.9rem] font-medium text-on-surface-variant hover:text-on-surface";

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
    for (const id of trackedIds) {
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
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-[72px] flex items-center justify-between px-5 sm:px-8 lg:px-16 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-background border-b border-outline-variant'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Logo: the monogram in a QFP-style package */}
        <a href="#top" className="group flex items-center gap-3 text-on-surface" aria-label="Ethan Suttor, back to top">
          <span className="relative grid place-items-center w-9 h-9 rounded-[7px] bg-surface-container-highest border border-outline group-hover:border-primary transition-colors">
            <span className="display text-[0.8rem] tracking-tight text-primary">ES</span>
            <span aria-hidden="true" className="absolute -left-[5px] top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
              <span className="block w-[4px] h-[2px] bg-primary/70" /><span className="block w-[4px] h-[2px] bg-primary/70" /><span className="block w-[4px] h-[2px] bg-primary/70" />
            </span>
            <span aria-hidden="true" className="absolute -right-[5px] top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
              <span className="block w-[4px] h-[2px] bg-primary/70" /><span className="block w-[4px] h-[2px] bg-primary/70" /><span className="block w-[4px] h-[2px] bg-primary/70" />
            </span>
          </span>
          <span className="hidden sm:block font-semibold tracking-tight">Ethan Suttor</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5 lg:gap-8">
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
          <Link
            href={BUILD_LOG_HREF}
            className={`${desktopLinkClass} ${activeSection === BUILD_LOG_SECTION_ID ? 'active' : ''}`}
          >
            Build log
          </Link>
        </div>

        {/* Desktop CTA */}
        <a href={RESUME_HREF} download className="hidden md:inline-flex btn-gold px-5 py-2.5 text-sm">
          Résumé
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v8M2.5 5.5 6 9l3.5-3.5M1.5 11h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
        className={`mobile-menu-overlay fixed inset-0 z-40 bg-black/60 md:hidden ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        id={MOBILE_MENU_ID}
        ref={menuRef}
        inert={!mobileMenuOpen}
        className={`mobile-menu fixed top-0 right-0 w-[82vw] max-w-xs h-full z-50 bg-surface-container-low border-l border-outline-variant flex flex-col pt-24 px-6 md:hidden ${mobileMenuOpen ? 'open' : ''}`}
      >
        <div className="flex flex-col">
          {[...sectionItems.map(({ label, id }) => ({ label, href: `#${id}`, id })), { label: "Build log", href: BUILD_LOG_HREF, id: "" }].map(
            ({ label, href, id }) => {
              const active = id !== "" && activeSection === id;
              const className = `display text-3xl uppercase py-3 border-b border-outline-variant/60 transition-colors ${
                active ? 'text-primary' : 'text-on-surface hover:text-primary'
              }`;
              return id ? (
                <a key={label} href={href} onClick={closeMenu} aria-current={active ? 'true' : undefined} className={className}>
                  {label}
                </a>
              ) : (
                <Link key={label} href={href} onClick={closeMenu} className={className}>
                  {label}
                </Link>
              );
            },
          )}
        </div>

        <div className="mt-auto mb-8">
          <a href={RESUME_HREF} download onClick={closeMenu} className="btn-gold w-full px-6 py-4">
            Download résumé
          </a>
        </div>
      </div>
    </>
  );
}

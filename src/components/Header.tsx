'use client';

import { useState, useEffect, useCallback } from "react";

const navItems = [
  { label: "Skills", href: "#education" },
  { label: "Engineering", href: "#engineering-experience" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const resumeLink = "/Suttor,%20Ethan,%20co-op2.pdf";
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    // Track scroll position for header background
    setScrolled(window.scrollY > 20);

    // Determine active section
    const sections = navItems.map(item => item.href.replace('#', ''));
    let current = '';
    
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = id;
        }
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 h-16 flex justify-between items-center px-8 border-none transition-all duration-300 ${
        scrolled ? 'bg-[#131313]/95 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-[#131313]/80 backdrop-blur-xl'
      }`}>
        {/* Logo */}
        <a href="#" className="text-xl font-bold tracking-tighter text-[#e2e2e2] hover:text-primary transition-colors">
          Ethan Suttor
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className={`nav-link font-sans uppercase tracking-[0.2em] text-[0.75rem] text-[#e2e2e2] opacity-70 hover:text-primary hover:opacity-100 cursor-pointer bg-transparent border-none ${
                activeSection === item.href.replace('#', '') ? 'active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Desktop CTA */}
        <a 
          href={resumeLink}
          download
          className="hidden md:flex cta-primary bg-primary-container text-on-primary-container px-6 py-2 font-sans uppercase tracking-widest text-[0.75rem] items-center justify-center font-bold"
        >
          Download Resume
        </a>

        {/* Mobile Hamburger */}
        <button 
          className={`md:hidden flex flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none ${mobileMenuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line block w-5 h-[2px] bg-on-surface"></span>
          <span className="hamburger-line block w-5 h-[2px] bg-on-surface"></span>
          <span className="hamburger-line block w-5 h-[2px] bg-on-surface"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu fixed top-0 right-0 w-72 h-full z-50 bg-surface-container-high border-l border-outline-variant/20 flex flex-col pt-20 px-8 md:hidden ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className={`text-left py-4 px-4 font-sans uppercase tracking-[0.2em] text-sm transition-all bg-transparent border-none cursor-pointer ${
                activeSection === item.href.replace('#', '')
                  ? 'text-primary bg-primary-container/10 border-l-2 border-l-primary-container'
                  : 'text-on-surface/70 hover:text-primary hover:bg-surface-container-highest/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="mt-auto mb-8">
          <a 
            href={resumeLink}
            download
            className="cta-primary block w-full bg-primary-container text-on-primary-container px-6 py-4 font-sans uppercase tracking-widest text-[0.75rem] text-center font-bold"
          >
            Download Resume
          </a>
        </div>
      </div>
    </>
  );
}

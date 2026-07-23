import Image from "next/image";

export function Hero() {
  const resumeLink = "/Suttor,%20Ethan,%20co-op2.pdf";

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-8 md:px-24 technical-grid overflow-hidden border-b border-outline-variant/20">
      <div className="max-w-6xl z-10 pt-16 flex flex-col md:flex-row items-center gap-12 md:gap-16 my-auto">
        {/* Text content */}
        <div className="flex-1">
          <span className="hero-badge inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface-variant font-sans text-[0.7rem] tracking-[0.1em] mb-6 border border-outline-variant/30">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Currently at Gaylor Electric
          </span>

          <h1 className="hero-name text-4xl sm:text-6xl md:text-[7rem] font-bold leading-[0.85] tracking-tighter mb-2 text-on-surface">
            Ethan Suttor
          </h1>
          <h2 className="hero-title text-4xl sm:text-6xl md:text-[7rem] font-bold leading-[0.85] tracking-tighter mb-8 text-primary-container">
            Electrical Engineering Student
          </h2>

          <p className="hero-description text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed font-sans">
            Electrical Engineering candidate at the University of Louisville specializing in hardware/software co-design, FPGA architecture, and embedded control systems. Designing, verifying, and debugging physical logic for real-time applications.
          </p>

          <div className="hero-buttons flex flex-wrap gap-4 sm:gap-6">
            <a
              href={resumeLink}
              download
              className="cta-primary bg-primary-container text-on-primary-container px-6 sm:px-8 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
              Download Resume
            </a>
            <a
              href="#projects"
              className="cta-secondary border border-outline-variant text-on-surface px-6 sm:px-8 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>schema</span>
              View Projects
            </a>
            <a
              href="https://github.com/Ethansuttor"
              target="_blank"
              rel="noreferrer"
              className="cta-secondary border border-outline-variant text-on-surface px-4 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center transition-all duration-300"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/ethan-suttor"
              target="_blank"
              rel="noreferrer"
              className="cta-secondary border border-outline-variant text-on-surface px-4 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center transition-all duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Headshot */}
        <div className="hero-headshot relative flex-shrink-0 order-first md:order-last my-auto">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-2 ring-outline-variant/20 ring-offset-4 ring-offset-background">
            <Image
              src="/assets/hero-photo.jpg"
              alt="Ethan Suttor"
              fill
              sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 288px"
              className="object-cover object-center grayscale-[30%] hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>
        </div>
      </div>

      {/* Subtle accent gradient */}
      <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-container/5 to-transparent pointer-events-none"></div>
    </section>
  );
}

import Image from "next/image";

export function Hero() {
  const resumeLink = "/Suttor,%20Ethan,%20co-op2.pdf";

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-8 md:px-24 technical-grid overflow-hidden border-b border-outline-variant/20">
      <div className="max-w-6xl z-10 pt-16 flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
        {/* Text content */}
        <div className="flex-1">
          <span className="hero-badge inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-on-surface-variant font-sans text-[0.7rem] tracking-[0.1em] mb-6 border border-outline-variant/30">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Open to Co-op Opportunities
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-[7rem] font-bold leading-[0.85] tracking-tighter mb-8 text-on-surface">
            <span className="hero-name block">Ethan Suttor</span>
            <span className="hero-title block text-primary-container">Electrical Engineering Student</span>
          </h1>

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
          </div>
        </div>

        {/* Headshot */}
        <div className="hero-headshot relative flex-shrink-0 order-first md:order-last">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
            <div className="absolute -inset-2 border border-outline-variant/20"></div>

            <Image
              src="/assets/hero-photo.jpg"
              alt="Ethan Suttor"
              fill
              sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 288px"
              className="object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
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

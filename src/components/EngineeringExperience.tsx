"use client";

import { ScrollReveal } from "./ScrollReveal";

/* ────────────────────────────────────────────────────
   ENGINEERING EXPERIENCE COMPONENT
   ──────────────────────────────────────────────────── */

export function EngineeringExperience() {
  return (
    <section
      className="section-divider py-24 px-8 md:px-24 bg-surface-container-low"
    >
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-on-surface">
            Engineering Experience
          </h2>
          <div className="flex-1 h-[1px] bg-outline-variant/40"></div>
        </div>
        <p className="text-sm text-on-surface-variant mb-16">
          Engineering Internship
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="group bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant transition-all duration-500">
          {/* Header badge */}
          <div className="bg-surface-container-highest/50 px-6 md:px-10 py-3 flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-primary-container rounded-full animate-pulse"></span>
              <span className="font-sans text-[0.7rem] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                Nifco Americas
              </span>
            </div>
            <span className="font-sans text-[0.65rem] text-on-surface-variant/50 uppercase tracking-[0.2em] hidden sm:block">
              Aug 2022 — May 2023
            </span>
          </div>

          <div className="p-6 md:p-10 flex flex-col gap-6 md:gap-8">
            {/* Title block */}
            <div className="flex flex-col gap-2">
              <span className="text-primary font-sans text-[0.65rem] tracking-[0.2em] font-bold uppercase">
                Industrial Engineering
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">
                Nifco Americas
              </h3>
              <p className="text-on-surface-variant/60 text-sm uppercase tracking-wider">
                Shelbyville, KY — Tier 1 Automotive Supplier
              </p>
            </div>

            {/* Role overview */}
            <div>
              <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">
                Overview
              </span>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Learned design processes from professional engineers. Designed mechanical parts for machine conversions and conveyors. Managed the hardware engineering database and updated technical documentation for global suppliers.
              </p>
            </div>

            {/* Key responsibilities */}
            <div>
              <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
                Key Contributions
              </span>
              <div className="space-y-2">
                {[
                  {
                    label: "CAD Design",
                    detail:
                      "Created SolidWorks assemblies for machine conversion projects and conveyor system upgrades",
                  },
                  {
                    label: "Database",
                    detail:
                      "Maintained and updated the hardware engineering database used across multiple plant locations",
                  },
                  {
                    label: "Documentation",
                    detail:
                      "Updated technical specs and drawings for global supplier communications",
                  },
                  {
                    label: "Manufacturing",
                    detail:
                      "Gained hands-on exposure to injection molding processes and 5S lean manufacturing standards",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-3 items-start p-3 bg-background/60 border-l-2 border-outline-variant/20 hover:border-primary/60 transition-colors duration-300"
                  >
                    <span className="text-[0.6rem] font-black text-primary uppercase tracking-wider whitespace-nowrap min-w-[5.5rem]">
                      {item.label}
                    </span>
                    <span className="text-on-surface-variant text-xs leading-relaxed">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech / Tools stack */}
            <div>
              <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
                Tools & Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "SolidWorks",
                  "5S Lean",
                  "Database Management",
                  "Technical Documentation",
                  "Injection Molding",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="skill-pill bg-background text-on-surface/80 px-3 py-1.5 text-[0.6rem] font-sans tracking-wide border border-outline-variant/30 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

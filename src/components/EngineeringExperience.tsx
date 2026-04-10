"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

/* ────────────────────────────────────────────────────
   NIFCO PHOTO GALLERY
   ──────────────────────────────────────────────────── */

const nifcoPhotos = [
  {
    src: "/assets/nifco2.jpeg",
    alt: "Ethan on the Nifco manufacturing floor with injection molding machines",
    caption: "Manufacturing Floor — Injection Molding Bay",
  },
  {
    src: "/assets/nifco1.jpeg",
    alt: "5S quality standard signage at Nifco warehouse",
    caption: "5S Compliance — Warehouse Operations",
  },
];

/* ────────────────────────────────────────────────────
   ENGINEERING EXPERIENCE COMPONENT
   ──────────────────────────────────────────────────── */

export function EngineeringExperience() {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <section
      className="section-divider py-24 px-8 md:px-24 bg-surface-container-low"
      id="engineering-experience"
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

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ── Left: Content ── */}
            <div className="lg:col-span-7 p-6 md:p-10 flex flex-col gap-6 md:gap-8">
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
                      className="flex gap-3 items-start p-3 bg-background/60 border-l-2 border-outline-variant/20 hover:border-primary-container/60 transition-colors duration-300"
                    >
                      <span className="text-[0.6rem] font-black text-primary-container uppercase tracking-wider whitespace-nowrap min-w-[5.5rem]">
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

            {/* ── Right: Photo Gallery ── */}
            <div className="lg:col-span-5 p-4 md:p-6 bg-background/30">
              <div className="flex flex-col gap-3">
                {/* Main photo */}
                <div className="relative w-full aspect-[4/3] border border-outline-variant/20 hover:border-outline-variant/50 transition-colors duration-500 overflow-hidden bg-background">
                  <Image
                    src={nifcoPhotos[activePhoto].src}
                    alt={nifcoPhotos[activePhoto].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-3 left-3 text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-background/80 px-2 py-1">
                    {nifcoPhotos[activePhoto].caption}
                  </span>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-2 gap-2">
                  {nifcoPhotos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`relative aspect-[4/3] border overflow-hidden transition-all duration-300 cursor-pointer bg-transparent p-0 ${
                        i === activePhoto
                          ? "border-primary-container ring-1 ring-primary-container/50"
                          : "border-outline-variant/20 opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

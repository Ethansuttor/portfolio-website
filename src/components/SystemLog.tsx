"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "./ScrollReveal";

/* ────────────────────────────────────────────────────
   EXPERIENCE DATA
   ──────────────────────────────────────────────────── */

const experience = [
  {
    type: "PROFESSIONAL",
    period: "JAN 2026 — PRESENT",
    role: "SCI STUDENT WORKER",
    company: "Speed Center for Innovation (SCI)",
    description: "Driving hands-on electronics innovation through rapid hardware prototyping and embedded system debugging. Providing technical support for industrial test equipment and ensuring precision in laboratory operations. Assisting students with component selection and workstation management.",
    tags: ["Prototyping", "Embedded Debug", "Hardware Test"],
    image: "/assets/solder-workshop.jpg",
    imageAlt: "Soldering workshop at the Speed Center for Innovation",
    imageCaption: "Workshop — SCI Lab",
  },
  {
    type: "LEADERSHIP",
    period: "ACTIVE TERM",
    role: "TREASURER",
    company: "IEEE Student Chapter",
    description: "Managing PCB assembly lab operations for 15+ personnel. Orchestrating technical workshops focused on hardware design and enforcing strict IPC assembly standards to ensure professional-grade production.",
    tags: ["IPC Standards", "Lab Management", "Technical Workshops"],
    image: null,
    imageAlt: null,
    imageCaption: null,
  },
  {
    type: "LEADERSHIP",
    period: "AUG 2025 — PRESENT",
    role: "PEER MENTOR",
    company: "Engineering Living-Learning Community (ELLC)",
    description: "Mentored a cohort of 40 first-year engineering students through their transition to university-level coursework. Planned and facilitated 2 community-building events with 20 attendees each, fostering collaboration and peer networking within the residential engineering program.",
    tags: ["Mentorship", "Event Planning", "First-Year Support"],
    image: null,
    imageAlt: null,
    imageCaption: null,
    collapsible: {
      label: "Event Gallery",
      items: [
        { src: "/assets/ellc-event-1.jpg", alt: "ELLC Paint Night Event", caption: "Event 01 — Paint Night" },
        { src: "/assets/ellc-event-2.jpg", alt: "ELLC Game Night Event", caption: "Event 02 — Game Night" },
      ],
    },
  },

];


/* ────────────────────────────────────────────────────
   COLLAPSIBLE EVENT GALLERY
   ──────────────────────────────────────────────────── */

interface CollapsibleData {
  label: string;
  items: { src: string; alt: string; caption: string }[];
}

function EventGallery({ data }: { data: CollapsibleData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-6 border border-outline-variant/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-surface-container-high transition-colors duration-300 cursor-pointer border-none text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary text-base transition-transform duration-300"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', fontVariationSettings: "'FILL' 1" }}
          >
            photo_library
          </span>
          <span className="text-[0.65rem] font-bold text-on-surface uppercase tracking-[0.2em]">{data.label}</span>
          <span className="text-[0.55rem] font-mono text-primary/50 uppercase tracking-wider">{data.items.length} EVENTS</span>
        </div>
        <span
          className="material-symbols-outlined text-on-surface-variant text-sm transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? '600px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-background/50">
          {data.items.map((item, i) => (
            <div key={i} className="relative group overflow-hidden border border-outline-variant/10">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <span className="font-mono text-[0.6rem] text-primary tracking-[0.15em] uppercase">{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   SYSTEM LOG COMPONENT
   ──────────────────────────────────────────────────── */

export function SystemLog() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface" id="experience">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-16">
           <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-on-surface">Experience</h2>
           <div className="flex-1 h-[2px] bg-gradient-to-r from-primary-container/40 to-transparent"></div>
        </div>
      </ScrollReveal>
      
      <div className="flex flex-col gap-1 bg-outline-variant/10 border border-outline-variant/10">
        {/* Professional Experience Section */}
        {experience.map((job, i) => (
          <ScrollReveal key={i} delay={i * 80}>
            <div 
              className="bg-surface-container-low p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start hover:bg-surface-container-high transition-all duration-300 group card-lift"
            >
              <div className="w-full md:w-1/4">
                <span className="text-primary font-mono text-[0.65rem] font-bold tracking-[0.3em] block mb-2">{job.period}</span>
                <h4 className="text-sm font-bold text-on-surface/80 uppercase tracking-widest">{job.role}</h4>
              </div>
              
              <div className="w-full md:w-3/4">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors duration-300">{job.company}</h3>
                    <p className="text-on-surface-variant mb-8 leading-relaxed text-sm max-w-3xl">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-6">
                      {job.tags.map((tag) => (
                        <span key={tag} className="skill-pill text-[0.6rem] font-black tracking-tighter text-outline uppercase border-b border-outline/20 pb-0.5 cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inline image (e.g. solder workshop for SCI) */}
                  {job.image && (
                    <div className="flex-shrink-0 w-full md:w-48 lg:w-56">
                      <div className="relative w-full aspect-[3/4] border border-outline-variant/20 overflow-hidden group/img">
                        <Image
                          src={job.image}
                          alt={job.imageAlt || ""}
                          fill
                          sizes="(max-width: 768px) 100vw, 256px"
                          className="object-cover grayscale-[20%] group-hover/img:grayscale-0 transition-all duration-500"
                        />
                        {job.imageCaption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <span className="font-mono text-[0.5rem] text-primary/80 tracking-[0.2em] uppercase">{job.imageCaption}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible event gallery (for ELLC) */}
                {job.collapsible && <EventGallery data={job.collapsible} />}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

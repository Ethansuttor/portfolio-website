"use client";

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
  },

];


/* ────────────────────────────────────────────────────
   SYSTEM LOG COMPONENT
   ──────────────────────────────────────────────────── */

export function SystemLog() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface">
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
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

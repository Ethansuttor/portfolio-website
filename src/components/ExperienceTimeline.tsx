type Contribution = { label: string; detail: string };

type TimelineEntry = {
  period: string;
  periodEnd?: string;
  active: boolean;
  type: "INTERNSHIP" | "PROFESSIONAL" | "LEADERSHIP";
  role: string;
  company: string;
  location?: string;
  description: string;
  tags: string[];
  contributions?: Contribution[];
};

const entries: TimelineEntry[] = [
  {
    period: "JAN 2026",
    active: true,
    type: "PROFESSIONAL",
    role: "SCI Student Worker",
    company: "Speed Center for Innovation",
    location: "University of Louisville",
    description:
      "Driving hands-on electronics innovation through rapid hardware prototyping and embedded system debugging. Providing technical support for industrial test equipment and ensuring precision in laboratory operations. Assisting students with component selection and workstation management.",
    tags: ["Prototyping", "Embedded Debug", "Hardware Test"],
  },
  {
    period: "AUG 2025",
    active: true,
    type: "LEADERSHIP",
    role: "Peer Mentor",
    company: "Engineering Living-Learning Community",
    location: "University of Louisville",
    description:
      "Mentored a cohort of 40 first-year engineering students through their transition to university-level coursework. Planned and facilitated 2 community-building events with 20 attendees each, fostering collaboration and peer networking within the residential engineering program.",
    tags: ["Mentorship", "Event Planning", "First-Year Support"],

  },
  {
    period: "ACTIVE",
    active: true,
    type: "LEADERSHIP",
    role: "Treasurer",
    company: "IEEE Student Chapter",
    location: "University of Louisville",
    description:
      "Managing PCB assembly lab operations for 15+ personnel. Orchestrating technical workshops focused on hardware design and enforcing strict IPC assembly standards to ensure professional-grade production.",
    tags: ["IPC Standards", "Lab Management", "Technical Workshops"],
  },
  {
    period: "AUG 2022",
    periodEnd: "MAY 2023",
    active: false,
    type: "INTERNSHIP",
    role: "Industrial Engineering Intern",
    company: "Nifco Americas",
    location: "Shelbyville, KY — Tier 1 Automotive Supplier",
    description:
      "Learned design processes from professional engineers. Designed mechanical parts for machine conversions and conveyors. Managed the hardware engineering database and updated technical documentation for global suppliers.",
    tags: ["SolidWorks", "5S Lean", "Database Management", "Technical Documentation", "Injection Molding"],
    contributions: [
      { label: "CAD Design", detail: "Created SolidWorks assemblies for machine conversion projects and conveyor system upgrades" },
      { label: "Database", detail: "Maintained and updated the hardware engineering database used across multiple plant locations" },
      { label: "Documentation", detail: "Updated technical specs and drawings for global supplier communications" },
      { label: "Manufacturing", detail: "Gained hands-on exposure to injection molding processes and 5S lean manufacturing standards" },
    ],

  },
];

const typeStyles: Record<TimelineEntry["type"], string> = {
  INTERNSHIP: "text-primary bg-primary-container/10 border-primary-container/30",
  PROFESSIONAL: "text-tertiary bg-tertiary/5 border-tertiary/20",
  LEADERSHIP: "text-on-surface-variant bg-surface-container-highest border-outline-variant/30",
};

function Entry({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  return (
    <div className="relative flex gap-0">
      {/* Timeline spine + dot */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          className={`relative z-10 flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 mt-1 ${
            entry.active
              ? "bg-primary-container border-primary-container shadow-[0_0_8px_rgba(153,27,27,0.5)]"
              : "bg-background border-outline-variant/50"
          }`}
        >
          {entry.active && (
            <span className="absolute inset-0 rounded-full bg-primary-container/40 animate-ping" />
          )}
        </div>
        {/* Line below dot */}
        {!isLast && <div className="w-px flex-1 bg-outline-variant/30 mt-2" />}
      </div>

      {/* Content */}
      <div className={`pl-6 ${isLast ? "pb-0" : "pb-12"} flex-1`}>
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[0.6rem] font-bold text-primary tracking-[0.25em] uppercase">
            {entry.period}{entry.periodEnd ? ` — ${entry.periodEnd}` : entry.active ? " — Present" : ""}
          </span>
          <span
            className={`text-[0.55rem] font-bold uppercase tracking-[0.2em] px-2 py-0.5 border ${typeStyles[entry.type]}`}
          >
            {entry.type}
          </span>
        </div>

        {/* Role + company */}
        <h3 className="text-xl font-bold text-on-surface tracking-tight mb-0.5">{entry.role}</h3>
        <p className="text-sm text-on-surface-variant/70 uppercase tracking-wider mb-5">{entry.company}{entry.location ? ` — ${entry.location}` : ""}</p>

        <p className="text-on-surface-variant text-sm leading-relaxed mb-5">{entry.description}</p>

        {/* Contributions */}
        {entry.contributions && (
          <div className="space-y-2 mb-5">
            {entry.contributions.map((c) => (
              <div
                key={c.label}
                className="flex gap-3 items-start p-3 bg-surface-container-high/50 border-l-2 border-outline-variant/20 hover:border-primary/60 transition-colors duration-200"
              >
                <span className="text-[0.6rem] font-black text-primary uppercase tracking-wider whitespace-nowrap min-w-[5.5rem]">
                  {c.label}
                </span>
                <span className="text-on-surface-variant text-xs leading-relaxed">{c.detail}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-background border border-outline-variant/25 text-[0.6rem] font-bold uppercase tracking-wider text-on-surface/60 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExperienceTimeline() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface-container-low" id="experience">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tighter text-on-surface">Experience</h2>
        <div className="flex-1 h-[1px] bg-outline-variant/40" />
      </div>

      <div className="max-w-4xl mx-auto">
        {entries.map((entry, i) => (
          <Entry key={i} entry={entry} isLast={i === entries.length - 1} />
        ))}
      </div>
    </section>
  );
}

import { SectionHeading } from "@/components/SectionHeading";

type TimelineEntry = {
  period: string;
  periodEnd?: string;
  active: boolean;
  type: "Internship" | "Work" | "Leadership";
  role: string;
  company: string;
  location?: string;
  description: string;
  highlights?: string[];
};

const entries: TimelineEntry[] = [
  {
    period: "May 2026",
    active: true,
    type: "Work",
    role: "Engineering co-op, now project engineer (part-time)",
    company: "Gaylor Electric",
    location: "Sellersburg, IN",
    description:
      "I started as an engineering co-op on active electrical construction jobs and stayed on part-time as a project engineer. The work is proposal budgets, material procurement and jobsite safety tracking.",
    highlights: [
      "Started a safety and performance token program that tracks and rewards jobsite safety",
      "Built internal automation tools in Microsoft Copilot Studio",
    ],
  },
  {
    period: "Jan 2026",
    periodEnd: "May 2026",
    active: false,
    type: "Work",
    role: "Student worker, electrical bench tech",
    company: "Speed Center for Innovation",
    location: "University of Louisville",
    description:
      "I helped students debug their embedded projects and bring up their PCBs, kept the test equipment running, and helped people pick parts.",
  },
  {
    period: "Feb 2025",
    periodEnd: "Aug 2026",
    active: false,
    type: "Leadership",
    role: "Executive officer",
    company: "IEEE Student Chapter",
    location: "University of Louisville",
    description:
      "Ran the chapter's PCB assembly lab for a group of 15+ students, organized hardware design workshops, and held everyone's soldering to IPC standards.",
  },
  {
    period: "Jan 2025",
    active: true,
    type: "Leadership",
    role: "Peer mentor",
    company: "Engineering Living-Learning Community",
    location: "University of Louisville",
    description:
      "Mentor to 40 first-year engineering students in the residential program. I also planned two community events, each with about 20 people.",
  },
  {
    period: "Aug 2022",
    periodEnd: "May 2023",
    active: false,
    type: "Internship",
    role: "Industrial engineering intern",
    company: "Nifco Americas",
    location: "Shelbyville, KY",
    description:
      "My first engineering job, at a Tier 1 automotive supplier. I learned the design process from the engineers there.",
    highlights: [
      "Modeled parts in SolidWorks for machine conversions and conveyor upgrades",
      "Kept the hardware engineering database current across several plants",
      "Updated specs and drawings for global suppliers",
      "Saw injection molding and 5S lean practices up close",
    ],
  },
];

function Entry({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  return (
    <li className="relative grid grid-cols-[1.75rem_1fr] md:grid-cols-[13rem_2.5rem_1fr] gap-x-4 md:gap-x-6">
      {/* Date column (desktop) */}
      <div className="hidden md:block pt-1 text-right">
        <p className="text-sm text-on-surface tabular-nums">
          {entry.period}
          <br />
          <span className="text-on-surface-variant">
            {entry.periodEnd ? `to ${entry.periodEnd}` : entry.active ? "to now" : ""}
          </span>
        </p>
      </div>

      {/* The trace: a via per role, lit while the role is current */}
      <div className="relative flex justify-center">
        {!isLast && <span aria-hidden="true" className="absolute top-6 bottom-0 w-[3px] bg-trace rounded-full" />}
        <span
          aria-hidden="true"
          className={`relative z-10 mt-1 grid place-items-center w-5 h-5 rounded-full border-[3px] ${
            entry.active ? "border-primary bg-background" : "border-outline bg-background"
          }`}
        >
          <span className={`block w-1.5 h-1.5 rounded-full ${entry.active ? "bg-primary" : "bg-outline"}`} />
        </span>
      </div>

      <div className={isLast ? "pb-0" : "pb-16"}>
        <p className="text-sm text-on-surface-variant mb-2">
          {entry.type}
          <span className="md:hidden">
            {" · "}
            {entry.period}
            {entry.periodEnd ? ` to ${entry.periodEnd}` : entry.active ? " to now" : ""}
          </span>
        </p>

        <h3 className="display text-on-surface text-[clamp(1.4rem,2.6vw,2rem)] leading-[1] mb-2">{entry.role}</h3>
        <p className="text-primary font-medium mb-5">
          {entry.company}
          {entry.location && <span className="text-on-surface-variant font-normal"> · {entry.location}</span>}
        </p>

        <p className="text-on-surface-variant leading-relaxed max-w-3xl mb-5">{entry.description}</p>

        {entry.highlights && (
          <ul className="max-w-3xl space-y-2 text-on-surface/85">
            {entry.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6rem] block w-1.5 h-1.5 shrink-0 bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function ExperienceTimeline() {
  return (
    <section id="experience" className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-16 bg-surface-container-low border-y border-outline-variant">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          title="Experience"
          note="Gold dots are roles I still hold."
        />

        <ol className="max-w-5xl mx-auto">
          {entries.map((entry, i) => (
            <Entry key={i} entry={entry} isLast={i === entries.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

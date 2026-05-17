import Image from "next/image";
import Link from "next/link";
import { allProjects, type Project } from "@/lib/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects#${project.slug}`}
      className="group flex flex-col bg-surface-container-high border border-outline-variant/20 hover:border-primary-container/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
      aria-label={`View project: ${project.title}`}
    >
      {/* Card header badge */}
      <div className={`px-5 py-2.5 flex items-center justify-between border-b ${project.featured ? "bg-primary-container/10 border-primary-container/20" : "bg-background border-outline-variant/15"}`}>
        <div className="flex items-center gap-2.5">
          <span className={`h-1.5 w-1.5 rounded-full ${project.featured ? "bg-primary-container animate-pulse" : "bg-outline-variant"}`} />
          <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            {project.featured ? `Featured Project ${String(project.featuredIndex).padStart(2, "0")}` : "Project"}
          </span>
        </div>
        <span className="font-sans text-[0.6rem] text-on-surface-variant/40 uppercase tracking-[0.15em] hidden sm:block truncate max-w-[10rem]">
          {project.tag.split("—")[1]?.trim() ?? project.tag}
        </span>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-background/60">
        <Image
          src={project.images[0].src}
          alt={project.images[0].alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Category */}
        <span className="text-primary font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em]">
          {project.tag.split("—")[0].trim()}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-on-surface leading-snug tracking-tight group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-background border border-outline-variant/25 text-[0.55rem] font-sans tracking-wide"
            >
              <span className="text-primary font-black">{chip.category}</span>
              <span className="text-on-surface/70">{chip.label}</span>
            </span>
          ))}
        </div>

        {/* Summary */}
        <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-3 flex-1">
          {project.summary}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary group-hover:gap-3 transition-all duration-200 mt-auto pt-1 border-t border-outline-variant/15">
          <span>View Project</span>
          <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export function CaseStudies() {
  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface-container-low" id="projects">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tighter text-on-surface">Projects</h2>
        <div className="flex-1 h-[1px] bg-outline-variant/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

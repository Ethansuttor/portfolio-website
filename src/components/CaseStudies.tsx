import Image from "next/image";
import Link from "next/link";
import { allProjects, type Project } from "@/lib/projects";
import { buildLog } from "@/lib/buildLog";
import { BUILD_LOG_HREF } from "@/lib/site";
import { BorderGlow } from "@/components/BorderGlow";
import { TechChips } from "@/components/TechChips";
import { ArrowRightIcon } from "@/components/icons";
import { projectGlow } from "@/lib/glowTheme";

function HeroProjectCard({ project }: { project: Project }) {
  return (
    <BorderGlow
      className="mb-6"
      {...projectGlow}
      backgroundColor="#161313"
      glowRadius={32}
    >
      {/* The whole card is clickable via the stretched "View Project" link
          below, so the secondary build-log link can sit alongside it instead of
          being nested inside an anchor. */}
      <div className="group relative flex flex-col bg-surface-container-high hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden h-full">
        {/* Card header banner - Red Featured Project Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b bg-primary-container/10 border-primary-container/20">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Featured Project {String(project.featuredIndex ?? 1).padStart(2, "0")}
            </span>
          </div>
          <span className="font-sans text-[0.6rem] text-on-surface-variant/40 uppercase tracking-[0.15em] hidden sm:block truncate max-w-[15rem]">
            {project.tag.split("—")[1]?.trim() ?? project.tag}
          </span>
        </div>

        {/* Main body: Image on left, Content on right for desktop */}
        <div className="flex flex-col md:flex-row">
          {/* Image — left side on desktop, top on mobile */}
          <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[520px] lg:min-h-[580px] overflow-hidden bg-background/90 flex-shrink-0 flex items-center justify-center p-2 border-b md:border-b-0 md:border-r border-outline-variant/20">
            <Image
              src={project.images[0].src}
              alt={project.images[0].alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-container-high/30 hidden md:block pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/80 via-transparent to-transparent md:hidden pointer-events-none" />
          </div>

          {/* Content — right side on desktop */}
          <div className="flex flex-col flex-1 p-6 md:p-10 justify-between">
            <div>
              {/* Category */}
              <span className="text-primary font-sans text-xs md:text-sm font-bold uppercase tracking-[0.25em] block mb-3">
                {project.tag.split("—")[0].trim()}
              </span>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors duration-200 mb-6">
                {project.title}
              </h3>

              <TechChips chips={project.techStack} className="mb-6" />

              {/* Summary */}
              <p className="text-on-surface/90 text-base md:text-lg leading-relaxed font-normal mb-8 flex-1">
                {project.summary}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs md:text-sm font-bold uppercase tracking-[0.2em] pt-5 border-t border-outline-variant/25 mt-auto">
              <ViewProjectLink project={project} />
              {project.blogHref && <BuildLogLink href={project.blogHref} />}
            </div>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

/**
 * Primary CTA on a project card. Its `::after` is stretched over the whole card
 * (the card body is `relative`), which is what makes the entire card clickable.
 */
function ViewProjectLink({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="inline-flex items-center gap-3 text-primary cursor-pointer transition-all duration-200 group-hover:gap-4 after:absolute after:inset-0 after:content-['']"
      aria-label={`View project: ${project.title}`}
    >
      <span>View Project</span>
      <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
    </Link>
  );
}

/**
 * Secondary CTA on a project card. Sits above the stretched "View Project"
 * overlay via `relative z-10`, so clicking it doesn't fall through to the card.
 */
function BuildLogLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="relative z-10 inline-flex items-center gap-3 text-primary cursor-pointer transition-all duration-200 group-hover:gap-4"
    >
      <span>Read Build Blog</span>
      <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
    </Link>
  );
}

/**
 * The newest build-log entry, so the home page shows the drone is still in
 * progress. Server-rendered from buildLog.ts — only these few fields reach the
 * page, not the whole log.
 */
function LatestBuildLogEntry() {
  const latest = buildLog[0];
  if (!latest) return null;

  return (
    <Link
      href={`${BUILD_LOG_HREF}#${latest.slug}`}
      className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6 px-5 py-4 bg-background/60 border border-outline-variant/25 border-l-2 border-l-primary-container hover:bg-background/90 hover:border-outline-variant/50 transition-colors duration-200"
    >
      <span className="flex items-center gap-2.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Latest build log · <time dateTime={latest.date}>{latest.dateLabel}</time>
        </span>
      </span>
      <span className="flex-1 min-w-0 text-sm md:text-base font-semibold text-on-surface group-hover:text-primary transition-colors duration-200">
        {latest.title}
      </span>
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary shrink-0">
        Read entry
        <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <BorderGlow
      className="h-full"
      {...projectGlow}
      backgroundColor="#161313"
      glowRadius={25}
    >
      <div className="group relative flex flex-col bg-surface-container-high hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 h-full">
        {/* Card header badge */}
        <div className={`px-5 py-3 flex items-center justify-between border-b ${project.featured ? "bg-primary-container/10 border-primary-container/20" : "bg-background border-outline-variant/15"}`}>
          <div className="flex items-center gap-2.5">
            <span className={`h-2 w-2 rounded-full ${project.featured ? "bg-primary-container animate-pulse" : "bg-outline-variant"}`} />
            <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              {project.featured ? `Featured Project ${String(project.featuredIndex).padStart(2, "0")}` : "Project"}
            </span>
          </div>
          <span className="font-sans text-xs text-on-surface-variant/60 uppercase tracking-[0.15em] hidden sm:block truncate max-w-[12rem]">
            {project.tag.split("—")[1]?.trim() ?? project.tag}
          </span>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-background/80 flex items-center justify-center p-4">
          <Image
            src={project.images[0].src}
            alt={project.images[0].alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6 flex-1 justify-between">
          <div>
            {/* Category */}
            <span className="text-primary font-sans text-xs md:text-sm font-bold uppercase tracking-[0.25em] block mb-2">
              {project.tag.split("—")[0].trim()}
            </span>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-extrabold text-on-surface leading-snug tracking-tight group-hover:text-primary transition-colors duration-200 mb-4">
              {project.title}
            </h3>

            <TechChips chips={project.techStack.slice(0, 4)} className="mb-4" />

            {/* Summary */}
            <p className="text-on-surface/90 text-base md:text-lg leading-relaxed font-normal flex-1 mb-4">
              {project.summary}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mt-auto pt-4 border-t border-outline-variant/20">
            <ViewProjectLink project={project} />
            {project.blogHref && <BuildLogLink href={project.blogHref} />}
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}

export function CaseStudies() {
  const heroProject = allProjects[0];
  const featuredGridProjects = allProjects.filter((p) => p.featured && p.slug !== heroProject.slug);

  return (
    <section className="section-divider py-24 px-8 md:px-24 bg-surface-container-low" id="projects">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-4xl font-bold tracking-tighter text-on-surface">Projects</h2>
        <div className="flex-1 h-[1px] bg-outline-variant/40" />
      </div>

      {/* Hero project — full-width prominent card */}
      <HeroProjectCard project={heroProject} />

      <LatestBuildLogEntry />

      {/* Top 2 featured grid projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {featuredGridProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* View All Projects Button */}
      <div className="flex justify-center pt-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-3 px-8 py-4 bg-background/80 border border-primary/40 hover:border-primary text-primary hover:text-white hover:bg-primary-container/20 font-bold text-sm md:text-base uppercase tracking-[0.2em] transition-all duration-300 shadow-xl group"
        >
          <span>View All Projects</span>
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </section>
  );
}

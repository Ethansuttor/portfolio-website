import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectDetailGallery } from "@/components/ProjectDetailGallery";
import { Pcb3DViewer } from "@/components/Pcb3DViewer";

/** Slug of the project that gets the interactive 3D board viewer and the
 *  split "System Implementation" / "Hardware & Telemetry" detail layout. */
const VIEWER_3D_SLUG = "custom-drone-flight-controller";

const detailCardClass =
  "flex flex-col gap-2 p-5 bg-surface-container-high/70 border border-outline-variant/20 border-l-4 border-l-primary hover:bg-surface-container-high/90 hover:border-outline-variant/40 transition-all duration-200 shadow-sm rounded-r";

const compactDetailCardClass =
  "flex flex-col gap-1.5 p-3.5 bg-surface-container-high/60 border-l-2 border-primary/60 hover:bg-surface-container-high/90 transition-colors duration-200";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-bold text-primary uppercase tracking-[0.25em] mb-3">
      {children}
    </span>
  );
}

function DetailCard({
  label,
  detail,
  expanded,
}: {
  label: string;
  detail: string;
  expanded: boolean;
}) {
  return (
    <div className={expanded ? detailCardClass : compactDetailCardClass}>
      <span
        className={
          expanded
            ? "text-xs font-black text-primary uppercase tracking-widest"
            : "text-xs font-black text-primary uppercase tracking-wider"
        }
      >
        {label}
      </span>
      <span
        className={
          expanded
            ? "text-on-surface/95 text-sm md:text-base leading-relaxed font-normal"
            : "text-on-surface/90 text-xs md:text-sm leading-relaxed"
        }
      >
        {detail}
      </span>
    </div>
  );
}

export type ProjectArticleProps = {
  project: Project;
  /** `h1` on the standalone project page, `h2` in the all-projects list. */
  headingLevel?: "h1" | "h2";
};

/**
 * The full write-up for a single project: header, gallery, overview and
 * technical detail columns. Shared by /projects (which stacks one per card)
 * and /projects/[slug] (which renders exactly one).
 */
export function ProjectArticle({ project, headingLevel = "h2" }: ProjectArticleProps) {
  const Heading = headingLevel;
  const hasViewer = project.slug === VIEWER_3D_SLUG;
  const details = project.technicalDetails ?? [];

  // The flight controller has enough detail entries to fill both columns, so
  // the first three sit under the photo and the rest go beside it.
  const leftDetails = hasViewer ? details.slice(0, 3) : [];
  const rightDetails = hasViewer ? details.slice(3) : details;

  const hasImages = project.images.length > 0;

  return (
    <>
      {/* Header */}
      <header className="mb-6">
        {project.featured && (
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-on-primary-container">
              Featured Project {String(project.featuredIndex).padStart(2, "0")}
            </span>
          </div>
        )}
        <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.2em] block mb-2">
          {project.tag}
        </span>
        <Heading className="text-2xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
          {project.title}
        </Heading>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high border border-outline-variant/30 text-xs font-sans tracking-wide"
            >
              <span className="text-primary font-black uppercase text-[0.65rem]">{chip.category}</span>
              <span className="text-on-surface/90 font-medium">{chip.label}</span>
            </span>
          ))}
        </div>
      </header>

      {hasViewer && (
        <div className="mb-8">
          <Pcb3DViewer />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: gallery, plus the first detail group for the 3D-viewer project */}
        {hasImages && (
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ProjectDetailGallery images={project.images} />

            {leftDetails.length > 0 && (
              <section className="mt-2">
                <SectionLabel>System Implementation</SectionLabel>
                <div className="flex flex-col gap-3.5">
                  {leftDetails.map((item) => (
                    <DetailCard key={item.label} label={item.label} detail={item.detail} expanded />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Right: text content */}
        <div className={`${hasImages ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-6`}>
          <section>
            <SectionLabel>Overview</SectionLabel>
            <p className="text-on-surface/90 leading-relaxed text-base md:text-lg font-normal">
              {project.description}
            </p>
          </section>

          {project.objective && (
            <section>
              <SectionLabel>Objective</SectionLabel>
              <p className="text-on-surface/90 leading-relaxed text-base md:text-lg font-normal">
                {project.objective}
              </p>
            </section>
          )}

          {rightDetails.length > 0 && (
            <section>
              <SectionLabel>{hasViewer ? "Hardware & Telemetry" : "Implementation"}</SectionLabel>
              <div className={hasViewer ? "flex flex-col gap-3.5" : "grid grid-cols-1 md:grid-cols-2 gap-3"}>
                {rightDetails.map((item) => (
                  <DetailCard
                    key={item.label}
                    label={item.label}
                    detail={item.detail}
                    expanded={hasViewer}
                  />
                ))}
              </div>
            </section>
          )}

          {project.architecture && (
            <section>
              <SectionLabel>Architecture</SectionLabel>
              <p className="text-on-surface/90 leading-relaxed text-base md:text-lg font-normal">
                {project.architecture}
              </p>
            </section>
          )}

          {project.iteration && (
            <div className="p-5 bg-primary-container/10 border-l-2 border-primary-container">
              <span className="block text-xs font-black text-primary uppercase tracking-widest mb-2">
                Competition Notes
              </span>
              <p className="text-on-surface/90 text-sm md:text-base leading-relaxed">
                {project.iteration}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
          <a
            href={project.githubHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary bg-background hover:bg-primary-container/5 transition-all duration-200 text-xs md:text-sm font-bold uppercase tracking-widest w-fit shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View Code on GitHub
          </a>

            {project.blogHref && (
              <Link
                href={project.blogHref}
                className="inline-flex items-center gap-2.5 px-5 py-3 border border-primary-container/60 hover:border-primary text-primary bg-primary-container/10 hover:bg-primary-container/20 transition-all duration-200 text-xs md:text-sm font-bold uppercase tracking-widest w-fit shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M4 5.5A1.5 1.5 0 015.5 4H9a3 3 0 013 3v13a2.5 2.5 0 00-2.5-2.5h-4A1.5 1.5 0 014 16V5.5zM20 5.5A1.5 1.5 0 0018.5 4H15a3 3 0 00-3 3v13a2.5 2.5 0 012.5-2.5h4A1.5 1.5 0 0020 16V5.5z"
                  />
                </svg>
                Read Build Blog
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

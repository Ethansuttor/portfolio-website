import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectDetailGallery } from "@/components/ProjectDetailGallery";
import { Pcb3DViewer } from "@/components/Pcb3DViewer";
import { TechChips } from "@/components/TechChips";
import { GitHubIcon } from "@/components/icons";

/** Slug of the project that gets the interactive 3D board viewer and the
 *  split "System Implementation" / "Hardware & Telemetry" detail layout. */
const VIEWER_3D_SLUG = "custom-drone-flight-controller";

const detailCardClass =
  "flex flex-col gap-2 p-5 rounded-md bg-background/50 border border-outline-variant hover:border-outline transition-colors duration-200";

const compactDetailCardClass =
  "flex flex-col gap-1.5 p-4 rounded-md bg-background/50 border border-outline-variant hover:border-outline transition-colors duration-200";

/** One level below the article's own heading, so the outline never skips a level. */
function SectionLabel({ as: Tag, children }: { as: "h2" | "h3"; children: React.ReactNode }) {
  return (
    <Tag className="font-semibold text-on-surface text-lg mb-3">{children}</Tag>
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
      <span className="silk text-primary">
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
  /** Links the title to the project's own page. Set in the all-projects list,
   *  so a project can be opened (and shared) with its own URL and preview card. */
  href?: string;
};

/**
 * The full write-up for a single project: header, gallery, overview and
 * technical detail columns. Shared by /projects (which stacks one per card)
 * and /projects/[slug] (which renders exactly one).
 */
export function ProjectArticle({ project, headingLevel = "h2", href }: ProjectArticleProps) {
  const Heading = headingLevel;
  const Sub = headingLevel === "h1" ? "h2" : "h3";
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
        <span className="text-sm text-on-surface-variant block mb-4">
          {project.tag}
        </span>
        <Heading className="display text-on-surface text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[0.95] mb-6">
          {href ? (
            <Link
              href={href}
              className="hover:text-primary underline-offset-8 decoration-2 decoration-primary/50 hover:underline transition-colors duration-200"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </Heading>

        <TechChips chips={project.techStack} variant="article" />
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
                <SectionLabel as={Sub}>System Implementation</SectionLabel>
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
            <SectionLabel as={Sub}>Overview</SectionLabel>
            <p className="text-on-surface/90 leading-relaxed text-base md:text-lg font-normal">
              {project.description}
            </p>
          </section>

          {project.objective && (
            <section>
              <SectionLabel as={Sub}>Objective</SectionLabel>
              <p className="text-on-surface/90 leading-relaxed text-base md:text-lg font-normal">
                {project.objective}
              </p>
            </section>
          )}

          {rightDetails.length > 0 && (
            <section>
              <SectionLabel as={Sub}>{hasViewer ? "Hardware & Telemetry" : "Implementation"}</SectionLabel>
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
              <SectionLabel as={Sub}>Architecture</SectionLabel>
              <p className="text-on-surface/90 leading-relaxed text-base md:text-lg font-normal">
                {project.architecture}
              </p>
            </section>
          )}

          {project.iteration && (
            <div className="p-6 rounded-md bg-primary/[0.07] border border-primary/30">
              <span className="block font-semibold text-primary mb-2">
                Competition result
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
            className="btn-ghost px-5 py-3 text-sm w-fit"
          >
            <GitHubIcon />
            View Code on GitHub
          </a>

            {project.blogHref && (
              <Link
                href={project.blogHref}
                className="btn-ghost px-5 py-3 text-sm w-fit"
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

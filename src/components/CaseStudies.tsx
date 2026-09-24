import Image from "next/image";
import Link from "next/link";
import { allProjects, type Project } from "@/lib/projects";
import { buildLog, buildStatus } from "@/lib/buildLog";
import { BUILD_LOG_HREF } from "@/lib/site";
import { ArrowRightIcon } from "@/components/icons";
import { InViewVideo } from "@/components/InViewVideo";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * Primary link on a project card. Its `::after` is stretched over the whole card
 * (the card is `relative`), which is what makes the entire card clickable.
 */
function ViewProjectLink({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-['']"
      aria-label={`Read the write-up: ${project.title}`}
    >
      Read the write-up
      <ArrowRightIcon className="w-4 h-4" />
    </Link>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const clip = project.images.find((img) => img.video && img.poster);
  const latest = buildLog[0];

  return (
    <article className="group relative grid grid-cols-1 lg:grid-cols-12 rounded-md border border-outline-variant bg-surface-container-low overflow-hidden">
      <figure className="relative lg:col-span-5 aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[640px] bg-background">
        {clip?.poster ? (
          <InViewVideo
            src={clip.src}
            poster={clip.poster}
            label={clip.alt}
            className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
          />
        ) : (
          <Image src={project.images[0].src} alt={project.images[0].alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
        )}
        {clip && (
          <figcaption className="absolute left-0 bottom-0 right-0 px-5 py-3 text-sm text-on-surface bg-background/85">
            Bench test: one motor at full throttle from the FlySky transmitter
          </figcaption>
        )}
      </figure>

      <div className="lg:col-span-7 flex flex-col p-7 sm:p-10 lg:p-14">
        <p className="text-sm text-on-surface-variant mb-5">
          {project.tag} · <span className="text-led">{buildStatus}</span>
        </p>

        <h3 className="display text-on-surface text-[clamp(2rem,4vw,3.4rem)] mb-6">{project.title}</h3>

        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mb-9">{project.summary}</p>

        {/* The main parts, laid out like a BOM */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-outline-variant mb-9">
          {project.techStack.map((chip) => (
            <div key={chip.label} className="border-r border-b border-outline-variant px-4 py-3">
              <dt className="silk text-on-surface-variant/80 mb-1">{chip.category}</dt>
              <dd className="text-on-surface font-medium">{chip.label}</dd>
            </div>
          ))}
        </dl>

        {latest && (
          <p className="relative z-10 text-on-surface-variant mb-9">
            Latest log entry, <time dateTime={latest.date}>{latest.dateLabel}</time>:{" "}
            <Link
              href={`${BUILD_LOG_HREF}#${latest.slug}`}
              className="text-on-surface underline decoration-outline underline-offset-4 hover:decoration-primary hover:text-primary"
            >
              {latest.title}
            </Link>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-3">
          <ViewProjectLink project={project} />
          {project.blogHref && (
            <Link
              href={project.blogHref}
              className="relative z-10 font-semibold text-on-surface-variant hover:text-on-surface underline-offset-4 hover:underline"
            >
              Full build log
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0];

  return (
    <article className="group relative flex flex-col rounded-md border border-outline-variant bg-surface-container-low overflow-hidden hover:border-outline transition-colors">
      <div className="relative aspect-[16/11] bg-background border-b border-outline-variant">
        <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>

      <div className="flex flex-col flex-1 p-7 sm:p-8">
        <p className="text-sm text-on-surface-variant mb-3">{project.tag}</p>
        <h3 className="display text-on-surface text-[clamp(1.5rem,2.4vw,2rem)] leading-[0.98] mb-4">{project.title}</h3>
        <p className="text-on-surface-variant leading-relaxed mb-5">{project.summary}</p>
        <p className="text-sm text-on-surface/70 mb-6">{project.techStack.map((c) => c.label).join(", ")}</p>
        <div className="mt-auto">
          <ViewProjectLink project={project} />
        </div>
      </div>
    </article>
  );
}

export function CaseStudies() {
  const [heroProject, ...rest] = allProjects;
  const gridProjects = rest.filter((p) => p.featured);
  const moreProjects = rest.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 md:py-32 px-5 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading title="Projects" />

        <FeaturedProject project={heroProject} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {gridProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {moreProjects.length > 0 && (
          <div className="mt-16">
            <h3 className="text-on-surface-variant mb-3">Other projects</h3>
            <ul className="border-t border-outline-variant">
              {moreProjects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_18rem_auto] items-center gap-x-6 gap-y-1 py-5 border-b border-outline-variant"
                  >
                    <span className="display text-xl md:text-2xl text-on-surface group-hover:text-primary">
                      {project.title}
                    </span>
                    <span className="text-sm text-on-surface-variant hidden md:block">{project.tag}</span>
                    <ArrowRightIcon className="w-5 h-5 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10">
          <Link href="/projects" className="font-semibold text-primary underline-offset-4 hover:underline">
            See every project on one page
          </Link>
        </p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { allProjects } from "@/lib/projects";
import { ProjectArticle } from "@/components/ProjectArticle";
import { ProjectScrollHandler } from "@/components/ProjectScrollHandler";
import { SubpageFooter, SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Projects | Ethan Suttor",
  description:
    "Engineering projects by Ethan Suttor: a custom flight controller PCB, an FPGA counter, a CMOS cell library and more.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-on-background">
      <ProjectScrollHandler />

      <SubpageNav backHref="/#projects" backLabel="Home" label="All Projects" />

      <header className="mask-texture px-5 sm:px-8 lg:px-16 pt-20 pb-16 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <h1 className="display text-on-surface text-[clamp(2.4rem,6vw,4.5rem)] mb-4">All projects</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Every write-up in one place. Each title links to a page of its own if you want to share one.
          </p>
        </div>
      </header>

      {/* Project list */}
      <div className="flex flex-col gap-8 py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {allProjects.map((project) => (
          <article
            key={project.slug}
            id={project.slug}
            className="rounded-md border border-outline-variant bg-surface-container-low px-6 md:px-14 py-10 md:py-14 w-full scroll-mt-20"
          >
            <ProjectArticle project={project} headingLevel="h2" href={`/projects/${project.slug}`} />
          </article>
        ))}
      </div>

      <SubpageFooter backHref="/#projects" backLabel="Back to Home" />
    </main>
  );
}

import type { Metadata } from "next";
import { allProjects } from "@/lib/projects";
import { ProjectArticle } from "@/components/ProjectArticle";
import { ProjectScrollHandler } from "@/components/ProjectScrollHandler";
import { SubpageFooter, SubpageNav } from "@/components/SubpageNav";
import { BorderGlow } from "@/components/BorderGlow";
import { projectGlow } from "@/lib/glowTheme";

export const metadata: Metadata = {
  title: "Projects | Ethan Suttor",
  description:
    "Engineering projects by Ethan Suttor — FPGA design, embedded systems, VLSI layout, and autonomous robotics.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-on-background">
      <ProjectScrollHandler />

      <SubpageNav backHref="/#projects" backLabel="Home" label="All Projects" />

      {/* Project list */}
      <div className="flex flex-col gap-10 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {allProjects.map((project) => (
          <BorderGlow
            key={project.slug}
            {...projectGlow}
            backgroundColor="#141111"
            glowRadius={30}
            className="w-full"
          >
            <article
              id={project.slug}
              className="px-6 md:px-16 py-10 w-full scroll-mt-16 bg-surface-container-low/30"
            >
              <ProjectArticle project={project} headingLevel="h2" href={`/projects/${project.slug}`} />
            </article>
          </BorderGlow>
        ))}
      </div>

      <SubpageFooter backHref="/#projects" backLabel="Back to Home" />
    </main>
  );
}

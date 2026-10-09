import type { Metadata } from "next";
import { allProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/CaseStudies";
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

      <SubpageNav backHref="/#projects" backLabel="Home" label="All projects" />

      <header className="mask-texture px-5 sm:px-8 lg:px-16 pt-20 pb-16 border-b border-outline-variant">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="display text-on-surface text-[min(11vw,4.5rem)] sm:text-[clamp(2.4rem,6vw,4.5rem)] mb-4">All projects</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Every project in one place. Each card links to its own write-up if you want to share one.
          </p>
        </div>
      </header>

      {/* Project index. Each card keeps id={slug} so old /projects#slug links still land. */}
      <div className="px-5 sm:px-8 lg:px-16 py-12">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {allProjects.map((project) => (
            <ProjectCard key={project.slug} id={project.slug} project={project} headingLevel="h2" />
          ))}
        </div>
      </div>

      <SubpageFooter backHref="/#projects" backLabel="Back to home" />
    </main>
  );
}

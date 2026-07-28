import type { Metadata } from "next";
import Link from "next/link";
import { allProjects } from "@/lib/projects";
import { ProjectArticle } from "@/components/ProjectArticle";
import { ProjectScrollHandler } from "@/components/ProjectScrollHandler";
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

      {/* Nav bar */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/20 px-8 md:px-24 py-4 flex items-center justify-between">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M11 6H1M5 10L1 6l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hidden sm:block">
          All Projects
        </span>
      </nav>

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
              <ProjectArticle project={project} headingLevel="h2" />
            </article>
          </BorderGlow>
        ))}
      </div>

      {/* Footer nav */}
      <div className="border-t border-outline-variant/15 px-8 md:px-24 py-8 flex items-center justify-between">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M11 6H1M5 10L1 6l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
        <a
          href="#"
          className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface-variant transition-colors duration-200"
        >
          ↑ Top
        </a>
      </div>
    </main>
  );
}

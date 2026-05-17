import type { Metadata } from "next";
import Link from "next/link";
import { allProjects } from "@/lib/projects";
import { ProjectDetailGallery } from "@/components/ProjectDetailGallery";
import { ProjectScrollHandler } from "@/components/ProjectScrollHandler";

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
      <div className="flex flex-col">
        {allProjects.map((project, idx) => (
          <article
            key={project.slug}
            id={project.slug}
            className="px-8 md:px-24 py-16 max-w-7xl mx-auto w-full scroll-mt-16"
          >
            {/* Header */}
            <header className="mb-12">
              {project.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-on-primary-container">
                    Featured Project {String(project.featuredIndex).padStart(2, "0")}
                  </span>
                </div>
              )}
              <span className="text-primary font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em] block mb-3">
                {project.tag}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight leading-tight mb-8">
                {project.title}
              </h2>

              {/* Tech chips */}
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high border border-outline-variant/30 text-[0.6rem] font-sans tracking-wide"
                  >
                    <span className="text-primary font-black">{chip.category}</span>
                    <span className="text-on-surface/80">{chip.label}</span>
                  </span>
                ))}
              </div>
            </header>

            {/* Body: image + detail side by side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Image gallery */}
              <div className="lg:col-span-5">
                <ProjectDetailGallery images={project.images} />
              </div>

              {/* Right: Text content */}
              <div className="lg:col-span-7 flex flex-col gap-10">
                {/* Overview */}
                <section>
                  <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
                    Overview
                  </span>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    {project.description}
                  </p>
                </section>

                {/* Objective (for non-featured projects) */}
                {!project.featured && project.objective && project.objective !== project.description && (
                  <section>
                    <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
                      Objective
                    </span>
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      {project.objective}
                    </p>
                  </section>
                )}

                {/* Technical details */}
                {project.technicalDetails && project.technicalDetails.length > 0 && (
                  <section>
                    <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
                      Implementation
                    </span>
                    <div className="space-y-2">
                      {project.technicalDetails.map((item) => (
                        <div
                          key={item.label}
                          className="flex gap-3 items-start p-3 bg-surface-container-high/60 border-l-2 border-outline-variant/20 hover:border-primary/60 transition-colors duration-200"
                        >
                          <span className="text-[0.6rem] font-black text-primary uppercase tracking-wider whitespace-nowrap min-w-[5rem]">
                            {item.label}
                          </span>
                          <span className="text-on-surface-variant text-xs leading-relaxed">
                            {item.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Architecture (non-featured) */}
                {!project.featured && project.architecture && (
                  <section>
                    <span className="block text-[0.6rem] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-3">
                      Architecture
                    </span>
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      {project.architecture}
                    </p>
                  </section>
                )}

                {/* Iteration notes */}
                {project.iteration && (
                  <div className="p-4 bg-primary-container/5 border-l-2 border-primary-container">
                    <span className="block text-[0.65rem] font-black text-primary uppercase tracking-widest mb-1">
                      Competition Notes
                    </span>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      {project.iteration}
                    </p>
                  </div>
                )}

                {/* GitHub */}
                <a
                  href={project.githubHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-outline-variant/50 hover:border-primary text-on-surface-variant hover:text-primary bg-background hover:bg-primary-container/5 transition-all duration-200 text-[0.7rem] font-bold uppercase tracking-widest w-fit"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  View Code on GitHub
                </a>
              </div>
            </div>

            {/* Divider between projects */}
            {idx < allProjects.length - 1 && (
              <div className="mt-16 h-px bg-outline-variant/20" />
            )}
          </article>
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

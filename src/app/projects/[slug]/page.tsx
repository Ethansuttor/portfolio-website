import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allProjects, getProjectBySlug } from "@/lib/projects";
import { ProjectArticle } from "@/components/ProjectArticle";
import { GITHUB_URL, SITE_URL } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} | Ethan Suttor`;

  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    // Without this, project pages inherit the root layout's openGraph block and
    // preview as the generic site title instead of the project. The image comes
    // from this segment's opengraph-image.tsx.
    openGraph: {
      type: "article",
      url: `${SITE_URL}/projects/${slug}`,
      title,
      description: project.summary,
      siteName: "Ethan Suttor",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-background text-on-background">
      {/* Tells search engines this is a distinct technical work rather than a
          generic page, and ties each one back to the same author. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            headline: project.title,
            description: project.summary,
            url: `${SITE_URL}/projects/${project.slug}`,
            author: {
              "@type": "Person",
              name: "Ethan Suttor",
              url: SITE_URL,
            },
            keywords: project.techStack.map((chip) => chip.label).join(", "),
            genre: project.tag,
            image: `${SITE_URL}${project.images[0]?.src ?? ""}`,
            codeRepository: project.githubHref,
            isPartOf: {
              "@type": "CollectionPage",
              name: "Projects",
              url: `${SITE_URL}/projects`,
            },
            sameAs: GITHUB_URL,
          }),
        }}
      />

      {/* Nav bar */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/20 px-8 md:px-24 py-4 flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M11 6H1M5 10L1 6l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All Projects
        </Link>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hidden sm:block truncate max-w-xs">
          {project.title}
        </span>
      </nav>

      <article className="px-8 md:px-24 py-16 max-w-7xl mx-auto">
        <ProjectArticle project={project} headingLevel="h1" />
      </article>

      {/* Footer nav */}
      <div className="border-t border-outline-variant/15 px-8 md:px-24 py-8 flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M11 6H1M5 10L1 6l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to All Projects
        </Link>
        <Link
          href="/#top"
          className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface-variant transition-colors duration-200"
        >
          ↑ Top
        </Link>
      </div>
    </main>
  );
}

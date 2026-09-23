import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allProjects, getProjectBySlug } from "@/lib/projects";
import { ProjectArticle } from "@/components/ProjectArticle";
import { SubpageFooter, SubpageNav } from "@/components/SubpageNav";
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

      <SubpageNav backHref="/projects" backLabel="All Projects" label={project.title} />

      <article className="px-8 md:px-24 py-16 max-w-7xl mx-auto">
        <ProjectArticle project={project} headingLevel="h1" />
      </article>

      <SubpageFooter backHref="/projects" backLabel="Back to All Projects" />
    </main>
  );
}

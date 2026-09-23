import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildLog, buildStatus, type LogBlock, type LogMedia } from "@/lib/buildLog";
import { getProjectBySlug } from "@/lib/projects";
import { BUILD_LOG_HREF, GITHUB_URL, SITE_URL } from "@/lib/site";
import { SubpageFooter, SubpageNav } from "@/components/SubpageNav";
import { GitHubIcon } from "@/components/icons";

const PROJECT_SLUG = "custom-drone-flight-controller";
const TITLE = "Flight Controller Build Log";
const DESCRIPTION =
  "A dated log of designing, fabricating and bringing up a custom STM32F405 flight controller PCB — including the sourcing failure, the wrong flash chip, and the DMA collision that cost a day.";

export const metadata: Metadata = {
  title: `${TITLE} | Ethan Suttor`,
  description: DESCRIPTION,
  alternates: { canonical: BUILD_LOG_HREF },
  openGraph: {
    type: "article",
    url: `${SITE_URL}${BUILD_LOG_HREF}`,
    title: `${TITLE} | Ethan Suttor`,
    description: DESCRIPTION,
    siteName: "Ethan Suttor",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Ethan Suttor`,
    description: DESCRIPTION,
  },
};

function Block({ block }: { block: LogBlock }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="text-on-surface/85 text-sm md:text-base leading-relaxed">{block.text}</p>
      );

    case "list":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-on-surface/85 text-sm md:text-base leading-relaxed">
              <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "code":
      return (
        <figure className="border border-outline-variant/25 bg-background">
          {block.caption && (
            <figcaption className="px-4 py-2 border-b border-outline-variant/20 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70">
              {block.caption}
            </figcaption>
          )}
          <pre className="overflow-x-auto px-4 py-3 text-[0.72rem] md:text-xs leading-relaxed text-on-surface/80">
            <code>{block.code}</code>
          </pre>
        </figure>
      );

    case "callout":
      return (
        <aside className="p-5 bg-primary-container/10 border-l-2 border-primary-container">
          <span className="block text-[0.62rem] font-black text-primary uppercase tracking-[0.18em] mb-2">
            {block.label}
          </span>
          <p className="text-on-surface/90 text-sm md:text-base leading-relaxed">{block.text}</p>
        </aside>
      );
  }
}

function Media({ media }: { media: LogMedia }) {
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative w-full aspect-[4/3] border border-outline-variant/20 bg-background overflow-hidden">
        {media.kind === "video" ? (
          <video
            src={media.src}
            poster={media.poster}
            aria-label={media.alt}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-contain p-2"
          />
        )}
      </div>
      <figcaption className="text-xs text-on-surface-variant/70 leading-relaxed">{media.caption}</figcaption>
    </figure>
  );
}

export default function DroneBuildLogPage() {
  const project = getProjectBySlug(PROJECT_SLUG);
  const latest = buildLog[0];

  return (
    <main className="min-h-screen bg-background text-on-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: TITLE,
            description: DESCRIPTION,
            url: `${SITE_URL}${BUILD_LOG_HREF}`,
            author: { "@type": "Person", name: "Ethan Suttor", url: SITE_URL },
            blogPost: buildLog.map((entry) => ({
              "@type": "BlogPosting",
              headline: entry.title,
              datePublished: entry.date,
              description: entry.standfirst,
              url: `${SITE_URL}${BUILD_LOG_HREF}#${entry.slug}`,
              author: { "@type": "Person", name: "Ethan Suttor", url: SITE_URL },
            })),
            sameAs: GITHUB_URL,
          }),
        }}
      />

      <SubpageNav backHref={`/projects/${PROJECT_SLUG}`} backLabel="The Project" label="Build Log" />

      <div className="px-6 md:px-24 py-14 max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-14">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Build Log — Custom Flight Controller
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
            Designing a flight controller, and everything that went wrong on the way
          </h1>
          <div className="flex flex-col gap-4 max-w-3xl">
            <p className="text-on-surface/85 text-base md:text-lg leading-relaxed">
              An STM32F405 flight controller for a 4S freestyle quad, running Betaflight off a target I
              wrote. I started it to find out whether I could take an embedded system from a blank
              schematic to something that actually flies.
            </p>
            <p className="text-on-surface/70 text-sm md:text-base leading-relaxed">
              I&apos;ve been keeping this log since May, and I&apos;ve kept the entries that make me look
              bad. A gyro that stopped existing mid-design, a flash chip a quarter the size I ordered, and
              a DMA collision that read as a hardware fault for a full day. Those are the interesting parts.
            </p>
          </div>

          {/* Status band */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 py-4 border-y border-outline-variant/20">
            <div>
              <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60 mb-1">
                Last update
              </span>
              <time dateTime={latest.date} className="text-sm font-semibold text-on-surface">
                {latest.dateLabel}
              </time>
            </div>
            <div>
              <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60 mb-1">
                Status
              </span>
              <span className="text-sm font-semibold text-on-surface">{buildStatus}</span>
            </div>
            <div>
              <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60 mb-1">
                Entries
              </span>
              <span className="text-sm font-semibold text-on-surface">{buildLog.length}</span>
            </div>
          </div>

          {/* Jump list */}
          <nav aria-label="Log entries" className="mt-8">
            <span className="block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60 mb-3">
              Jump to
            </span>
            <ol className="flex flex-col gap-1.5">
              {buildLog.map((entry) => (
                <li key={entry.slug}>
                  <a
                    href={`#${entry.slug}`}
                    className="group inline-flex flex-wrap items-baseline gap-x-3 text-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
                  >
                    <time dateTime={entry.date} className="font-mono text-[0.7rem] text-on-surface-variant/50 tabular-nums">
                      {entry.date}
                    </time>
                    <span className="group-hover:underline underline-offset-4">{entry.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {/* Entries */}
        <div className="flex flex-col">
          {buildLog.map((entry) => (
            <article
              key={entry.slug}
              id={entry.slug}
              className="scroll-mt-20 py-10 border-t border-outline-variant/20"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <time
                  dateTime={entry.date}
                  className="font-mono text-[0.7rem] tracking-wide text-on-surface-variant/60 tabular-nums"
                >
                  {entry.dateLabel}
                </time>
                <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant/30 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-primary">
                  {entry.phase}
                </span>
              </div>

              <h2 className="text-xl md:text-3xl font-bold text-on-surface tracking-tight leading-snug mb-3">
                {entry.title}
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
                {entry.standfirst}
              </p>

              <div
                className={
                  entry.media
                    ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                    : "max-w-3xl"
                }
              >
                {entry.media && (
                  <div className="lg:col-span-5 lg:sticky lg:top-24">
                    <Media media={entry.media} />
                  </div>
                )}
                <div className={`flex flex-col gap-5 ${entry.media ? "lg:col-span-7" : ""}`}>
                  {entry.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTAs */}
        <div className="mt-14 pt-10 border-t border-outline-variant/20 flex flex-wrap gap-3">
          <Link
            href={`/projects/${PROJECT_SLUG}`}
            className="inline-flex items-center gap-2.5 px-5 py-3 border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary bg-background hover:bg-primary-container/5 transition-all duration-200 text-xs md:text-sm font-bold uppercase tracking-widest shadow-md"
          >
            The full project write-up
          </Link>
          {project && (
            <a
              href={project.githubHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary bg-background hover:bg-primary-container/5 transition-all duration-200 text-xs md:text-sm font-bold uppercase tracking-widest shadow-md"
            >
              <GitHubIcon />
              Repo
            </a>
          )}
        </div>
      </div>

      <SubpageFooter backHref="/projects" backLabel="All Projects" />
    </main>
  );
}

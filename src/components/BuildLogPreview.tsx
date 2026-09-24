import Link from "next/link";
import { buildLog, buildStatus } from "@/lib/buildLog";
import { BUILD_LOG_HREF } from "@/lib/site";
import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";

/** How many of the newest entries the home page shows. */
const PREVIEW_COUNT = 3;

/** The newest build log entries, so the log is on the home page and not only
 *  behind a link. Server-rendered, so only these few fields reach the page. */
export function BuildLogPreview() {
  const latest = buildLog.slice(0, PREVIEW_COUNT);
  if (latest.length === 0) return null;

  return (
    <section id="build-log" className="relative py-24 md:py-32 px-5 sm:px-8 lg:px-16 bg-surface-container-low border-t border-outline-variant">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          title="Build log"
          note={
            <>
              A running diary of the flight controller build, mistakes included. Status:{" "}
              <span className="text-led">{buildStatus.toLowerCase()}</span>.
            </>
          }
        />

        <ol>
          {latest.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`${BUILD_LOG_HREF}#${entry.slug}`}
                className="group grid grid-cols-1 md:grid-cols-[11rem_1fr_auto] gap-x-8 gap-y-2 py-7 border-b border-outline-variant"
              >
                <time dateTime={entry.date} className="text-sm text-on-surface-variant md:pt-1.5">
                  {entry.dateLabel}
                </time>
                <span>
                  <span className="block display text-on-surface text-xl md:text-2xl leading-[1.05] mb-2 group-hover:text-primary">
                    {entry.title}
                  </span>
                  <span className="block text-on-surface-variant leading-relaxed max-w-3xl">{entry.standfirst}</span>
                </span>
                <ArrowRightIcon className="hidden md:block w-5 h-5 mt-2 text-primary" />
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-10">
          <Link href={BUILD_LOG_HREF} className="btn-gold px-6 py-3.5">
            Read all {buildLog.length} entries
          </Link>
        </p>
      </div>
    </section>
  );
}

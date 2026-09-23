import type { Metadata } from "next";
import Link from "next/link";
import { BUILD_LOG_HREF } from "@/lib/site";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found | Ethan Suttor",
};

const suggestions = [
  { href: "/projects", label: "All Projects" },
  { href: BUILD_LOG_HREF, label: "Build Log" },
];

const secondaryClass =
  "inline-flex items-center gap-2.5 px-5 py-3 border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary bg-background hover:bg-primary-container/5 transition-all duration-200 text-xs md:text-sm font-bold uppercase tracking-widest shadow-md";

/** Rendered for any URL that matches no route, and when a page calls notFound()
 *  (e.g. /projects/<unknown-slug>). Next serves it with a 404 status. */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-on-background technical-grid flex items-center px-8 md:px-24">
      <div className="max-w-3xl py-24">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-surface-container-high border border-outline-variant/30 font-mono text-[0.7rem] tracking-[0.1em] text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-container" aria-hidden="true" />
          ERROR 404
        </span>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-on-surface mb-6">
          Nothing at <span className="block text-primary-container">this address.</span>
        </h1>

        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl mb-10">
          The page you were looking for doesn&apos;t exist, or it has moved. One of these should get
          you back on track.
        </p>

        <nav aria-label="Suggested pages" className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="cta-primary inline-flex items-center gap-2.5 px-5 py-3 bg-primary-container text-on-primary-container text-xs md:text-sm font-bold uppercase tracking-widest"
          >
            Home
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
          {suggestions.map(({ href, label }) => (
            <Link key={href} href={href} className={secondaryClass}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

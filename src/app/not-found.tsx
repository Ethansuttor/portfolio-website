import type { Metadata } from "next";
import Link from "next/link";
import { BUILD_LOG_HREF } from "@/lib/site";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found | Ethan Suttor",
};

const suggestions = [
  { href: "/projects", label: "All Projects" },
  { href: BUILD_LOG_HREF, label: "Build log" },
];

const secondaryClass =
  "btn-ghost px-5 py-3 text-sm";

/** Rendered for any URL that matches no route, and when a page calls notFound()
 *  (e.g. /projects/<unknown-slug>). Next serves it with a 404 status. */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-on-background mask-texture flex items-center px-5 sm:px-8 lg:px-16">
      <div className="max-w-3xl py-24">
        <span className="silk inline-flex items-center gap-2.5 mb-6 text-on-surface-variant">
          <span className="h-2 w-2 rounded-full bg-tertiary" aria-hidden="true" />
          Error 404 · open circuit
        </span>

        <h1 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-on-surface mb-8">
          Nothing at this address
        </h1>

        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-xl mb-10">
          There&apos;s no page here. It may have moved, or the link has a typo. Try one of these instead.
        </p>

        <nav aria-label="Suggested pages" className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="btn-gold px-5 py-3 text-sm"
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

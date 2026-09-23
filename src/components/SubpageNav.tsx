import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

type BackLink = { backHref: string; backLabel: string };

const backLinkClass =
  "inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors duration-200";

/** Sticky top bar on the inner pages: a back link, and the page's name on the right. */
export function SubpageNav({ backHref, backLabel, label }: BackLink & { label: string }) {
  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/20 px-8 md:px-24 py-4 flex items-center justify-between">
      <Link href={backHref} className={backLinkClass}>
        <ArrowLeftIcon />
        {backLabel}
      </Link>
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hidden sm:block truncate max-w-xs">
        {label}
      </span>
    </nav>
  );
}

/** Bottom bar on the inner pages. "Top" scrolls the current page — it used to
 *  point at /#top on project pages, which navigated to the home page instead. */
export function SubpageFooter({ backHref, backLabel }: BackLink) {
  return (
    <div className="border-t border-outline-variant/15 px-8 md:px-24 py-8 flex items-center justify-between">
      <Link href={backHref} className={backLinkClass}>
        <ArrowLeftIcon />
        {backLabel}
      </Link>
      <a
        href="#"
        className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface-variant transition-colors duration-200"
      >
        ↑ Top
      </a>
    </div>
  );
}

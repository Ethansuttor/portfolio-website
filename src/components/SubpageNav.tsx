import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

type BackLink = { backHref: string; backLabel: string };

const backLinkClass =
  "btn-ghost group px-4 py-2 text-sm";

/** Sticky top bar on the inner pages: a back link, and the page's name on the right. */
export function SubpageNav({ backHref, backLabel, label }: BackLink & { label: string }) {
  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-outline-variant px-5 sm:px-8 lg:px-16 h-[68px] flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/" aria-label="Home" className="grid place-items-center w-9 h-9 shrink-0 rounded-[7px] bg-surface-container-highest border border-outline hover:border-primary transition-colors">
          <span className="display text-[0.8rem] tracking-tight text-primary">ES</span>
        </Link>
        <Link href={backHref} className={backLinkClass}>
          <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>
      </div>
      <span className="text-sm text-on-surface-variant hidden sm:block truncate max-w-sm">{label}</span>
    </nav>
  );
}

/** Bottom bar on the inner pages. "Top" scrolls the current page — it used to
 *  point at /#top on project pages, which navigated to the home page instead. */
export function SubpageFooter({ backHref, backLabel }: BackLink) {
  return (
    <div className="border-t border-outline-variant px-5 sm:px-8 lg:px-16 py-8 flex items-center justify-between">
      <Link href={backHref} className={backLinkClass}>
        <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        {backLabel}
      </Link>
      <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
        ↑ Top
      </a>
    </div>
  );
}

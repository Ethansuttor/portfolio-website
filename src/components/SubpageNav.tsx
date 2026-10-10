import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { EMAIL, RESUME_HREF } from "@/lib/site";

type BackProps = { backHref: string; backLabel: string };

const backLinkClass =
  "btn-ghost group px-4 py-2 text-sm";

/** Sticky top bar on the inner pages: a back link, and the résumé download on the
 *  right. `label` names the page for screen readers. */
export function SubpageNav({ backHref, backLabel, label }: BackProps & { label: string }) {
  return (
    <nav aria-label={label} className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-outline-variant px-5 sm:px-8 lg:px-16 h-[68px] flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/" aria-label="Home" className="grid place-items-center w-9 h-9 shrink-0 rounded-[7px] bg-surface-container-highest border border-outline hover:border-primary transition-colors">
          <span className="display text-[0.8rem] tracking-tight text-primary">ES</span>
        </Link>
        <BackLink fallbackHref={backHref} fallbackLabel={backLabel} className={backLinkClass} />
      </div>
      <a href={RESUME_HREF} download className="btn-gold px-5 py-2.5 text-sm">
        Résumé
        <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v8M2.5 5.5 6 9l3.5-3.5M1.5 11h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </nav>
  );
}

/** Bottom bar on the inner pages. "Top" scrolls the current page — it used to
 *  point at /#top on project pages, which navigated to the home page instead. */
export function SubpageFooter({ backHref, backLabel }: BackProps) {
  return (
    <div className="border-t border-outline-variant px-5 sm:px-8 lg:px-16 py-8 flex flex-wrap items-center justify-between gap-x-4">
      <BackLink fallbackHref={backHref} fallbackLabel={backLabel} prefix="Back to " className={backLinkClass} />
      <a href={`mailto:${EMAIL}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors py-3 inline-block">
        Email me
      </a>
      <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors py-3 inline-block">
        ↑ Top
      </a>
    </div>
  );
}

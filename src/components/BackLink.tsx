"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { labelForPath, previousPath, recordPath } from "@/lib/navHistory";

type Props = {
  /** Where to go when the visitor landed on this page directly. */
  fallbackHref: string;
  fallbackLabel: string;
  /** Put in front of the previous page's name, e.g. "Back to ". */
  prefix?: string;
  className: string;
};

/**
 * Goes back one step in history when the visitor got here from inside the
 * site, so Home → Build log → back lands on Home in one click and the browser
 * back button stays in sync. Otherwise it's a normal link to the fallback.
 */
export function BackLink({ fallbackHref, fallbackLabel, prefix = "", className }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [prev, setPrev] = useState<string | null>(null);

  useEffect(() => {
    // Child effects run before the layout's NavHistory, so record here too.
    recordPath(pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads module state that only exists after mount
    setPrev(previousPath(pathname));
  }, [pathname]);

  return (
    <Link
      href={prev ?? fallbackHref}
      className={className}
      onClick={(e) => {
        if (!prev || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        router.back();
      }}
    >
      <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      {prev ? `${prefix}${labelForPath(prev)}` : fallbackLabel}
    </Link>
  );
}

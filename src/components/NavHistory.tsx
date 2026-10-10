"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPath } from "@/lib/navHistory";

/** Records every route change, including pages without a back link (home). */
export function NavHistory() {
  const pathname = usePathname();
  useEffect(() => {
    recordPath(pathname);
  }, [pathname]);
  return null;
}

'use client';

import { useEffect } from 'react';

/**
 * Handles scrolling to the correct project on page load
 * when the URL contains a hash (e.g. /projects#fpga-hierarchical-alu).
 */
export function ProjectScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Small delay to let the page render before scrolling
    const timeout = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}

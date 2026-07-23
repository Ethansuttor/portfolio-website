'use client';

import { useEffect } from 'react';

/**
 * Cleans up stacked URL hashes (e.g. #slug1#slug2 → #slug2)
 * that can occur from nested hash-based navigation.
 * Scroll positioning is handled natively by the browser +
 * Next.js data-scroll-behavior + CSS scroll-padding-top.
 */
export function ProjectScrollHandler() {
  useEffect(() => {
    const fullHash = window.location.hash;
    if (!fullHash) return;

    const parts = fullHash.split('#').filter(Boolean);
    if (parts.length > 1) {
      const targetSlug = parts[parts.length - 1];
      window.history.replaceState(null, '', `${window.location.pathname}#${targetSlug}`);

      // After cleaning the hash, scroll to the correct element
      const el = document.getElementById(targetSlug);
      if (el) {
        el.scrollIntoView({ block: 'start' });
      }
    }
  }, []);

  return null;
}

/**
 * The in-site pages visited in this tab, so the inner pages' back links can go
 * back to wherever the visitor actually came from instead of a fixed parent.
 *
 * Kept in module state rather than sessionStorage on purpose: it resets on a
 * full load, which is exactly when the browser has no in-site page to go back
 * to (and browsers copy sessionStorage into tabs opened from a link, which
 * would make a fresh tab think it had history). Only client effects write it,
 * so the server's copy stays empty and the first render always matches.
 */

const stack: string[] = [];

/** Record a route change. Safe to call more than once for the same route. */
export function recordPath(pathname: string) {
  const last = stack[stack.length - 1];
  if (last === pathname) return;
  if (stack[stack.length - 2] === pathname) {
    // Back to the page before: a browser back or one of our back links.
    stack.pop();
  } else {
    stack.push(pathname);
    if (stack.length > 50) stack.shift();
  }
}

/** The in-site page before `pathname`, or null if it was the first one loaded. */
export function previousPath(pathname: string): string | null {
  return stack[stack.length - 1] === pathname ? stack[stack.length - 2] ?? null : null;
}

/** What the back link calls a page. */
export function labelForPath(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname === "/projects") return "All Projects";
  if (pathname.startsWith("/projects/")) return "The Project";
  if (pathname.startsWith("/blog/")) return "Build Log";
  return "Back";
}

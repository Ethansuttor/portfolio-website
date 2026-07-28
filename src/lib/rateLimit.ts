/**
 * Minimal fixed-window rate limiter.
 *
 * State lives in the module scope of a single serverless instance, so this is
 * best-effort, not a guarantee: Vercel may run several instances concurrently,
 * and each keeps its own counters. It reliably stops a single client hammering
 * the form in a loop — which is the realistic abuse case for a portfolio — but
 * a distributed flood would get through. Move to Vercel KV / Upstash Redis if
 * this ever needs to be authoritative.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Drop expired entries so the Map can't grow without bound on a warm instance. */
function evictExpired(now: number) {
  for (const [key, win] of windows) {
    if (win.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets. Only meaningful when `allowed` is false. */
  retryAfter: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Cheap amortised cleanup rather than a timer, which a serverless instance
  // could be frozen partway through.
  if (windows.size > 500) evictExpired(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

/**
 * Best available client identifier. Vercel sets `x-forwarded-for`, and only the
 * leftmost entry is meaningful — the rest are attacker-controllable. Falls back
 * to a shared bucket so a missing header fails closed into throttling rather
 * than opening the door.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip")?.trim() || "unknown";
}

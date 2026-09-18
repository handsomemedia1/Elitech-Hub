/**
 * In-memory rate limiter for Next.js Route Handlers
 * Mirrors the old Express backend's express-rate-limit config
 * For production, swap the store for Upstash Redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment rate limit for a given key (usually IP)
 * @param key      Unique identifier (IP address)
 * @param max      Max requests per window
 * @param windowMs Window in milliseconds
 */
export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    // Fresh window
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: max - 1, resetAt: entry.resetAt };
  }

  existing.count++;
  const remaining = Math.max(0, max - existing.count);
  return {
    allowed: existing.count <= max,
    remaining,
    resetAt: existing.resetAt,
  };
}

/** Helper: get caller's IP from a Next.js Request */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// ─── Pre-configured limiters matching old backend ─────────────────────────

/** General API: 100 req / 15 min */
export function generalLimit(ip: string) {
  return rateLimit(ip, 100, 15 * 60 * 1000);
}

/** Auth endpoints: 5 req / 15 min */
export function authLimit(ip: string) {
  return rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
}

/** Form submissions (contact/apply/volunteer): 10 req / 15 min */
export function formLimit(ip: string) {
  return rateLimit(`form:${ip}`, 10, 15 * 60 * 1000);
}

/** Newsletter: 3 req / 1 hour */
export function newsletterLimit(ip: string) {
  return rateLimit(`nl:${ip}`, 3, 60 * 60 * 1000);
}

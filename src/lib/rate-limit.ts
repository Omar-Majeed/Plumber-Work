import "server-only";

/**
 * Minimal in-process rate-limit hook.
 *
 * Adequate for a single-instance demo only. Before launch, swap the store for
 * a shared one (Upstash, Redis, Vercel KV) so the limit holds across
 * instances — the call site in the enquiry action does not need to change.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { allowed: boolean } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  entry.count += 1;
  return { allowed: entry.count <= MAX_REQUESTS };
}

import "server-only";

/**
 * Prosty limiter w pamięci procesu (okno przesuwne). Wystarcza w wersji demo;
 * w produkcji z wieloma instancjami użyj wspólnego magazynu (np. Redis) lub limitów na poziomie CDN.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
  return { allowed: true, retryAfter: 0 };
}

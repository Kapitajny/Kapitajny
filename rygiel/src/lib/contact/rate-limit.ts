/**
 * Limit żądań w pamięci procesu (okno przesuwne). Działa w obrębie jednej instancji serwera –
 * przy wielu instancjach lub w środowisku serverless należy zastąpić go magazynem współdzielonym (np. Redis).
 */
export type RateLimiter = { check: (key: string, now?: number) => { allowed: boolean; retryAfterMs: number } };

export function createRateLimiter({ limit, windowMs, maxKeys = 5_000 }: { limit: number; windowMs: number; maxKeys?: number }): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterMs: windowMs - (now - recent[0]!) };
      }
      recent.push(now);
      hits.delete(key);
      hits.set(key, recent);
      // Ograniczenie pamięci: usuwamy najdawniej używane klucze.
      while (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest === undefined) break;
        hits.delete(oldest);
      }
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}

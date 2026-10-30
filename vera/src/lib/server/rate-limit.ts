import "server-only";

const hits = new Map<string, number[]>();

/** Sliding-window limit kept in process memory – enough for a single server; use a shared store for several. */
export function allow(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const ok = recent.length < limit;
  if (ok) recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return ok;
}

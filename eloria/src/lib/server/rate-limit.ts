import "server-only";

const buckets = new Map<string, number[]>();

/**
 * Prosty limit prób w pamięci procesu (okno przesuwne).
 * Wystarcza na pojedynczy serwer; przy wielu instancjach zastąp go magazynem współdzielonym (np. Redis).
 */
export function allowRequest(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5_000) {
    for (const [k, times] of buckets) if (!times.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

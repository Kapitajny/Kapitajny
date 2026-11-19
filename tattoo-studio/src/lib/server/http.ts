import "server-only";

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

/** Odpowiedź błędu w jednolitym formacie: `{ error: { code, message, fieldErrors? } }`. */
export function errorResponse(status: number, error: ApiError): Response {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

const buckets = new Map<string, number[]>();

/**
 * Prosty limit żądań w pamięci procesu (na adres IP). Chroni przed przypadkowym spamem;
 * przy wielu instancjach serwera zastąp go rozwiązaniem współdzielonym (np. Redis / Upstash).
 */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return true;
}

export function resetRateLimits(): void {
  buckets.clear();
}

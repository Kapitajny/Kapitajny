import "server-only";

/** Odpowiedź błędu w jednolitym formacie: `{ error: { code, message, field? } }`. */
export function errorResponse(status: number, code: string, message: string, field?: string): Response {
  return Response.json({ error: { code, message, ...(field ? { field } : {}) } }, { status });
}

/** Czyta JSON z limitem rozmiaru. Zwraca `undefined`, gdy treść jest nieprawidłowa. */
export async function readJson(request: Request, maxBytes = 32_000): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json")) return undefined;
  const text = await request.text();
  if (text.length > maxBytes) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

const buckets = new Map<string, number[]>();

/**
 * Prosty limit żądań w pamięci procesu (na adres IP). Chroni przed przypadkowym spamem;
 * przy wielu instancjach serwera zastąp go rozwiązaniem współdzielonym (np. Redis).
 */
export function rateLimit(request: Request, scope: string, limit: number, windowMs: number): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
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

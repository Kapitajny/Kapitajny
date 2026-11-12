import { getAvailability, getOpenDays } from "@/lib/server/bookings";
import { errorResponse, rateLimit } from "@/lib/server/http";
import { isDuration } from "@/lib/rental";
import { isDate } from "@/lib/time";

/**
 * GET /api/availability?jetski=ID&duration=60&date=YYYY-MM-DD  → godziny startu w danym dniu
 * GET /api/availability?jetski=ID&duration=60&from=YYYY-MM-DD&days=42 → dni z wolnymi terminami
 */
export async function GET(request: Request) {
  if (!rateLimit(request, "availability", 120, 60_000)) return errorResponse(429, "rate-limit", "Za dużo zapytań. Spróbuj za chwilę.");
  const url = new URL(request.url);
  const jetski = url.searchParams.get("jetski") ?? "";
  const duration = Number(url.searchParams.get("duration"));
  const date = url.searchParams.get("date");
  const from = url.searchParams.get("from");

  if (from) {
    const days = Math.min(62, Math.max(1, Number(url.searchParams.get("days")) || 42));
    if (!isDate(from) || !isDuration(duration)) return errorResponse(400, "invalid", "Nieprawidłowe parametry.");
    return Response.json({ days: getOpenDays(jetski, from, days, duration) }, { headers: { "Cache-Control": "no-store" } });
  }

  const result = getAvailability(jetski, date ?? "", duration);
  if (!result.ok) return errorResponse(result.code === "not-found" ? 404 : 400, result.code, result.code === "not-found" ? "Nie znaleziono skutera." : "Nieprawidłowe parametry.");
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}

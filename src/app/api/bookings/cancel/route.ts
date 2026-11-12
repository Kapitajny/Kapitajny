import { cancelByCustomer } from "@/lib/server/bookings";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { sameOrigin } from "@/lib/server/auth";

const MESSAGES = {
  "not-found": "Nie znaleziono rezerwacji. Sprawdź link z potwierdzenia.",
  "too-late": "Termin bezpłatnego anulowania minął. Zadzwoń do nas, a pomożemy.",
  "not-active": "Ta rezerwacja jest już anulowana lub zakończona.",
} as const;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse(403, "forbidden", "Żądanie zostało odrzucone.");
  if (!rateLimit(request, "cancel", 10, 10 * 60_000)) return errorResponse(429, "rate-limit", "Za dużo prób. Spróbuj za kilka minut.");
  const body = (await readJson(request)) as { number?: unknown; token?: unknown } | undefined;
  if (typeof body?.number !== "string" || typeof body.token !== "string") return errorResponse(400, "invalid", "Nieprawidłowe dane.");
  const result = cancelByCustomer(body.number, body.token);
  if (!result.ok) return errorResponse(result.code === "not-found" ? 404 : 409, result.code, MESSAGES[result.code]);
  return Response.json({ ok: true });
}

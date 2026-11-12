import { createBooking, type BookingRequest } from "@/lib/server/bookings";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { sameOrigin } from "@/lib/server/auth";

/** POST /api/bookings – wstępna rezerwacja. Dostępność jest sprawdzana ponownie w transakcji zapisu. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse(403, "forbidden", "Żądanie zostało odrzucone.");
  if (!rateLimit(request, "bookings", 8, 10 * 60_000)) return errorResponse(429, "rate-limit", "Za dużo prób rezerwacji. Spróbuj za kilka minut lub zadzwoń.");
  const body = await readJson(request);
  if (!body || typeof body !== "object") return errorResponse(400, "invalid", "Nieprawidłowe dane formularza.");
  const result = createBooking(body as BookingRequest);
  if (!result.ok) return Response.json({ error: { code: result.code, message: result.message, fields: result.errors } }, { status: result.status });
  return Response.json({ booking: result.booking }, { status: result.replayed ? 200 : 201 });
}

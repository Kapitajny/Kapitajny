import { validateBooking } from "@/lib/booking/validation";
import { createBooking } from "@/lib/server/bookings";
import { clientIp, isSameOrigin, json, rateLimit, readJson } from "@/lib/server/security";

/** Minimalny czas wypełniania formularza – prosta ochrona przed botami (razem z polem-pułapką). */
const MIN_FILL_MS = 3000;

/** POST /api/bookings – nowa rezerwacja. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!rateLimit(`book:${clientIp(req)}`, 6, 10 * 60_000)) return json({ error: "rate_limited" }, 429);

  const body = await readJson(req);
  if (!body) return json({ error: "invalid_body" }, 400);

  // Bot: wypełnione ukryte pole albo formularz wysłany natychmiast. Odpowiadamy neutralnie.
  const startedAt = Number(body.startedAt);
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json({ error: "rejected" }, 400);
  }

  const parsed = validateBooking(body);
  if (!parsed.ok) return json({ error: "validation", fields: parsed.errors }, 422);

  try {
    const result = await createBooking(parsed.value);
    if (!result.ok) return json({ error: "slot_unavailable" }, 409);
    const b = result.booking;
    return json({ ok: true, booking: { id: b.id, status: b.status, startsAt: b.startsAt, endsAt: b.endsAt }, manageToken: result.manageToken }, 201);
  } catch (error) {
    console.error("[bookings] create failed", error);
    return json({ error: "server" }, 500);
  }
}

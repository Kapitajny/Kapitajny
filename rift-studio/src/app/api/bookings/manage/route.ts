import { isDateString, isTimeString } from "@/lib/booking/time";
import { cancelByToken, rescheduleByToken } from "@/lib/server/bookings";
import { clientIp, isSameOrigin, isTokenShape, json, rateLimit, readJson } from "@/lib/server/security";

/** POST /api/bookings/manage – { token, action: "cancel" } albo { token, action: "reschedule", date, time } */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!rateLimit(`manage:${clientIp(req)}`, 20, 10 * 60_000)) return json({ error: "rate_limited" }, 429);

  const body = await readJson(req);
  if (!body || !isTokenShape(body.token)) return json({ error: "not_found" }, 404);

  try {
    let result;
    if (body.action === "cancel") result = await cancelByToken(body.token);
    else if (body.action === "reschedule" && isDateString(body.date) && isTimeString(body.time)) result = await rescheduleByToken(body.token, body.date, body.time);
    else return json({ error: "invalid_action" }, 400);

    if (!result.ok) return json({ error: result.reason }, result.reason === "not_found" ? 404 : 409);
    const b = result.booking;
    return json({ ok: true, booking: { status: b.status, startsAt: b.startsAt, endsAt: b.endsAt } });
  } catch (error) {
    console.error("[bookings/manage]", error);
    return json({ error: "server" }, 500);
  }
}

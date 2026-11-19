import { getService, isServiceId } from "@/data/services";
import { BOOKING_RULES } from "@/lib/booking/rules";
import { isDateString, utcToZoned } from "@/lib/booking/time";
import { findByToken, getAvailability } from "@/lib/server/bookings";
import { clientIp, json, rateLimit } from "@/lib/server/security";

/**
 * GET /api/availability?service=vocal&duration=120&from=2026-11-20&days=35
 * Opcjonalny nagłówek `x-manage-token` – przy zmianie terminu pomija własną rezerwację.
 */
export async function GET(req: Request) {
  if (!rateLimit(`avail:${clientIp(req)}`, 120, 60_000)) return json({ error: "rate_limited" }, 429);

  const q = new URL(req.url).searchParams;
  const service = q.get("service");
  if (!isServiceId(service)) return json({ error: "invalid_service" }, 400);
  const duration = Number(q.get("duration") ?? getService(service).defaultDuration);
  if (!getService(service).durations.includes(duration)) return json({ error: "invalid_duration" }, 400);
  const from = q.get("from") ?? utcToZoned(new Date()).date;
  if (!isDateString(from)) return json({ error: "invalid_from" }, 400);
  const days = Math.min(Math.max(Number(q.get("days") ?? 35) || 35, 1), BOOKING_RULES.horizonDays + 1);

  let excludeBookingId: string | undefined;
  const token = req.headers.get("x-manage-token");
  if (token) excludeBookingId = (await findByToken(token))?.id;

  try {
    const result = await getAvailability(service, duration, from, days, { excludeBookingId });
    return json({ timeZone: BOOKING_RULES.timeZone, days: result });
  } catch (error) {
    console.error("[availability]", error);
    return json({ error: "unavailable" }, 503);
  }
}

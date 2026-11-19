import { getNextFreeSlot } from "@/lib/server/bookings";
import { clientIp, json, rateLimit } from "@/lib/server/security";

/** GET /api/availability/next – najbliższy wolny termin sesji wokalnej (dla Hero). */
export async function GET(req: Request) {
  if (!rateLimit(`next:${clientIp(req)}`, 60, 60_000)) return json({ error: "rate_limited" }, 429);
  try {
    return json({ slot: await getNextFreeSlot("vocal") });
  } catch (error) {
    console.error("[availability/next]", error);
    return json({ error: "unavailable" }, 503);
  }
}

import { requireAdmin } from "@/lib/server/auth";
import { listBookings } from "@/lib/server/bookings";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const p = new URL(request.url).searchParams;
  const num = (k: string) => (p.get(k) && Number.isFinite(Number(p.get(k))) ? Number(p.get(k)) : undefined);
  return Response.json({
    bookings: listBookings({ from: num("from"), to: num("to"), status: p.get("status") ?? undefined, query: p.get("q") ?? undefined, customerId: p.get("customer") ?? undefined }),
  });
}

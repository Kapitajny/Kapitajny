import { getPaymentsMode, isDemoOrdersEnabled } from "@/lib/server/env";

/**
 * GET /api/checkout/config
 * Które sposoby płatności są dostępne: Stripe (test/live/nieskonfigurowany) i zamówienie demonstracyjne.
 */
export async function GET() {
  return Response.json({ payments: getPaymentsMode(), demoOrders: isDemoOrdersEnabled() }, { headers: { "Cache-Control": "no-store" } });
}

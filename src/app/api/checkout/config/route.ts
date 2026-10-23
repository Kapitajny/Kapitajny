import { connection } from "next/server";
import { getPaymentsMode, isDemoOrdersEnabled } from "@/lib/server/env";

/**
 * GET /api/checkout/config
 * Które sposoby płatności są dostępne: Stripe (test/live/nieskonfigurowany) i zamówienie demonstracyjne.
 */
export async function GET() {
  // Konfiguracja czytana przy każdym żądaniu – nie z czasu budowania.
  await connection();
  return Response.json({ payments: getPaymentsMode(), demoOrders: isDemoOrdersEnabled() }, { headers: { "Cache-Control": "no-store" } });
}

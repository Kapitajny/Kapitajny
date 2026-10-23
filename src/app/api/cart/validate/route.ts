import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { availableStock } from "@/lib/server/inventory";
import { priceLine } from "@/lib/pricing";

/**
 * POST /api/cart/validate  { items: [{ productId, color, size, quantity }] }
 * Sprawdza każdą pozycję koszyka osobno: czy produkt istnieje, aktualną cenę i dostępność.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "cart-validate", 120, 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele zapytań. Odczekaj chwilę.");
  const body = (await readJson(request, 8_000)) as { items?: unknown } | undefined;
  if (!body || !Array.isArray(body.items) || body.items.length > 30) return errorResponse(400, "INVALID_BODY", "Nieprawidłowa zawartość koszyka.");

  const priced = body.items.map((item) => priceLine(item));
  const stock = availableStock(priced.flatMap((p) => (p.ok ? [p.line.sku] : [])));
  const lines = priced.map((p) =>
    p.ok
      ? { ok: true as const, sku: p.line.sku, unitPrice: p.line.unitPrice, available: stock.get(p.line.sku) ?? 0 }
      : { ok: false as const, error: p.error },
  );
  return Response.json({ lines }, { headers: { "Cache-Control": "no-store" } });
}

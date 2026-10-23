import { errorResponse, rateLimit } from "@/lib/server/http";
import { products } from "@/data/catalog";
import { productAvailability } from "@/lib/server/inventory";

/**
 * GET /api/stock?product=B01 – dostępność wariantów jednego produktu,
 * GET /api/stock – wszystkich produktów (dla list i filtrów).
 * Stan po odjęciu sprzedaży i aktywnych rezerwacji.
 */
export async function GET(request: Request) {
  if (!rateLimit(request, "stock", 240, 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele zapytań. Odczekaj chwilę.");
  const productId = new URL(request.url).searchParams.get("product");
  if (productId === null) {
    const all = Object.fromEntries(products.map((p) => [p.id, productAvailability(p.id)]));
    return Response.json({ products: all }, { headers: { "Cache-Control": "no-store" } });
  }
  if (!/^[A-Z]\d{2}$/.test(productId)) return errorResponse(400, "INVALID_QUERY", "Nieprawidłowy identyfikator produktu.");
  const availability = productAvailability(productId);
  if (!availability) return errorResponse(404, "NOT_FOUND", "Nie znaleźliśmy takiego produktu.");
  return Response.json({ productId, availability }, { headers: { "Cache-Control": "no-store" } });
}

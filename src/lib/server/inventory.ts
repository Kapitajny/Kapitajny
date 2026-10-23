import "server-only";

import { SIZES, type Size } from "@/data/catalog";
import { catalogStock, getProductById, skuOf } from "@/lib/catalog";
import type { PricedLine } from "@/lib/pricing";
import { getDb } from "./db";

/**
 * Stan magazynowy = stan początkowy z katalogu − sprzedane (opłacone zamówienia) − aktywne rezerwacje.
 * Rezerwacja to nieopłacone zamówienie z płatnością online, którego sesja płatności jeszcze nie wygasła.
 */

/** Zamówienie bez sesji płatności (np. błąd operatora) rezerwuje towar najwyżej tyle czasu. */
const RESERVATION_FALLBACK_MS = 35 * 60 * 1000;

function parseSku(sku: string): { productId: string; color: string; size: Size } | null {
  const [productId, ...rest] = sku.split("-");
  const size = rest.pop();
  const color = rest.join("-");
  if (!productId || !color || !size || !(SIZES as readonly string[]).includes(size)) return null;
  return { productId, color, size: size as Size };
}

function soldBySku(): Map<string, number> {
  const rows = getDb().prepare("SELECT sku, sold FROM inventory_sold").all() as { sku: string; sold: number }[];
  return new Map(rows.map((r) => [r.sku, Number(r.sold)]));
}

function reservedBySku(excludeOrderId?: string): Map<string, number> {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const fallbackSince = new Date(Date.now() - RESERVATION_FALLBACK_MS).toISOString();
  const rows = getDb()
    .prepare(
      `SELECT id, items_json FROM orders
       WHERE status = 'pending' AND payment_method = 'stripe' AND stock_committed = 0
         AND ((stripe_session_expires_at IS NOT NULL AND stripe_session_expires_at > ?)
           OR (stripe_session_expires_at IS NULL AND created_at > ?))`,
    )
    .all(nowSeconds, fallbackSince) as { id: string; items_json: string }[];
  const reserved = new Map<string, number>();
  for (const row of rows) {
    if (row.id === excludeOrderId) continue;
    for (const line of JSON.parse(row.items_json) as PricedLine[]) {
      reserved.set(line.sku, (reserved.get(line.sku) ?? 0) + line.quantity);
    }
  }
  return reserved;
}

/** Dostępna liczba sztuk dla podanych wariantów (SKU). Nieznane SKU → 0. */
export function availableStock(skus: string[], options: { excludeOrderId?: string } = {}): Map<string, number> {
  const sold = soldBySku();
  const reserved = reservedBySku(options.excludeOrderId);
  const result = new Map<string, number>();
  for (const sku of skus) {
    const parsed = parseSku(sku);
    const product = parsed ? getProductById(parsed.productId) : null;
    const initial = product && parsed ? catalogStock(product, parsed.color, parsed.size) : 0;
    result.set(sku, Math.max(0, initial - (sold.get(sku) ?? 0) - (reserved.get(sku) ?? 0)));
  }
  return result;
}

/** Dostępność wszystkich wariantów produktu: { [kolor]: { [rozmiar]: liczba } }. */
export function productAvailability(productId: string): Record<string, Record<Size, number>> | null {
  const product = getProductById(productId);
  if (!product) return null;
  const skus = product.variants.flatMap((v) => SIZES.map((size) => skuOf(product.id, v.color, size)));
  const stock = availableStock(skus);
  return Object.fromEntries(
    product.variants.map((v) => [v.color, Object.fromEntries(SIZES.map((size) => [size, stock.get(skuOf(product.id, v.color, size)) ?? 0])) as Record<Size, number>]),
  );
}

export interface StockProblem {
  sku: string;
  name: string;
  requested: number;
  available: number;
}

/** Sprawdza, czy wszystkie pozycje są dostępne w żądanej ilości. */
export function findStockProblems(lines: PricedLine[], options: { excludeOrderId?: string } = {}): StockProblem[] {
  const stock = availableStock(
    lines.map((l) => l.sku),
    options,
  );
  return lines
    .filter((l) => (stock.get(l.sku) ?? 0) < l.quantity)
    .map((l) => ({ sku: l.sku, name: `${l.name} (${l.colorName}, ${l.size})`, requested: l.quantity, available: stock.get(l.sku) ?? 0 }));
}

export function describeStockProblems(problems: StockProblem[]): string {
  return problems
    .map((p) => (p.available === 0 ? `${p.name} jest niedostępny.` : `${p.name}: dostępne ${p.available} szt., w koszyku ${p.requested}.`))
    .join(" ");
}

/** Zapisuje sprzedaż (wywoływane w transakcji oznaczającej zamówienie jako opłacone). */
export function commitSale(lines: PricedLine[]): void {
  const statement = getDb().prepare("INSERT INTO inventory_sold (sku, sold) VALUES (?, ?) ON CONFLICT(sku) DO UPDATE SET sold = sold + excluded.sold");
  for (const line of lines) statement.run(line.sku, line.quantity);
}

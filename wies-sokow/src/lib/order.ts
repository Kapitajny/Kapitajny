import { getProduct, type Product } from "@/data/products";

/* Warunki dostawy i płatności są przykładowe (projekt demonstracyjny). */

export type CartLine = { slug: string; qty: number };
export type ResolvedLine = { product: Product; qty: number; total: number };

export const MAX_QTY = 20;
export const FREE_SHIPPING_FROM = 15000;

export type ShippingId = "kurier" | "odbior";
export type PaymentId = "przelew" | "pobranie";

export const shippingMethods: { id: ShippingId; label: string; note: string; price: number }[] = [
  { id: "kurier", label: "Kurier", note: "Dostawa pod wskazany adres", price: 1500 },
  { id: "odbior", label: "Odbiór osobisty", note: "W gospodarstwie w Grójcu, po wcześniejszym umówieniu", price: 0 },
];

export const paymentMethods: { id: PaymentId; label: string; note: string }[] = [
  { id: "przelew", label: "Przelew tradycyjny", note: "Dane do przelewu otrzymasz w potwierdzeniu zamówienia" },
  { id: "pobranie", label: "Płatność przy odbiorze", note: "Gotówką kurierowi lub na miejscu" },
];

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.trunc(qty)));
}

/** Odrzuca nieznane produkty, scala duplikaty i pilnuje zakresu ilości. */
export function sanitizeLines(input: unknown): CartLine[] {
  if (!Array.isArray(input)) return [];
  const merged = new Map<string, number>();
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const { slug, qty } = item as { slug?: unknown; qty?: unknown };
    if (typeof slug !== "string" || typeof qty !== "number" || !getProduct(slug) || qty < 1) continue;
    merged.set(slug, clampQty((merged.get(slug) ?? 0) + qty));
  }
  return [...merged].map(([slug, qty]) => ({ slug, qty }));
}

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ product, qty: line.qty, total: product.price * line.qty }] : [];
  });
}

export function countItems(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function subtotal(lines: CartLine[]): number {
  return resolveLines(lines).reduce((sum, line) => sum + line.total, 0);
}

export function shippingCost(method: ShippingId, subtotalGrosze: number): number {
  const found = shippingMethods.find((item) => item.id === method);
  if (!found || found.price === 0) return 0;
  return subtotalGrosze >= FREE_SHIPPING_FROM ? 0 : found.price;
}

export function orderTotal(lines: CartLine[], method: ShippingId): { subtotal: number; shipping: number; total: number } {
  const sub = subtotal(lines);
  const shipping = sub === 0 ? 0 : shippingCost(method, sub);
  return { subtotal: sub, shipping, total: sub + shipping };
}

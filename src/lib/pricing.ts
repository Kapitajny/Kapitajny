/**
 * Wycena koszyka – wspólna dla przeglądarki (podgląd) i serwera (kwota płatności).
 * Ceny pochodzą wyłącznie z katalogu; klient przesyła tylko produkt, kolor, rozmiar i ilość.
 */
import { colorName, getProductById, getVariant, imageSrc, isSize, skuOf } from "./catalog";
import { getShippingMethod, type ShippingMethod } from "@/data/shipping";
import type { ColorId, Size } from "@/data/catalog";

export const ORDER_LIMITS = {
  maxQuantityPerLine: 5,
  maxItemsPerOrder: 20,
  maxLinesPerOrder: 15,
} as const;

export interface CartLineInput {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

export interface PricedLine {
  sku: string;
  productId: string;
  slug: string;
  name: string;
  color: ColorId;
  colorName: string;
  size: Size;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
}

export type PriceResult =
  | { ok: true; lines: PricedLine[]; itemCount: number; subtotal: number }
  | { ok: false; error: string; sku?: string };

export function priceLine(input: unknown): { ok: true; line: PricedLine } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Nieprawidłowa pozycja koszyka." };
  const { productId, color, size, quantity } = input as Record<string, unknown>;
  const product = typeof productId === "string" ? getProductById(productId) : null;
  if (!product) return { ok: false, error: "Jeden z produktów nie jest już dostępny w sklepie. Usuń go z koszyka." };
  const variant = typeof color === "string" ? getVariant(product, color) : null;
  if (!variant) return { ok: false, error: `Wybrany kolor produktu ${product.name} nie jest już dostępny.` };
  if (!isSize(size)) return { ok: false, error: `Wybierz rozmiar produktu ${product.name}.` };
  if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: `Nieprawidłowa ilość produktu ${product.name}.` };
  }
  if (quantity > ORDER_LIMITS.maxQuantityPerLine) {
    return { ok: false, error: `Maksymalnie ${ORDER_LIMITS.maxQuantityPerLine} sztuk jednego wariantu w zamówieniu.` };
  }
  return {
    ok: true,
    line: {
      sku: skuOf(product.id, variant.color, size),
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: variant.color,
      colorName: colorName(variant.color),
      size,
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
      image: imageSrc(variant.image),
    },
  };
}

export function priceCart(items: unknown): PriceResult {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "Koszyk jest pusty." };
  if (items.length > ORDER_LIMITS.maxLinesPerOrder) {
    return { ok: false, error: `Zamówienie może mieć maksymalnie ${ORDER_LIMITS.maxLinesPerOrder} różnych pozycji.` };
  }
  const lines: PricedLine[] = [];
  for (const item of items) {
    const result = priceLine(item);
    if (!result.ok) return result;
    if (lines.some((l) => l.sku === result.line.sku)) return { ok: false, error: "Ten sam wariant występuje w koszyku dwa razy.", sku: result.line.sku };
    lines.push(result.line);
  }
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  if (itemCount > ORDER_LIMITS.maxItemsPerOrder) {
    return { ok: false, error: `Jedno zamówienie może zawierać maksymalnie ${ORDER_LIMITS.maxItemsPerOrder} sztuk.` };
  }
  return { ok: true, lines, itemCount, subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0) };
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  total: number;
}

export function orderTotals(subtotal: number, method: ShippingMethod | null): OrderTotals {
  const shipping = method ? method.price : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

export { getShippingMethod };

const pln = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const plnWhole = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });

/** 28900 → „289,00 zł”; z `compact` pełne złote bez groszy: „289 zł”. */
export function formatPrice(grosze: number, options: { compact?: boolean } = {}): string {
  if (options.compact && grosze % 100 === 0) return plnWhole.format(grosze / 100);
  return pln.format(grosze / 100);
}

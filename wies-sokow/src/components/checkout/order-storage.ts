import type { CartLine, PaymentId, ShippingId } from "@/lib/order";

/** Zamówienie demonstracyjne – zapisywane wyłącznie w sessionStorage przeglądarki. */
export type DemoOrder = {
  number: string;
  lines: CartLine[];
  shipping: ShippingId;
  payment: PaymentId;
  subtotal: number;
  shippingCost: number;
  total: number;
  firstName: string;
  city: string;
};

/** Numer wyłącznie poglądowy – prawdziwy sklep nadaje go po stronie serwera. */
export function createOrderNumber(): string {
  return `WS-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const ORDER_KEY = "wies-sokow:zamowienie-demo:v1";

export function saveOrder(order: DemoOrder) {
  try {
    window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    // Brak dostępu do sessionStorage – strona potwierdzenia pokaże komunikat o braku zamówienia.
  }
}

let cachedRaw: string | null | undefined;
let cachedOrder: DemoOrder | null = null;

/** Stabilna referencja dla useSyncExternalStore. */
export function readOrder(): DemoOrder | null {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(ORDER_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedOrder;
  cachedRaw = raw;
  try {
    cachedOrder = raw ? (JSON.parse(raw) as DemoOrder) : null;
  } catch {
    cachedOrder = null;
  }
  return cachedOrder;
}

import "server-only";

import { createHash, randomInt, randomUUID } from "node:crypto";
import type { PricedLine } from "@/lib/pricing";
import type { PaymentChoice, ShippingAddress, ValidCheckout } from "@/lib/validation";
import { getDb, transaction } from "./db";
import { commitSale, describeStockProblems, findStockProblems } from "./inventory";

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed" | "demo";

export interface OrderRecord {
  id: string;
  number: string;
  idempotencyKey: string;
  payloadHash: string;
  status: OrderStatus;
  paymentMethod: PaymentChoice;
  userId: string | null;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: ShippingAddress;
  shippingMethod: string;
  pickupPoint: string | null;
  notes: string | null;
  items: PricedLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  stockCommitted: boolean;
  stripeSessionId: string | null;
  stripeSessionUrl: string | null;
  stripeSessionExpiresAt: number | null;
  stripePaymentIntentId: string | null;
  statusNote: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

type Row = Record<string, string | number | null>;

function toRecord(row: Row): OrderRecord {
  return {
    id: row.id as string,
    number: row.number as string,
    idempotencyKey: row.idempotency_key as string,
    payloadHash: row.payload_hash as string,
    status: row.status as OrderStatus,
    paymentMethod: row.payment_method as PaymentChoice,
    userId: (row.user_id as string) ?? null,
    customer: {
      firstName: row.customer_first_name as string,
      lastName: row.customer_last_name as string,
      email: row.customer_email as string,
      phone: row.customer_phone as string,
    },
    address: JSON.parse(row.address_json as string) as ShippingAddress,
    shippingMethod: row.shipping_method as string,
    pickupPoint: (row.pickup_point as string) ?? null,
    notes: (row.notes as string) ?? null,
    items: JSON.parse(row.items_json as string) as PricedLine[],
    subtotal: Number(row.subtotal_amount),
    shippingCost: Number(row.shipping_amount),
    total: Number(row.total_amount),
    currency: row.currency as string,
    stockCommitted: Number(row.stock_committed) === 1,
    stripeSessionId: (row.stripe_session_id as string) ?? null,
    stripeSessionUrl: (row.stripe_session_url as string) ?? null,
    stripeSessionExpiresAt: row.stripe_session_expires_at === null ? null : Number(row.stripe_session_expires_at),
    stripePaymentIntentId: (row.stripe_payment_intent_id as string) ?? null,
    statusNote: (row.status_note as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    paidAt: (row.paid_at as string) ?? null,
  };
}

/** Odcisk treści zamówienia – ten sam klucz idempotencji musi oznaczać tę samą treść. */
export function hashCheckout(value: ValidCheckout): string {
  const canonical = JSON.stringify({
    lines: value.lines.map((l) => [l.sku, l.quantity, l.unitPrice]),
    totals: [value.subtotal, value.shippingCost, value.total],
    customer: value.customer,
    address: value.address,
    shipping: [value.shipping.method.id, value.shipping.pickupPoint],
    notes: value.notes,
    payment: value.payment,
  });
  return createHash("sha256").update(canonical).digest("hex");
}

const NUMBER_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateOrderNumber(demo: boolean): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += NUMBER_ALPHABET[randomInt(NUMBER_ALPHABET.length)];
  return `${demo ? "DEMO" : "KP"}-${suffix}`;
}

function select(where: string, value: string): OrderRecord | null {
  const row = getDb().prepare(`SELECT * FROM orders WHERE ${where} = ?`).get(value) as Row | undefined;
  return row ? toRecord(row) : null;
}

export const findOrderById = (id: string) => select("id", id);
export const findOrderByIdempotencyKey = (key: string) => select("idempotency_key", key);
export const findOrderBySessionId = (sessionId: string) => select("stripe_session_id", sessionId);

export function listOrdersForUser(userId: string, limit = 50): OrderRecord[] {
  const rows = getDb().prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?").all(userId, limit) as Row[];
  return rows.map(toRecord);
}

export class OutOfStockError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type CreateOrderResult = { created: boolean; order: OrderRecord };

/**
 * Tworzy zamówienie albo zwraca istniejące o tym samym kluczu idempotencji
 * (ochrona przed podwójnym kliknięciem, odświeżeniem i ponowieniem żądania).
 * Dostępność towaru jest sprawdzana w tej samej transakcji, w której powstaje rezerwacja.
 */
export function createOrder(value: ValidCheckout, userId: string | null): CreateOrderResult {
  const payloadHash = hashCheckout(value);
  return transaction((db) => {
    const existing = db.prepare("SELECT * FROM orders WHERE idempotency_key = ?").get(value.idempotencyKey) as Row | undefined;
    if (existing) return { created: false, order: toRecord(existing) };

    const problems = findStockProblems(value.lines);
    if (problems.length) throw new OutOfStockError(describeStockProblems(problems));

    const demo = value.payment === "demo";
    const now = new Date().toISOString();
    const id = randomUUID();
    for (let attempt = 0; attempt < 5; attempt++) {
      const number = generateOrderNumber(demo);
      if (db.prepare("SELECT 1 FROM orders WHERE number = ?").get(number)) continue;
      db.prepare(
        `INSERT INTO orders (id, number, idempotency_key, payload_hash, status, payment_method, user_id,
          customer_first_name, customer_last_name, customer_email, customer_phone, address_json, shipping_method, pickup_point, notes,
          items_json, subtotal_amount, shipping_amount, total_amount, currency, status_note, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pln', ?, ?, ?)`,
      ).run(
        id,
        number,
        value.idempotencyKey,
        payloadHash,
        demo ? "demo" : "pending",
        value.payment,
        userId,
        value.customer.firstName,
        value.customer.lastName,
        value.customer.email,
        value.customer.phone,
        JSON.stringify(value.address),
        value.shipping.method.id,
        value.shipping.pickupPoint,
        value.notes,
        JSON.stringify(value.lines),
        value.subtotal,
        value.shippingCost,
        value.total,
        demo ? "Zamówienie demonstracyjne – płatność nie została pobrana, zamówienie nie będzie realizowane." : null,
        now,
        now,
      );
      return { created: true, order: toRecord(db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Row) };
    }
    throw new Error("Nie udało się wygenerować unikalnego numeru zamówienia.");
  });
}

export function attachCheckoutSession(orderId: string, session: { id: string; url: string | null; expiresAt: number }): void {
  getDb()
    .prepare(
      `UPDATE orders SET stripe_session_id = ?, stripe_session_url = ?, stripe_session_expires_at = ?, updated_at = ?
       WHERE id = ? AND status = 'pending'`,
    )
    .run(session.id, session.url, session.expiresAt, new Date().toISOString(), orderId);
}

/**
 * Zmienia status tylko z dozwolonych stanów (np. `paid` nigdy nie wraca do `pending`).
 * `note`: tekst – nowa notatka, `null` – usunięcie notatki, brak – bez zmian.
 * Zwraca `true`, jeśli zmiana została zapisana.
 */
export function transitionOrder(
  orderId: string,
  to: Exclude<OrderStatus, "demo">,
  allowedFrom: OrderStatus[],
  extra: { paymentIntentId?: string | null; note?: string | null } = {},
): boolean {
  return transaction((db) => {
    const now = new Date().toISOString();
    const placeholders = allowedFrom.map(() => "?").join(", ");
    const result = db
      .prepare(
        `UPDATE orders SET status = ?, updated_at = ?,
           paid_at = CASE WHEN ? = 'paid' THEN ? ELSE paid_at END,
           stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
           status_note = CASE WHEN ? THEN ? ELSE status_note END
         WHERE id = ? AND payment_method = 'stripe' AND status IN (${placeholders})`,
      )
      .run(to, now, to, now, extra.paymentIntentId ?? null, extra.note !== undefined ? 1 : 0, extra.note ?? null, orderId, ...allowedFrom);
    const changed = Number(result.changes) > 0;
    if (changed && to === "paid") {
      // Sprzedaż zapisujemy dokładnie raz – flaga chroni przed podwójnym odjęciem stanu.
      const order = db.prepare("SELECT items_json, stock_committed FROM orders WHERE id = ?").get(orderId) as Row;
      if (Number(order.stock_committed) === 0) {
        commitSale(JSON.parse(order.items_json as string) as PricedLine[]);
        db.prepare("UPDATE orders SET stock_committed = 1 WHERE id = ?").run(orderId);
      }
    }
    return changed;
  });
}

export function setOrderNote(orderId: string, note: string): void {
  getDb().prepare("UPDATE orders SET status_note = ?, updated_at = ? WHERE id = ?").run(note, new Date().toISOString(), orderId);
}

/** Zapamiętuje zdarzenie Stripe. Zwraca `false`, jeśli było już przetworzone (duplikat). */
export function recordStripeEvent(eventId: string, type: string): boolean {
  const result = getDb().prepare("INSERT OR IGNORE INTO stripe_events (id, type, received_at) VALUES (?, ?, ?)").run(eventId, type, new Date().toISOString());
  return Number(result.changes) > 0;
}

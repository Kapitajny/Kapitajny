import "server-only";

import { createHash, randomInt, randomUUID } from "node:crypto";
import type { PricedLine } from "@/lib/pricing";
import type { ValidCheckout } from "@/lib/validation";
import { getDb, transaction } from "./db";

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed";

export interface OrderRecord {
  id: string;
  number: string;
  idempotencyKey: string;
  payloadHash: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  locationId: string;
  pickupDate: string;
  pickupTime: string;
  items: PricedLine[];
  total: number;
  currency: string;
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
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    locationId: row.location_id as string,
    pickupDate: row.pickup_date as string,
    pickupTime: row.pickup_time as string,
    items: JSON.parse(row.items_json as string) as PricedLine[],
    total: Number(row.total_amount),
    currency: row.currency as string,
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
    lines: value.lines.map((l) => [l.key, l.quantity, l.unitPrice]),
    total: value.total,
    location: value.location.id,
    pickup: [value.pickup.date, value.pickup.time],
    customer: [value.customer.name, value.customer.email],
  });
  return createHash("sha256").update(canonical).digest("hex");
}

const NUMBER_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateOrderNumber(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += NUMBER_ALPHABET[randomInt(NUMBER_ALPHABET.length)];
  return `NC-${suffix}`;
}

function select(where: string, value: string): OrderRecord | null {
  const row = getDb().prepare(`SELECT * FROM orders WHERE ${where} = ?`).get(value) as Row | undefined;
  return row ? toRecord(row) : null;
}

export const findOrderById = (id: string) => select("id", id);
export const findOrderByIdempotencyKey = (key: string) => select("idempotency_key", key);
export const findOrderBySessionId = (sessionId: string) => select("stripe_session_id", sessionId);

export type CreateOrderResult = { created: true; order: OrderRecord } | { created: false; order: OrderRecord };

/**
 * Tworzy zamówienie „oczekujące” albo zwraca istniejące o tym samym kluczu idempotencji
 * (ochrona przed podwójnym kliknięciem, odświeżeniem i ponowieniem żądania).
 */
export function createPendingOrder(value: ValidCheckout): CreateOrderResult {
  const payloadHash = hashCheckout(value);
  return transaction((db) => {
    const existing = db.prepare("SELECT * FROM orders WHERE idempotency_key = ?").get(value.idempotencyKey) as Row | undefined;
    if (existing) return { created: false, order: toRecord(existing) };

    const now = new Date().toISOString();
    const id = randomUUID();
    for (let attempt = 0; attempt < 5; attempt++) {
      const number = generateOrderNumber();
      const taken = db.prepare("SELECT 1 FROM orders WHERE number = ?").get(number);
      if (taken) continue;
      db.prepare(
        `INSERT INTO orders (id, number, idempotency_key, payload_hash, status, customer_name, customer_email,
          location_id, pickup_date, pickup_time, items_json, total_amount, currency, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, 'pln', ?, ?)`,
      ).run(
        id,
        number,
        value.idempotencyKey,
        payloadHash,
        value.customer.name,
        value.customer.email,
        value.location.id,
        value.pickup.date,
        value.pickup.time,
        JSON.stringify(value.lines),
        value.total,
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
  to: OrderStatus,
  allowedFrom: OrderStatus[],
  extra: { paymentIntentId?: string | null; note?: string | null } = {},
): boolean {
  const now = new Date().toISOString();
  const placeholders = allowedFrom.map(() => "?").join(", ");
  const result = getDb()
    .prepare(
      `UPDATE orders SET status = ?, updated_at = ?,
         paid_at = CASE WHEN ? = 'paid' THEN ? ELSE paid_at END,
         stripe_payment_intent_id = COALESCE(?, stripe_payment_intent_id),
         status_note = CASE WHEN ? THEN ? ELSE status_note END
       WHERE id = ? AND status IN (${placeholders})`,
    )
    .run(to, now, to, now, extra.paymentIntentId ?? null, extra.note !== undefined ? 1 : 0, extra.note ?? null, orderId, ...allowedFrom);
  return Number(result.changes) > 0;
}

export function setOrderNote(orderId: string, note: string): void {
  getDb().prepare("UPDATE orders SET status_note = ?, updated_at = ? WHERE id = ?").run(note, new Date().toISOString(), orderId);
}

/** Zapamiętuje zdarzenie Stripe. Zwraca `false`, jeśli było już przetworzone (duplikat). */
export function recordStripeEvent(eventId: string, type: string): boolean {
  const result = getDb().prepare("INSERT OR IGNORE INTO stripe_events (id, type, received_at) VALUES (?, ?, ?)").run(eventId, type, new Date().toISOString());
  return Number(result.changes) > 0;
}

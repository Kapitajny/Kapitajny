import "server-only";

import { createHash, randomInt, randomUUID } from "node:crypto";
import { DIGITAL_CONSENT_TEXT, type ValidCheckout } from "@/lib/validation";
import { getDb, transaction } from "./db";

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed";

export interface OrderItem {
  slug: string;
  title: string;
  price: number;
}

export interface OrderRecord {
  id: string;
  number: string;
  idempotencyKey: string;
  payloadHash: string;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  currency: string;
  termsAcceptedAt: string;
  digitalConsentAt: string;
  digitalConsentText: string;
  stripeSessionId: string | null;
  stripeSessionUrl: string | null;
  stripeSessionExpiresAt: number | null;
  stripePaymentIntentId: string | null;
  statusNote: string | null;
  emailSentAt: string | null;
  emailError: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

type Row = Record<string, string | number | null>;

const str = (v: string | number | null | undefined) => (v === null || v === undefined ? null : String(v));

function toRecord(row: Row): OrderRecord {
  return {
    id: row.id as string,
    number: row.number as string,
    idempotencyKey: row.idempotency_key as string,
    payloadHash: row.payload_hash as string,
    status: row.status as OrderStatus,
    customerEmail: row.customer_email as string,
    customerName: row.customer_name as string,
    items: JSON.parse(row.items_json as string) as OrderItem[],
    total: Number(row.total_amount),
    currency: row.currency as string,
    termsAcceptedAt: row.terms_accepted_at as string,
    digitalConsentAt: row.digital_consent_at as string,
    digitalConsentText: row.digital_consent_text as string,
    stripeSessionId: str(row.stripe_session_id),
    stripeSessionUrl: str(row.stripe_session_url),
    stripeSessionExpiresAt: row.stripe_session_expires_at === null ? null : Number(row.stripe_session_expires_at),
    stripePaymentIntentId: str(row.stripe_payment_intent_id),
    statusNote: str(row.status_note),
    emailSentAt: str(row.email_sent_at),
    emailError: str(row.email_error),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    paidAt: str(row.paid_at),
  };
}

/** Odcisk treści zamówienia – ten sam klucz idempotencji musi oznaczać tę samą treść. */
export function hashCheckout(value: ValidCheckout): string {
  const canonical = JSON.stringify({ items: value.products.map((p) => [p.slug, p.price]), total: value.total, email: value.email, name: value.name });
  return createHash("sha256").update(canonical).digest("hex");
}

const NUMBER_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function generateOrderNumber(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += NUMBER_ALPHABET[randomInt(NUMBER_ALPHABET.length)];
  return `NZ-${suffix}`;
}

function select(where: string, value: string): OrderRecord | null {
  const row = getDb().prepare(`SELECT * FROM orders WHERE ${where} = ?`).get(value) as Row | undefined;
  return row ? toRecord(row) : null;
}

export const findOrderById = (id: string) => select("id", id);
export const findOrderBySessionId = (sessionId: string) => select("stripe_session_id", sessionId);
export const findOrderByNumber = (number: string) => select("number", number.trim().toUpperCase());

/** Opłacone zamówienia klienta (do ponownego wysłania linków). */
export function findPaidOrdersByEmail(email: string): OrderRecord[] {
  const rows = getDb().prepare("SELECT * FROM orders WHERE customer_email = ? AND status = 'paid' ORDER BY paid_at DESC LIMIT 20").all(email) as Row[];
  return rows.map(toRecord);
}

/**
 * Tworzy zamówienie „oczekujące” albo zwraca istniejące o tym samym kluczu idempotencji
 * (ochrona przed podwójnym kliknięciem, odświeżeniem i ponowieniem żądania).
 */
export function createPendingOrder(value: ValidCheckout): { created: boolean; order: OrderRecord } {
  const payloadHash = hashCheckout(value);
  return transaction((db) => {
    const existing = db.prepare("SELECT * FROM orders WHERE idempotency_key = ?").get(value.idempotencyKey) as Row | undefined;
    if (existing) return { created: false, order: toRecord(existing) };

    const now = new Date().toISOString();
    const id = randomUUID();
    const items: OrderItem[] = value.products.map((p) => ({ slug: p.slug, title: p.title, price: p.price }));
    for (let attempt = 0; attempt < 5; attempt++) {
      const number = generateOrderNumber();
      if (db.prepare("SELECT 1 FROM orders WHERE number = ?").get(number)) continue;
      db.prepare(
        `INSERT INTO orders (id, number, idempotency_key, payload_hash, status, customer_email, customer_name, items_json,
          total_amount, currency, terms_accepted_at, digital_consent_at, digital_consent_text, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, 'pln', ?, ?, ?, ?, ?)`,
      ).run(id, number, value.idempotencyKey, payloadHash, value.email, value.name, JSON.stringify(items), value.total, now, now, DIGITAL_CONSENT_TEXT, now, now);
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
 * `note`: tekst – nowa notatka, `null` – usunięcie notatki, brak – bez zmian. Zwraca `true`, jeśli zapisano zmianę.
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

export function markEmailResult(orderId: string, result: { sent: boolean; error?: string }): void {
  getDb()
    .prepare("UPDATE orders SET email_sent_at = CASE WHEN ? THEN ? ELSE email_sent_at END, email_error = ?, updated_at = ? WHERE id = ?")
    .run(result.sent ? 1 : 0, new Date().toISOString(), result.sent ? null : (result.error ?? "nie wysłano"), new Date().toISOString(), orderId);
}

/** Zapamiętuje zdarzenie Stripe. Zwraca `false`, jeśli było już przetworzone (duplikat). */
export function recordStripeEvent(eventId: string, type: string): boolean {
  const result = getDb().prepare("INSERT OR IGNORE INTO stripe_events (id, type, received_at) VALUES (?, ?, ?)").run(eventId, type, new Date().toISOString());
  return Number(result.changes) > 0;
}

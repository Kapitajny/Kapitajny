import "server-only";

import { randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import {
  ACTIVE_STATUSES,
  BOOKING_STATUSES,
  checkSlot,
  daySlots,
  isDuration,
  jetskiTitle,
  type BookingStatus,
  type BusyInterval,
  type Duration,
  type Slot,
  type SlotProblem,
} from "@/lib/rental";
import { addDays, fromLocal, isDate, isTime, toLocal, toMinutes } from "@/lib/time";
import { cleanMultiline, validateContact, type FieldErrors } from "@/lib/validation";
import { getDb, withWriteTransaction } from "./db";
import { getBookingRules, getJetski, getOpeningHours } from "./repo";

const ACTIVE_SQL = ACTIVE_STATUSES.map((s) => `'${s}'`).join(", ");

/** Zajęte przedziały skutera w oknie czasu (rezerwacje aktywne + blokady skutera i całej floty). */
export function getBusy(jetskiId: string, from: number, to: number): BusyInterval[] {
  const db = getDb();
  const bookings = db
    .prepare(`SELECT start_at, end_at FROM bookings WHERE jetski_id = ? AND status IN (${ACTIVE_SQL}) AND start_at < ? AND end_at > ?`)
    .all(jetskiId, to, from) as { start_at: number; end_at: number }[];
  const blocks = db
    .prepare("SELECT start_at, end_at FROM blocks WHERE (jetski_id = ? OR jetski_id IS NULL) AND start_at < ? AND end_at > ?")
    .all(jetskiId, to, from) as { start_at: number; end_at: number }[];
  return [
    ...bookings.map((b) => ({ start: b.start_at, end: b.end_at, booking: true })),
    ...blocks.map((b) => ({ start: b.start_at, end: b.end_at, booking: false })),
  ];
}

function slotContext(jetskiId: string, date: string, now: number) {
  const rules = getBookingRules();
  // okno z zapasem: poprzedni dzień (długie wynajmy) do dwóch dni po (zwrot po dobie)
  const from = fromLocal(addDays(date, -1), 0);
  const to = fromLocal(addDays(date, 3), 0);
  return { now, rules, hours: getOpeningHours(), busy: getBusy(jetskiId, from, to) };
}

export type AvailabilityResult =
  | { ok: true; slots: Slot[]; price: number | null; deposit: number | null }
  | { ok: false; code: "not-found" | "invalid" };

export function getAvailability(jetskiId: string, date: string, duration: number, now = Date.now()): AvailabilityResult {
  if (!isDate(date) || !isDuration(duration)) return { ok: false, code: "invalid" };
  const jetski = getJetski(jetskiId);
  if (!jetski || !jetski.active) return { ok: false, code: "not-found" };
  const price = jetski.prices[duration];
  const slots = price == null ? [] : daySlots(date, duration, slotContext(jetskiId, date, now));
  return { ok: true, slots, price, deposit: jetski.depositGr };
}

/** Dni w zakresie, w których skuter ma choć jeden wolny termin dla danego czasu. */
export function getOpenDays(jetskiId: string, fromDate: string, days: number, duration: Duration, now = Date.now()): string[] {
  const jetski = getJetski(jetskiId);
  if (!jetski || jetski.prices[duration] == null) return [];
  const rules = getBookingRules();
  const hours = getOpeningHours();
  const busy = getBusy(jetskiId, fromLocal(addDays(fromDate, -1), 0), fromLocal(addDays(fromDate, days + 2), 0));
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(fromDate, i);
    if (daySlots(date, duration, { now, rules, hours, busy }).some((s) => s.available)) out.push(date);
  }
  return out;
}

/* --------------------------------------------------------------- tworzenie */

export interface BookingRequest {
  jetskiId?: unknown;
  date?: unknown;
  time?: unknown;
  duration?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  note?: unknown;
  acceptTerms?: unknown;
  acceptRules?: unknown;
  idempotencyKey?: unknown;
}

export interface BookingSummary {
  number: string;
  token: string;
  jetskiName: string;
  start: number;
  end: number;
  duration: number;
  priceGr: number;
  depositGr: number | null;
  status: BookingStatus;
}

export type CreateResult =
  | { ok: true; booking: BookingSummary; replayed: boolean }
  | { ok: false; status: number; code: string; message: string; errors?: FieldErrors };

const SLOT_MESSAGES: Record<SlotProblem, string> = {
  closed: "W tym dniu lub o tej godzinie przystań jest zamknięta.",
  past: "Ten termin jest już niedostępny – wybierz późniejszą godzinę.",
  "too-far": "Rezerwacje na ten termin nie są jeszcze otwarte.",
  "after-close": "Wynajem musi zakończyć się przed zamknięciem przystani. Wybierz wcześniejszą godzinę lub krótszy czas.",
  "return-closed": "Zwrot przypadałby poza godzinami otwarcia. Wybierz inną godzinę startu.",
  busy: "Ktoś właśnie zarezerwował ten termin. Wybierz inną godzinę.",
};

function bookingNumber(start: number): string {
  const { date } = toLocal(start);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(4);
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `MJ-${date.slice(2).replace(/-/g, "")}-${suffix}`;
}

export function createBooking(req: BookingRequest, now = Date.now()): CreateResult {
  const errors: FieldErrors = {};
  const jetskiId = typeof req.jetskiId === "string" ? req.jetskiId : "";
  const duration = typeof req.duration === "number" ? req.duration : Number(req.duration);
  const idempotencyKey = typeof req.idempotencyKey === "string" && /^[A-Za-z0-9-]{16,64}$/.test(req.idempotencyKey) ? req.idempotencyKey : null;

  if (!isDate(req.date)) errors.date = "Wybierz datę.";
  if (!isTime(req.time)) errors.time = "Wybierz godzinę rozpoczęcia.";
  if (!isDuration(duration)) errors.duration = "Wybierz czas wynajmu.";
  const contact = validateContact(req);
  Object.assign(errors, contact.errors);
  const note = cleanMultiline(req.note, 600);
  if (req.acceptTerms !== true) errors.acceptTerms = "Aby zarezerwować, zaakceptuj regulamin wypożyczalni.";
  if (req.acceptRules !== true) errors.acceptRules = "Potwierdź, że znasz zasady wynajmu i wymagania dla wybranego skutera.";
  if (!idempotencyKey) return { ok: false, status: 400, code: "invalid", message: "Odśwież stronę i spróbuj ponownie." };
  if (Object.keys(errors).length) return { ok: false, status: 422, code: "validation", message: "Popraw zaznaczone pola.", errors };

  const date = req.date as string;
  const startMin = toMinutes(req.time as string);
  const dur = duration as Duration;

  // ponowne wysłanie tego samego formularza (np. podwójne kliknięcie) zwraca istniejącą rezerwację
  const existing = findByIdempotencyKey(idempotencyKey);
  if (existing) return { ok: true, booking: existing, replayed: true };

  try {
    return withWriteTransaction((db) => {
      const jetski = getJetski(jetskiId);
      if (!jetski || !jetski.active) return { ok: false as const, status: 404, code: "not-found", message: "Ten skuter nie jest już dostępny." };
      const price = jetski.prices[dur];
      if (price == null)
        return { ok: false as const, status: 409, code: "no-price", message: "Dla tego czasu wynajmu nie ustalono jeszcze ceny. Wybierz inny czas lub zadzwoń do nas." };

      const problem = checkSlot(date, startMin, dur, slotContext(jetski.id, date, now));
      if (problem) return { ok: false as const, status: 409, code: problem, message: SLOT_MESSAGES[problem] };

      const start = fromLocal(date, startMin);
      const end = start + dur * 60_000;
      const customerId = upsertCustomer(contact.value, now);
      const id = randomUUID();
      const token = randomBytes(24).toString("base64url");
      let number = bookingNumber(start);
      while (db.prepare("SELECT 1 FROM bookings WHERE number = ?").get(number)) number = bookingNumber(start);

      db.prepare(
        `INSERT INTO bookings (id, number, jetski_id, customer_id, start_at, end_at, duration_min, price_gr, deposit_gr, status,
          customer_note, cancel_token, idempotency_key, terms_accepted_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
      ).run(id, number, jetski.id, customerId, start, end, dur, price, jetski.depositGr, note || null, token, idempotencyKey, now, now, now);

      return {
        ok: true as const,
        replayed: false,
        booking: { number, token, jetskiName: jetskiTitle(jetski), start, end, duration: dur, priceGr: price, depositGr: jetski.depositGr, status: "pending" as const },
      };
    });
  } catch (error) {
    if (error instanceof Error && /UNIQUE constraint failed: bookings.idempotency_key/.test(error.message)) {
      const again = findByIdempotencyKey(idempotencyKey);
      if (again) return { ok: true, booking: again, replayed: true };
    }
    throw error;
  }
}

function upsertCustomer(c: { name: string; email: string; phone: string }, now: number): string {
  const db = getDb();
  const found = db.prepare("SELECT id FROM customers WHERE email = ?").get(c.email) as { id: string } | undefined;
  if (found) {
    db.prepare("UPDATE customers SET name = ?, phone = ?, updated_at = ? WHERE id = ?").run(c.name, c.phone, now, found.id);
    return found.id;
  }
  const id = randomUUID();
  db.prepare("INSERT INTO customers (id, name, email, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run(id, c.name, c.email, c.phone, now, now);
  return id;
}

interface BookingRow {
  id: string;
  number: string;
  jetski_id: string;
  customer_id: string | null;
  start_at: number;
  end_at: number;
  duration_min: number;
  price_gr: number;
  deposit_gr: number | null;
  status: BookingStatus;
  customer_note: string | null;
  admin_note: string | null;
  cancel_token: string;
  created_at: number;
  cancelled_at: number | null;
  cancelled_by: string | null;
  jetski_name: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
}

const BOOKING_SELECT = `SELECT b.*, j.name AS jetski_name, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
  FROM bookings b LEFT JOIN jetskis j ON j.id = b.jetski_id LEFT JOIN customers c ON c.id = b.customer_id`;

function toSummary(r: BookingRow): BookingSummary {
  return {
    number: r.number,
    token: r.cancel_token,
    jetskiName: r.jetski_name ?? "Skuter",
    start: r.start_at,
    end: r.end_at,
    duration: r.duration_min,
    priceGr: r.price_gr,
    depositGr: r.deposit_gr,
    status: r.status,
  };
}

function findByIdempotencyKey(key: string): BookingSummary | null {
  const row = getDb().prepare(`${BOOKING_SELECT} WHERE b.idempotency_key = ?`).get(key) as unknown as BookingRow | undefined;
  return row ? toSummary(row) : null;
}

function tokenMatches(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Rezerwacja widoczna dla klienta – wymaga numeru i tajnego tokenu z potwierdzenia. */
export function getBookingForCustomer(number: string, token: string): (BookingSummary & { canCancel: boolean; cancelDeadline: number }) | null {
  const row = getDb().prepare(`${BOOKING_SELECT} WHERE b.number = ?`).get(number) as unknown as BookingRow | undefined;
  if (!row || !tokenMatches(row.cancel_token, token)) return null;
  const deadline = row.start_at - getBookingRules().cancelFreeHours * 3_600_000;
  return { ...toSummary(row), canCancel: ACTIVE_STATUSES.includes(row.status) && Date.now() < deadline, cancelDeadline: deadline };
}

export function cancelByCustomer(number: string, token: string): { ok: true } | { ok: false; code: "not-found" | "too-late" | "not-active" } {
  return withWriteTransaction((db) => {
    const row = db.prepare("SELECT status, start_at, cancel_token FROM bookings WHERE number = ?").get(number) as
      | { status: BookingStatus; start_at: number; cancel_token: string }
      | undefined;
    if (!row || !tokenMatches(row.cancel_token, token)) return { ok: false as const, code: "not-found" as const };
    if (!ACTIVE_STATUSES.includes(row.status)) return { ok: false as const, code: "not-active" as const };
    if (Date.now() >= row.start_at - getBookingRules().cancelFreeHours * 3_600_000) return { ok: false as const, code: "too-late" as const };
    const now = Date.now();
    db.prepare("UPDATE bookings SET status = 'cancelled', cancelled_at = ?, cancelled_by = 'customer', updated_at = ? WHERE number = ?").run(now, now, number);
    return { ok: true as const };
  });
}

/* ------------------------------------------------------------------ panel */

export interface AdminBooking {
  id: string;
  number: string;
  jetskiId: string;
  jetskiName: string;
  customerId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  start: number;
  end: number;
  duration: number;
  priceGr: number;
  depositGr: number | null;
  status: BookingStatus;
  customerNote: string | null;
  adminNote: string | null;
  createdAt: number;
  cancelledBy: string | null;
}

function toAdmin(r: BookingRow): AdminBooking {
  return {
    id: r.id,
    number: r.number,
    jetskiId: r.jetski_id,
    jetskiName: r.jetski_name ?? r.jetski_id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    start: r.start_at,
    end: r.end_at,
    duration: r.duration_min,
    priceGr: r.price_gr,
    depositGr: r.deposit_gr,
    status: r.status,
    customerNote: r.customer_note,
    adminNote: r.admin_note,
    createdAt: r.created_at,
    cancelledBy: r.cancelled_by,
  };
}

export function listBookings(filter: { from?: number; to?: number; status?: string; query?: string; customerId?: string }): AdminBooking[] {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (filter.from != null) {
    where.push("b.end_at > ?");
    args.push(filter.from);
  }
  if (filter.to != null) {
    where.push("b.start_at < ?");
    args.push(filter.to);
  }
  if (filter.status && (BOOKING_STATUSES as readonly string[]).includes(filter.status)) {
    where.push("b.status = ?");
    args.push(filter.status);
  }
  if (filter.customerId) {
    where.push("b.customer_id = ?");
    args.push(filter.customerId);
  }
  if (filter.query?.trim()) {
    const q = `%${filter.query.trim().toLowerCase()}%`;
    where.push("(lower(b.number) LIKE ? OR lower(c.name) LIKE ? OR lower(c.email) LIKE ? OR c.phone LIKE ?)");
    args.push(q, q, q, q);
  }
  const sql = `${BOOKING_SELECT} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY b.start_at LIMIT 1000`;
  return (getDb().prepare(sql).all(...args) as unknown as BookingRow[]).map(toAdmin);
}

export function updateBooking(id: string, patch: { status?: unknown; adminNote?: unknown }): { ok: true; booking: AdminBooking } | { ok: false; code: string; message: string } {
  return withWriteTransaction((db) => {
    const row = db.prepare(`${BOOKING_SELECT} WHERE b.id = ?`).get(id) as unknown as BookingRow | undefined;
    if (!row) return { ok: false as const, code: "not-found", message: "Nie znaleziono rezerwacji." };
    const now = Date.now();
    if (patch.status !== undefined) {
      if (typeof patch.status !== "string" || !(BOOKING_STATUSES as readonly string[]).includes(patch.status))
        return { ok: false as const, code: "invalid", message: "Nieznany status." };
      const next = patch.status as BookingStatus;
      // przywrócenie anulowanej rezerwacji jest możliwe tylko, gdy termin wciąż jest wolny
      if (ACTIVE_STATUSES.includes(next) && !ACTIVE_STATUSES.includes(row.status)) {
        const busy = getBusy(row.jetski_id, row.start_at - 2 * 86_400_000, row.end_at + 2 * 86_400_000);
        const { prepMinutes } = getBookingRules();
        const clash = busy.some((b) =>
          b.booking ? row.start_at < b.end + prepMinutes * 60_000 && b.start < row.end_at + prepMinutes * 60_000 : row.start_at < b.end && b.start < row.end_at,
        );
        if (clash) return { ok: false as const, code: "busy", message: "Tego terminu nie da się przywrócić – skuter jest już zajęty lub zablokowany." };
      }
      db.prepare(
        `UPDATE bookings SET status = ?, updated_at = ?, cancelled_at = CASE WHEN ? = 'cancelled' THEN ? ELSE NULL END,
         cancelled_by = CASE WHEN ? = 'cancelled' THEN 'admin' ELSE NULL END WHERE id = ?`,
      ).run(next, now, next, now, next, id);
    }
    if (patch.adminNote !== undefined) {
      db.prepare("UPDATE bookings SET admin_note = ?, updated_at = ? WHERE id = ?").run(cleanMultiline(patch.adminNote, 1000) || null, now, id);
    }
    const updated = db.prepare(`${BOOKING_SELECT} WHERE b.id = ?`).get(id) as unknown as BookingRow;
    return { ok: true as const, booking: toAdmin(updated) };
  });
}

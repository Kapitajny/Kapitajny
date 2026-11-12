import "server-only";

import { randomUUID } from "node:crypto";
import {
  DURATIONS,
  emptyPrices,
  isDuration,
  type BookingRules,
  type Duration,
  type Jetski,
  type LicenseRequirement,
  type NoLicenseMode,
  type OpeningDay,
} from "@/lib/rental";
import { DEFAULT_SETTINGS } from "./seed";
import { getDb } from "./db";

/* ------------------------------------------------------------------ flota */

interface JetskiRow {
  id: string;
  manufacturer: string | null;
  model: string | null;
  name: string;
  description: string | null;
  power_hp: number | null;
  seats: number | null;
  license: LicenseRequirement;
  license_note: string | null;
  deposit_gr: number | null;
  image: string | null;
  image_alt: string | null;
  active: number;
  needs_review: number;
  sort: number;
}

function mapJetski(row: JetskiRow, prices: Map<string, Record<Duration, number | null>>): Jetski {
  return {
    id: row.id,
    manufacturer: row.manufacturer,
    model: row.model,
    name: row.name,
    description: row.description,
    powerHp: row.power_hp,
    seats: row.seats,
    license: row.license,
    licenseNote: row.license_note,
    depositGr: row.deposit_gr,
    image: row.image,
    imageAlt: row.image_alt,
    active: row.active === 1,
    needsReview: row.needs_review === 1,
    sort: row.sort,
    prices: prices.get(row.id) ?? emptyPrices(),
  };
}

function loadPrices(): Map<string, Record<Duration, number | null>> {
  const rows = getDb().prepare("SELECT jetski_id, duration_min, price_gr FROM prices").all() as {
    jetski_id: string;
    duration_min: number;
    price_gr: number;
  }[];
  const map = new Map<string, Record<Duration, number | null>>();
  for (const r of rows) {
    if (!isDuration(r.duration_min)) continue;
    const entry = map.get(r.jetski_id) ?? emptyPrices();
    entry[r.duration_min] = r.price_gr;
    map.set(r.jetski_id, entry);
  }
  return map;
}

export function listJetskis({ includeInactive = false } = {}): Jetski[] {
  const rows = getDb()
    .prepare(`SELECT * FROM jetskis ${includeInactive ? "" : "WHERE active = 1"} ORDER BY sort, name`)
    .all() as unknown as JetskiRow[];
  const prices = loadPrices();
  return rows.map((r) => mapJetski(r, prices));
}

export function getJetski(id: string): Jetski | null {
  const row = getDb().prepare("SELECT * FROM jetskis WHERE id = ?").get(id) as unknown as JetskiRow | undefined;
  return row ? mapJetski(row, loadPrices()) : null;
}

export interface JetskiInput {
  manufacturer: string | null;
  model: string | null;
  name: string;
  description: string | null;
  powerHp: number | null;
  seats: number | null;
  license: LicenseRequirement;
  licenseNote: string | null;
  depositGr: number | null;
  image: string | null;
  imageAlt: string | null;
  active: boolean;
  needsReview: boolean;
  sort: number;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "skuter"
  );
}

export function createJetski(input: JetskiInput): Jetski {
  const db = getDb();
  let id = slugify(input.name);
  for (let i = 2; db.prepare("SELECT 1 FROM jetskis WHERE id = ?").get(id); i++) id = `${slugify(input.name)}-${i}`;
  const now = Date.now();
  db.prepare(
    `INSERT INTO jetskis (id, manufacturer, model, name, description, power_hp, seats, license, license_note, deposit_gr, image, image_alt, active, needs_review, sort, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.manufacturer,
    input.model,
    input.name,
    input.description,
    input.powerHp,
    input.seats,
    input.license,
    input.licenseNote,
    input.depositGr,
    input.image,
    input.imageAlt,
    input.active ? 1 : 0,
    input.needsReview ? 1 : 0,
    input.sort,
    now,
    now,
  );
  return getJetski(id)!;
}

export function updateJetski(id: string, input: JetskiInput): Jetski | null {
  const result = getDb()
    .prepare(
      `UPDATE jetskis SET manufacturer = ?, model = ?, name = ?, description = ?, power_hp = ?, seats = ?, license = ?, license_note = ?,
       deposit_gr = ?, image = ?, image_alt = ?, active = ?, needs_review = ?, sort = ?, updated_at = ? WHERE id = ?`,
    )
    .run(
      input.manufacturer,
      input.model,
      input.name,
      input.description,
      input.powerHp,
      input.seats,
      input.license,
      input.licenseNote,
      input.depositGr,
      input.image,
      input.imageAlt,
      input.active ? 1 : 0,
      input.needsReview ? 1 : 0,
      input.sort,
      Date.now(),
      id,
    );
  return result.changes ? getJetski(id) : null;
}

/** Usuwa skuter. Skuter z historią rezerwacji jest tylko wyłączany (historia musi zostać). */
export function deleteJetski(id: string): "deleted" | "deactivated" | "not-found" {
  const db = getDb();
  if (!db.prepare("SELECT 1 FROM jetskis WHERE id = ?").get(id)) return "not-found";
  if (db.prepare("SELECT 1 FROM bookings WHERE jetski_id = ? LIMIT 1").get(id)) {
    db.prepare("UPDATE jetskis SET active = 0, updated_at = ? WHERE id = ?").run(Date.now(), id);
    return "deactivated";
  }
  db.prepare("DELETE FROM jetskis WHERE id = ?").run(id);
  return "deleted";
}

export function setDeposit(jetskiId: string, depositGr: number | null): void {
  getDb().prepare("UPDATE jetskis SET deposit_gr = ?, updated_at = ? WHERE id = ?").run(depositGr, Date.now(), jetskiId);
}

export function setPrices(jetskiId: string, prices: Partial<Record<Duration, number | null>>): void {
  const db = getDb();
  const del = db.prepare("DELETE FROM prices WHERE jetski_id = ? AND duration_min = ?");
  const upsert = db.prepare(
    "INSERT INTO prices (jetski_id, duration_min, price_gr) VALUES (?, ?, ?) ON CONFLICT (jetski_id, duration_min) DO UPDATE SET price_gr = excluded.price_gr",
  );
  db.exec("BEGIN");
  try {
    for (const d of DURATIONS) {
      if (!(d in prices)) continue;
      const value = prices[d];
      if (value == null) del.run(jetskiId, d);
      else upsert.run(jetskiId, d, value);
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

/* ------------------------------------------------------------ ustawienia */

export type Settings = typeof DEFAULT_SETTINGS;

export function getSettings(): Settings {
  const rows = getDb().prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const out = { ...DEFAULT_SETTINGS };
  for (const r of rows) if (r.key in out) out[r.key] = r.value;
  return out;
}

export function updateSettings(values: Partial<Settings>): Settings {
  const db = getDb();
  const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value");
  for (const [k, v] of Object.entries(values)) if (k in DEFAULT_SETTINGS && typeof v === "string") stmt.run(k, v);
  return getSettings();
}

function intSetting(s: Settings, key: string, fallback: number): number {
  const n = Number.parseInt(s[key] ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function getBookingRules(s: Settings = getSettings()): BookingRules {
  return {
    prepMinutes: intSetting(s, "prep_minutes", 15),
    leadMinutes: intSetting(s, "lead_minutes", 60),
    slotStepMinutes: Math.max(15, intSetting(s, "slot_step_minutes", 30)),
    horizonDays: intSetting(s, "horizon_days", 120),
    cancelFreeHours: intSetting(s, "cancel_free_hours", 24),
  };
}

export function getNoLicenseMode(s: Settings = getSettings()): NoLicenseMode {
  const v = s.no_license_mode;
  return v === "models" || v === "instructor" ? v : "hidden";
}

/* ------------------------------------------------------- godziny otwarcia */

export function getOpeningHours(): OpeningDay[] {
  return getDb().prepare("SELECT weekday, open, close FROM opening_hours ORDER BY weekday").all() as unknown as OpeningDay[];
}

export function setOpeningHours(days: OpeningDay[]): void {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT INTO opening_hours (weekday, open, close) VALUES (?, ?, ?) ON CONFLICT (weekday) DO UPDATE SET open = excluded.open, close = excluded.close",
  );
  db.exec("BEGIN");
  try {
    for (const d of days) stmt.run(d.weekday, d.open, d.close);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

/* ---------------------------------------------------------------- blokady */

export interface Block {
  id: string;
  jetskiId: string | null;
  start: number;
  end: number;
  reason: string | null;
}

export function listBlocks(fromMs = 0): Block[] {
  return (
    getDb().prepare("SELECT id, jetski_id, start_at, end_at, reason FROM blocks WHERE end_at > ? ORDER BY start_at").all(fromMs) as {
      id: string;
      jetski_id: string | null;
      start_at: number;
      end_at: number;
      reason: string | null;
    }[]
  ).map((r) => ({ id: r.id, jetskiId: r.jetski_id, start: r.start_at, end: r.end_at, reason: r.reason }));
}

export function createBlock(input: Omit<Block, "id">): Block {
  const id = randomUUID();
  getDb()
    .prepare("INSERT INTO blocks (id, jetski_id, start_at, end_at, reason, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(id, input.jetskiId, input.start, input.end, input.reason, Date.now());
  return { id, ...input };
}

export function deleteBlock(id: string): boolean {
  return getDb().prepare("DELETE FROM blocks WHERE id = ?").run(id).changes > 0;
}

/* ---------------------------------------------------------------- klienci */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  createdAt: number;
  bookings: number;
  lastBooking: number | null;
}

export function listCustomers(query = ""): Customer[] {
  const q = `%${query.trim().toLowerCase()}%`;
  return (
    getDb()
      .prepare(
        `SELECT c.*, COUNT(b.id) AS n, MAX(b.start_at) AS last FROM customers c LEFT JOIN bookings b ON b.customer_id = c.id
         WHERE lower(c.name) LIKE ? OR lower(c.email) LIKE ? OR c.phone LIKE ?
         GROUP BY c.id ORDER BY c.created_at DESC LIMIT 500`,
      )
      .all(q, q, q) as {
      id: string;
      name: string;
      email: string;
      phone: string;
      notes: string | null;
      created_at: number;
      n: number;
      last: number | null;
    }[]
  ).map((r) => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, notes: r.notes, createdAt: r.created_at, bookings: r.n, lastBooking: r.last }));
}

export function updateCustomer(id: string, input: { name: string; email: string; phone: string; notes: string | null }): boolean {
  return (
    getDb()
      .prepare("UPDATE customers SET name = ?, email = ?, phone = ?, notes = ?, updated_at = ? WHERE id = ?")
      .run(input.name, input.email, input.phone, input.notes, Date.now(), id).changes > 0
  );
}

/** Usunięcie danych klienta (RODO). Rezerwacje zostają w historii, bez powiązania z osobą. */
export function deleteCustomer(id: string): boolean {
  return getDb().prepare("DELETE FROM customers WHERE id = ?").run(id).changes > 0;
}

import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Block, Booking, BookingStatus, BookingStore, NewBooking, WriteResult } from "./types";

/**
 * Repozytorium SQLite (moduł `node:sqlite`, Node 22.13+). Domyślne w trybie lokalnym
 * i na serwerze z trwałym dyskiem. Zapisy wykonujemy w transakcji `BEGIN IMMEDIATE`,
 * która blokuje bazę do zapisu – sprawdzenie kolizji i wstawienie są atomowe,
 * również między procesami korzystającymi z tego samego pliku.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  service TEXT NOT NULL,
  duration_min INTEGER NOT NULL CHECK (duration_min BETWEEN 30 AND 480),
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL CHECK (ends_at > starts_at),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  sound TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'pl',
  token_hash TEXT NOT NULL UNIQUE,
  cancel_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS bookings_time_idx ON bookings (starts_at, ends_at) WHERE status <> 'cancelled';

CREATE TABLE IF NOT EXISTS booking_blocks (
  id TEXT PRIMARY KEY,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL CHECK (ends_at > starts_at),
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
`;

type Row = Record<string, string | number | null>;

const toBooking = (r: Row): Booking => ({
  id: String(r.id),
  status: r.status as BookingStatus,
  service: r.service as Booking["service"],
  durationMin: Number(r.duration_min),
  startsAt: String(r.starts_at),
  endsAt: String(r.ends_at),
  name: String(r.name),
  email: String(r.email),
  phone: String(r.phone ?? ""),
  message: String(r.message ?? ""),
  sound: String(r.sound ?? ""),
  lang: r.lang === "en" ? "en" : "pl",
  createdAt: String(r.created_at),
  updatedAt: String(r.updated_at),
  cancelReason: r.cancel_reason === null ? null : String(r.cancel_reason),
});

const toBlock = (r: Row): Block => ({ id: String(r.id), startsAt: String(r.starts_at), endsAt: String(r.ends_at), note: String(r.note ?? "") });

/** ISO w UTC z milisekundami – porównywalne leksykograficznie. */
const iso = (d: Date | string) => new Date(d).toISOString();

export class SqliteStore implements BookingStore {
  private db: DatabaseSync;

  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(resolve(path)), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    this.db.exec(SCHEMA);
  }

  private tx<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  private hasConflict(startsAt: string, endsAt: string, excludeId?: string): boolean {
    const booking = this.db
      .prepare("SELECT 1 FROM bookings WHERE status <> 'cancelled' AND starts_at < ? AND ends_at > ? AND id <> ? LIMIT 1")
      .get(endsAt, startsAt, excludeId ?? "");
    if (booking) return true;
    return !!this.db.prepare("SELECT 1 FROM booking_blocks WHERE starts_at < ? AND ends_at > ? LIMIT 1").get(endsAt, startsAt);
  }

  private get(id: string): Booking | null {
    const row = this.db.prepare("SELECT * FROM bookings WHERE id = ?").get(id) as Row | undefined;
    return row ? toBooking(row) : null;
  }

  async listBusy(from: Date, to: Date, excludeBookingId?: string) {
    const rows = this.db
      .prepare(
        `SELECT starts_at, ends_at FROM bookings WHERE status <> 'cancelled' AND starts_at < ? AND ends_at > ? AND id <> ?
         UNION ALL SELECT starts_at, ends_at FROM booking_blocks WHERE starts_at < ? AND ends_at > ?`,
      )
      .all(iso(to), iso(from), excludeBookingId ?? "", iso(to), iso(from)) as Row[];
    return rows.map((r) => ({ start: Date.parse(String(r.starts_at)), end: Date.parse(String(r.ends_at)) }));
  }

  async create(input: NewBooking): Promise<WriteResult<Booking>> {
    const startsAt = iso(input.startsAt);
    const endsAt = iso(input.endsAt);
    return this.tx(() => {
      if (this.hasConflict(startsAt, endsAt)) return { ok: false, reason: "conflict" } as const;
      const id = randomUUID();
      const now = iso(new Date());
      this.db
        .prepare(
          `INSERT INTO bookings (id, status, service, duration_min, starts_at, ends_at, name, email, phone, message, sound, lang, token_hash, created_at, updated_at)
           VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(id, input.service, input.durationMin, startsAt, endsAt, input.name, input.email, input.phone, input.message, input.sound, input.lang, input.tokenHash, now, now);
      return { ok: true, value: this.get(id)! } as const;
    });
  }

  async findByTokenHash(tokenHash: string) {
    const row = this.db.prepare("SELECT * FROM bookings WHERE token_hash = ?").get(tokenHash) as Row | undefined;
    return row ? toBooking(row) : null;
  }

  async findById(id: string) {
    return this.get(id);
  }

  async reschedule(id: string, start: string, end: string): Promise<WriteResult<Booking>> {
    const startsAt = iso(start);
    const endsAt = iso(end);
    return this.tx(() => {
      const current = this.get(id);
      if (!current || current.status === "cancelled") return { ok: false, reason: "not_found" } as const;
      if (this.hasConflict(startsAt, endsAt, id)) return { ok: false, reason: "conflict" } as const;
      this.db
        .prepare("UPDATE bookings SET starts_at = ?, ends_at = ?, status = 'pending', updated_at = ? WHERE id = ?")
        .run(startsAt, endsAt, iso(new Date()), id);
      return { ok: true, value: this.get(id)! } as const;
    });
  }

  async setStatus(id: string, status: BookingStatus, reason?: string): Promise<WriteResult<Booking>> {
    return this.tx(() => {
      const current = this.get(id);
      if (!current) return { ok: false, reason: "not_found" } as const;
      // Przywrócenie anulowanej rezerwacji nie może wejść na zajęty termin.
      if (current.status === "cancelled" && status !== "cancelled" && this.hasConflict(current.startsAt, current.endsAt, id)) {
        return { ok: false, reason: "conflict" } as const;
      }
      this.db
        .prepare("UPDATE bookings SET status = ?, cancel_reason = ?, updated_at = ? WHERE id = ?")
        .run(status, status === "cancelled" ? (reason ?? "") : null, iso(new Date()), id);
      return { ok: true, value: this.get(id)! } as const;
    });
  }

  async list(filter: { from?: Date; status?: BookingStatus }) {
    const rows = this.db
      .prepare("SELECT * FROM bookings WHERE ends_at > ? AND (? = '' OR status = ?) ORDER BY starts_at LIMIT 500")
      .all(iso(filter.from ?? new Date(0)), filter.status ?? "", filter.status ?? "") as Row[];
    return rows.map(toBooking);
  }

  async listBlocks(from: Date) {
    return (this.db.prepare("SELECT * FROM booking_blocks WHERE ends_at > ? ORDER BY starts_at").all(iso(from)) as Row[]).map(toBlock);
  }

  async addBlock(startsAt: string, endsAt: string, note: string) {
    const id = randomUUID();
    this.db.prepare("INSERT INTO booking_blocks (id, starts_at, ends_at, note, created_at) VALUES (?, ?, ?, ?, ?)").run(id, iso(startsAt), iso(endsAt), note, iso(new Date()));
    return toBlock(this.db.prepare("SELECT * FROM booking_blocks WHERE id = ?").get(id) as Row);
  }

  async removeBlock(id: string) {
    return Number(this.db.prepare("DELETE FROM booking_blocks WHERE id = ?").run(id).changes) > 0;
  }
}

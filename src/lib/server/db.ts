import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { getDbPath } from "./env";
import { seedDatabase } from "./seed";

/**
 * Baza wypożyczalni – SQLite wbudowany w Node.js (`node:sqlite`, Node 22.13+).
 * Wystarcza na serwerze z trwałym dyskiem (VPS, kontener z wolumenem). Na platformach serverless
 * podmień implementację w `repo.ts`/`bookings.ts` na bazę zewnętrzną (np. Postgres).
 *
 * Kwoty w groszach, momenty w milisekundach UTC.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS jetskis (
  id TEXT PRIMARY KEY,
  manufacturer TEXT,
  model TEXT,
  name TEXT NOT NULL,
  description TEXT,
  power_hp INTEGER CHECK (power_hp IS NULL OR power_hp > 0),
  seats INTEGER CHECK (seats IS NULL OR seats > 0),
  license TEXT NOT NULL DEFAULT 'unknown' CHECK (license IN ('none', 'required', 'unknown')),
  license_note TEXT,
  deposit_gr INTEGER CHECK (deposit_gr IS NULL OR deposit_gr >= 0),
  image TEXT,
  image_alt TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  needs_review INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS prices (
  jetski_id TEXT NOT NULL REFERENCES jetskis(id) ON DELETE CASCADE,
  duration_min INTEGER NOT NULL,
  price_gr INTEGER NOT NULL CHECK (price_gr > 0),
  PRIMARY KEY (jetski_id, duration_min)
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS customers_email_idx ON customers (email);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  jetski_id TEXT NOT NULL REFERENCES jetskis(id),
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  start_at INTEGER NOT NULL,
  end_at INTEGER NOT NULL,
  duration_min INTEGER NOT NULL,
  price_gr INTEGER NOT NULL,
  deposit_gr INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  customer_note TEXT,
  admin_note TEXT,
  cancel_token TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  terms_accepted_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  cancelled_at INTEGER,
  cancelled_by TEXT
);
CREATE INDEX IF NOT EXISTS bookings_time_idx ON bookings (jetski_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status, start_at);

CREATE TABLE IF NOT EXISTS blocks (
  id TEXT PRIMARY KEY,
  jetski_id TEXT REFERENCES jetskis(id) ON DELETE CASCADE,
  start_at INTEGER NOT NULL,
  end_at INTEGER NOT NULL CHECK (end_at > start_at),
  reason TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS opening_hours (
  weekday INTEGER PRIMARY KEY CHECK (weekday BETWEEN 0 AND 6),
  open TEXT,
  close TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

const globalForDb = globalThis as unknown as { kilwaterDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (!globalForDb.kilwaterDb) {
    const path = getDbPath();
    if (path !== ":memory:") mkdirSync(dirname(resolve(path)), { recursive: true });
    const db = new DatabaseSync(path);
    db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
    db.exec(SCHEMA);
    seedDatabase(db);
    globalForDb.kilwaterDb = db;
  }
  return globalForDb.kilwaterDb;
}

/** Tylko do testów: zamyka i zapomina bieżące połączenie. */
export function resetDbForTests(): void {
  globalForDb.kilwaterDb?.close();
  globalForDb.kilwaterDb = undefined;
}

/** Wykonuje funkcję w transakcji z blokadą zapisu (BEGIN IMMEDIATE) – chroni przed podwójną rezerwacją. */
export function withWriteTransaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn(db);
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

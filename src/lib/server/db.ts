import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { getDatabasePath } from "./env";

/**
 * Baza sklepu – SQLite wbudowany w Node.js (moduł `node:sqlite`, Node 22.13+):
 * zamówienia, sprzedane sztuki, konta klientów i sesje.
 *
 * Wystarcza na serwerze z trwałym dyskiem (VPS, kontener z wolumenem).
 * Na platformach serverless (np. Vercel) system plików jest ulotny – tam podmień
 * implementację na bazę zewnętrzną (np. Postgres), zachowując interfejsy modułów w `lib/server`.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled', 'failed', 'demo')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'demo')),
  user_id TEXT,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address_json TEXT NOT NULL,
  shipping_method TEXT NOT NULL,
  pickup_point TEXT,
  notes TEXT,
  items_json TEXT NOT NULL,
  subtotal_amount INTEGER NOT NULL CHECK (subtotal_amount > 0),
  shipping_amount INTEGER NOT NULL CHECK (shipping_amount >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  currency TEXT NOT NULL,
  stock_committed INTEGER NOT NULL DEFAULT 0,
  stripe_session_id TEXT UNIQUE,
  stripe_session_url TEXT,
  stripe_session_expires_at INTEGER,
  stripe_payment_intent_id TEXT,
  status_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  paid_at TEXT
);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status, payment_method);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at);

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_sold (
  sku TEXT PRIMARY KEY,
  sold INTEGER NOT NULL CHECK (sold >= 0)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  used_at TEXT
);
`;

const globalForDb = globalThis as unknown as { shopDb?: { path: string; db: DatabaseSync } };

export function getDb(): DatabaseSync {
  const path = getDatabasePath();
  if (globalForDb.shopDb?.path !== path) {
    if (path !== ":memory:") mkdirSync(dirname(resolve(path)), { recursive: true });
    const db = new DatabaseSync(path);
    db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
    db.exec(SCHEMA);
    globalForDb.shopDb = { path, db };
  }
  return globalForDb.shopDb.db;
}

/** Zamyka połączenie (używane w testach przy zmianie pliku bazy). */
export function closeDb(): void {
  globalForDb.shopDb?.db.close();
  globalForDb.shopDb = undefined;
}

let depth = 0;

/** Wykonuje funkcję w transakcji (BEGIN IMMEDIATE – blokada zapisu od początku). Zagnieżdżone wywołania dołączają do zewnętrznej. */
export function transaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  if (depth > 0) return fn(db);
  db.exec("BEGIN IMMEDIATE");
  depth++;
  try {
    const result = fn(db);
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    depth--;
  }
}

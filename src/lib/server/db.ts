import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { getOrdersDbPath } from "./env";

/**
 * Baza zamówień – SQLite wbudowany w Node.js (moduł `node:sqlite`, Node 22.13+).
 *
 * Wystarcza na serwerze z trwałym dyskiem (VPS, kontener z wolumenem).
 * Na platformach serverless (np. Vercel) system plików jest ulotny – tam podmień
 * implementację w `orders.ts` na bazę zewnętrzną (np. Postgres), zachowując ten sam interfejs.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled', 'failed')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  location_id TEXT NOT NULL,
  pickup_date TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  items_json TEXT NOT NULL,
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  currency TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_session_url TEXT,
  stripe_session_expires_at INTEGER,
  stripe_payment_intent_id TEXT,
  status_note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  paid_at TEXT
);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status, pickup_date);

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at TEXT NOT NULL
);
`;

const globalForDb = globalThis as unknown as { noirOrdersDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (!globalForDb.noirOrdersDb) {
    const path = getOrdersDbPath();
    if (path !== ":memory:") mkdirSync(dirname(resolve(path)), { recursive: true });
    const db = new DatabaseSync(path);
    db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
    db.exec(SCHEMA);
    globalForDb.noirOrdersDb = db;
  }
  return globalForDb.noirOrdersDb;
}

/** Wykonuje funkcję w transakcji (BEGIN IMMEDIATE – blokada zapisu od początku). */
export function transaction<T>(fn: (db: DatabaseSync) => T): T {
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

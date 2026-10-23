import "server-only";

import { createHash, randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { getDb, transaction } from "./db";

/**
 * Konta klientów: hasła haszowane scryptem, sesje w bazie (w ciasteczku tylko losowy token),
 * jednorazowe tokeny resetu hasła ważne 60 minut.
 */

export const SESSION_COOKIE = "kp_session";
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const RESET_TTL_SECONDS = 60 * 60;
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 } as const;

function scrypt(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => scryptCb(password, salt, keylen, options, (err, key) => (err ? reject(err) : resolve(key))));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, saltB64, keyB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const key = await scrypt(password.normalize("NFKC"), Buffer.from(saltB64, "base64"), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return key.length === expected.length && timingSafeEqual(key, expected);
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export interface User {
  id: string;
  email: string;
  firstName: string;
  createdAt: string;
}

type Row = Record<string, string | number | null>;
const toUser = (row: Row): User => ({ id: row.id as string, email: row.email as string, firstName: row.first_name as string, createdAt: row.created_at as string });

export function findUserByEmail(email: string): (User & { passwordHash: string }) | null {
  const row = getDb().prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase()) as Row | undefined;
  return row ? { ...toUser(row), passwordHash: row.password_hash as string } : null;
}

export class EmailTakenError extends Error {}

export async function createUser(input: { email: string; firstName: string; password: string }): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);
  return transaction((db) => {
    if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) throw new EmailTakenError();
    const user: User = { id: randomUUID(), email, firstName: input.firstName.trim(), createdAt: new Date().toISOString() };
    db.prepare("INSERT INTO users (id, email, first_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
      user.id,
      user.email,
      user.firstName,
      passwordHash,
      user.createdAt,
    );
    return user;
  });
}

/** Hash używany, gdy konto nie istnieje – czas odpowiedzi nie zdradza, czy e-mail jest zarejestrowany. */
let dummyHash: Promise<string> | null = null;

export async function authenticate(email: string, password: string): Promise<User | null> {
  const user = findUserByEmail(email);
  if (!user) {
    dummyHash ??= hashPassword("niepoprawne-haslo-0");
    await verifyPassword(password, await dummyHash);
    return null;
  }
  return (await verifyPassword(password, user.passwordHash)) ? { id: user.id, email: user.email, firstName: user.firstName, createdAt: user.createdAt } : null;
}

export function createSession(userId: string): { token: string; expiresAt: number } {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Math.floor(Date.now() / 1000));
  db.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)").run(sha256(token), userId, new Date().toISOString(), expiresAt);
  return { token, expiresAt };
}

export function userForSession(token: string | undefined | null): User | null {
  if (!token || token.length > 100) return null;
  const row = getDb()
    .prepare("SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?")
    .get(sha256(token), Math.floor(Date.now() / 1000)) as Row | undefined;
  return row ? toUser(row) : null;
}

export function deleteSession(token: string | undefined | null): void {
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}

/** Tworzy token resetu hasła (zwraca `null`, gdy konto nie istnieje). */
export function createPasswordReset(email: string): { token: string; user: User } | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  const token = randomBytes(32).toString("base64url");
  getDb()
    .prepare("INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .run(sha256(token), user.id, Math.floor(Date.now() / 1000) + RESET_TTL_SECONDS);
  return { token, user: { id: user.id, email: user.email, firstName: user.firstName, createdAt: user.createdAt } };
}

/** Ustawia nowe hasło na podstawie tokenu; unieważnia token i wszystkie sesje użytkownika. */
export async function resetPassword(token: string, password: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return transaction((db) => {
    const row = db
      .prepare("SELECT user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?")
      .get(sha256(token), Math.floor(Date.now() / 1000)) as Row | undefined;
    if (!row) return false;
    db.prepare("UPDATE password_resets SET used_at = ? WHERE token_hash = ?").run(new Date().toISOString(), sha256(token));
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, row.user_id);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);
    return true;
  });
}

import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getAdminPassword, getSessionSecret } from "./env";
import { errorResponse } from "./http";

/**
 * Sesja panelu administratora: podpisany (HMAC-SHA256) cookie httpOnly, SameSite=Strict.
 * Hasło i sekret pochodzą ze zmiennych ADMIN_PASSWORD i ADMIN_SESSION_SECRET.
 */

export const SESSION_COOKIE = "mj_admin";
const SESSION_HOURS = 12;

export type AdminConfigState = "ready" | "missing-password" | "missing-secret";

export function adminConfigState(): AdminConfigState {
  if (!getAdminPassword()) return "missing-password";
  if (!getSessionSecret()) return "missing-secret";
  return "ready";
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

export function checkPassword(candidate: string): boolean {
  const password = getAdminPassword();
  return !!password && safeEqual(candidate, password);
}

export function createSession(now = Date.now()): { value: string; maxAge: number } | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const expires = now + SESSION_HOURS * 3_600_000;
  const payload = `admin.${expires}`;
  return { value: `${payload}.${sign(payload, secret)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySession(value: string | undefined, now = Date.now()): boolean {
  const secret = getSessionSecret();
  if (!secret || !value || !getAdminPassword()) return false;
  const [role, expires, signature] = value.split(".");
  if (role !== "admin" || !expires || !signature) return false;
  if (!(Number(expires) > now)) return false;
  return safeEqual(signature, sign(`${role}.${expires}`, secret));
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** Żądania zmieniające dane muszą pochodzić z tej samej strony (ochrona przed CSRF). */
export function sameOrigin(request: Request): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Zwraca odpowiedź błędu, gdy żądanie nie pochodzi od zalogowanego administratora. */
export function requireAdmin(request: Request): Response | null {
  if (!sameOrigin(request)) return errorResponse(403, "forbidden", "Żądanie spoza panelu zostało odrzucone.");
  if (!verifySession(readCookie(request, SESSION_COOKIE))) return errorResponse(401, "unauthorized", "Sesja wygasła. Zaloguj się ponownie.");
  return null;
}

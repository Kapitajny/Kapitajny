import "server-only";

import { cookies } from "next/headers";
import { env } from "./env";
import { hmac, safeEqual } from "./security";

export const ADMIN_COOKIE = "rift_admin";
const SESSION_HOURS = 12;

/** Panel działa tylko z ustawionym hasłem i sekretem sesji (min. 32 znaki). */
export const isAdminConfigured = () => env.adminPassword().length >= 10 && env.adminSecret().length >= 32;

export const checkPassword = (password: string) => isAdminConfigured() && safeEqual(password, env.adminPassword());

export function createSessionValue(now = Date.now()): { value: string; maxAge: number } {
  const exp = String(now + SESSION_HOURS * 3600_000);
  return { value: `${exp}.${hmac(env.adminSecret(), exp)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySessionValue(value: string | undefined, now = Date.now()): boolean {
  if (!value || !isAdminConfigured()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < now) return false;
  return safeEqual(sig, hmac(env.adminSecret(), exp));
}

export async function isAdminRequest(): Promise<boolean> {
  return verifySessionValue((await cookies()).get(ADMIN_COOKIE)?.value);
}

export const sessionCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

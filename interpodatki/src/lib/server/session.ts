import "server-only";
import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE_NAME as DEMO_SESSION_COOKIE } from "@/lib/cookies";
import { serverEnv } from "./env";

/**
 * Anonimowa sesja demonstracyjna – losowy identyfikator w ciasteczku httpOnly.
 * Wiąże zamówienia i zgłoszenia z przeglądarką, w której je utworzono. To NIE jest logowanie.
 */
const MAX_AGE = 6 * 60 * 60;
const VALID = /^[a-f0-9]{32}$/;

export async function readDemoSession(): Promise<string | null> {
  const value = (await cookies()).get(DEMO_SESSION_COOKIE)?.value;
  return value && VALID.test(value) ? value : null;
}

export async function ensureDemoSession(): Promise<string> {
  const existing = await readDemoSession();
  if (existing) return existing;
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  (await cookies()).set(DEMO_SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: serverEnv.isProduction,
    path: "/",
    maxAge: MAX_AGE,
  });
  return id;
}

import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, userForSession, type User } from "./auth";
import { isProduction } from "./env";

/** Zalogowany użytkownik na podstawie ciasteczka sesji (lub `null`). */
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return userForSession(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<string | undefined> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  store.delete(SESSION_COOKIE);
  return token;
}

import "server-only";
import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16 * 1024;

export function jsonError(status: number, message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
}

export function jsonOk(data: Record<string, unknown>, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Odrzuca żądania z obcych domen (ochrona przed CSRF dla endpointów zmieniających stan). */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export type ParsedBody = { ok: true; body: Record<string, unknown> } | { ok: false; response: NextResponse };

/** Odczytuje JSON z limitem rozmiaru i kontrolą nagłówka Content-Type. */
export async function readJsonBody(request: Request): Promise<ParsedBody> {
  if (!isSameOrigin(request)) return { ok: false, response: jsonError(403, "Żądanie z niedozwolonej domeny.") };
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, response: jsonError(415, "Oczekiwano danych w formacie JSON.") };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return { ok: false, response: jsonError(413, "Przesłane dane są zbyt duże.") };
  }
  try {
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
    return { ok: true, body: body as Record<string, unknown> };
  } catch {
    return { ok: false, response: jsonError(400, "Nieprawidłowy format danych.") };
  }
}

export function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

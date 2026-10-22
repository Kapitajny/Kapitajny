import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { HONEYPOT_FIELD, MAX_FORM_AGE_MS, MIN_FILL_MS, STARTED_AT_FIELD, checkSpam } from "@/lib/contact/spam";

function form(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

describe("checkSpam", () => {
  const now = 1_000_000_000;

  it("przepuszcza formularz wypełniony w rozsądnym czasie", () => {
    expect(checkSpam(form({ [STARTED_AT_FIELD]: String(now - 20_000), [HONEYPOT_FIELD]: "" }), now)).toEqual({ ok: true });
  });

  it("odrzuca wypełnione pole-pułapkę", () => {
    expect(checkSpam(form({ [STARTED_AT_FIELD]: String(now - 20_000), [HONEYPOT_FIELD]: "https://spam.example" }), now)).toEqual({
      ok: false,
      reason: "honeypot",
    });
  });

  it("odrzuca zbyt szybkie, przeterminowane i pozbawione znacznika czasu zgłoszenia", () => {
    expect(checkSpam(form({ [STARTED_AT_FIELD]: String(now - MIN_FILL_MS + 1) }), now)).toMatchObject({ reason: "too-fast" });
    expect(checkSpam(form({ [STARTED_AT_FIELD]: String(now - MAX_FORM_AGE_MS - 1) }), now)).toMatchObject({ reason: "expired" });
    expect(checkSpam(form({}), now)).toMatchObject({ reason: "missing-timestamp" });
    expect(checkSpam(form({ [STARTED_AT_FIELD]: "abc" }), now)).toMatchObject({ reason: "missing-timestamp" });
  });
});

describe("createRateLimiter", () => {
  it("blokuje po przekroczeniu limitu i zwalnia po upływie okna", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("ip", 0).allowed).toBe(true);
    expect(limiter.check("ip", 100).allowed).toBe(true);
    const blocked = limiter.check("ip", 200);
    expect(blocked).toEqual({ allowed: false, retryAfterMs: 800 });
    expect(limiter.check("inny-ip", 200).allowed).toBe(true);
    expect(limiter.check("ip", 1001).allowed).toBe(true);
  });

  it("ogranicza liczbę przechowywanych kluczy", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 10_000, maxKeys: 2 });
    limiter.check("a", 0);
    limiter.check("b", 0);
    limiter.check("c", 0);
    // Najstarszy klucz „a” został usunięty, więc kolejne żądanie jest dozwolone.
    expect(limiter.check("a", 1).allowed).toBe(true);
    expect(limiter.check("c", 1).allowed).toBe(false);
  });
});

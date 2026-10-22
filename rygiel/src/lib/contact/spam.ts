/** Podstawowa ochrona przed automatami: pole-pułapka i minimalny czas wypełniania formularza. */

export const HONEYPOT_FIELD = "strona_www";
export const STARTED_AT_FIELD = "rozpoczeto";

export const MIN_FILL_MS = 3_000;
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

export type SpamVerdict = { ok: true } | { ok: false; reason: "honeypot" | "too-fast" | "expired" | "missing-timestamp" };

export function checkSpam(formData: FormData, now: number = Date.now()): SpamVerdict {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: false, reason: "honeypot" };

  const startedRaw = formData.get(STARTED_AT_FIELD);
  const startedAt = typeof startedRaw === "string" ? Number(startedRaw) : Number.NaN;
  if (!Number.isFinite(startedAt) || startedAt <= 0) return { ok: false, reason: "missing-timestamp" };

  const elapsed = now - startedAt;
  if (elapsed < MIN_FILL_MS) return { ok: false, reason: "too-fast" };
  if (elapsed > MAX_FORM_AGE_MS) return { ok: false, reason: "expired" };
  return { ok: true };
}

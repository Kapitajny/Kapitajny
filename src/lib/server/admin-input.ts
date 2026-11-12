import "server-only";

import { DURATIONS, type Duration, type LicenseRequirement } from "@/lib/rental";
import { isTime } from "@/lib/time";
import { cleanMultiline, cleanText } from "@/lib/validation";
import type { JetskiInput } from "./repo";

/** Kwota w złotych (np. "250" lub "249,50") → grosze. Pusta wartość → null. */
export function parseMoney(value: unknown): number | null | "invalid" {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return "invalid";
  return Math.round(n * 100);
}

function optInt(value: unknown, min: number, max: number): number | null | "invalid" {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : "invalid";
}

const IMAGE_PATH = /^\/(images\/[a-z0-9/_-]+|media\/[a-f0-9-]+)\.(jpe?g|png|webp|avif)$/i;

export function parseJetski(body: Record<string, unknown>): { value?: JetskiInput; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const manufacturer = cleanText(body.manufacturer, 60) || null;
  const model = cleanText(body.model, 60) || null;
  const name = cleanText(body.name, 80) || [manufacturer, model].filter(Boolean).join(" ");
  if (!name) errors.name = "Podaj nazwę wyświetlaną lub producenta i model.";
  const powerHp = optInt(body.powerHp, 1, 600);
  if (powerHp === "invalid") errors.powerHp = "Moc podaj jako liczbę całkowitą KM.";
  const seats = optInt(body.seats, 1, 6);
  if (seats === "invalid") errors.seats = "Liczba miejsc: 1–6.";
  const license = ["none", "required", "unknown"].includes(String(body.license)) ? (body.license as LicenseRequirement) : "unknown";
  const licenseNote = cleanMultiline(body.licenseNote, 600) || null;
  if (license === "none" && !licenseNote) errors.licenseNote = "Dla skutera bez patentu opisz warunki i podstawę prawną – klient zobaczy je przy rezerwacji.";
  const depositGr = parseMoney(body.deposit);
  if (depositGr === "invalid") errors.deposit = "Kaucję podaj w złotych, np. 1000.";
  const image = cleanText(body.image, 200) || null;
  if (image && !IMAGE_PATH.test(image)) errors.image = "Nieprawidłowa ścieżka zdjęcia – wgraj plik ponownie.";
  const imageAlt = cleanText(body.imageAlt, 200) || null;
  if (image && !imageAlt) errors.imageAlt = "Opisz zdjęcie (tekst alternatywny dla osób niewidomych).";
  const sort = optInt(body.sort, 0, 999);
  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    value: {
      manufacturer,
      model,
      name,
      description: cleanMultiline(body.description, 900) || null,
      powerHp: powerHp as number | null,
      seats: seats as number | null,
      license,
      licenseNote,
      depositGr: depositGr as number | null,
      image,
      imageAlt,
      active: body.active !== false,
      needsReview: body.needsReview === true,
      sort: (sort as number | null) ?? 0,
    },
  };
}

export function parsePrices(body: unknown): { value?: Partial<Record<Duration, number | null>>; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const out: Partial<Record<Duration, number | null>> = {};
  if (!body || typeof body !== "object") return { errors: { prices: "Brak cen." } };
  for (const d of DURATIONS) {
    if (!(String(d) in body)) continue;
    const v = parseMoney((body as Record<string, unknown>)[String(d)]);
    if (v === "invalid" || v === 0) errors[String(d)] = "Podaj kwotę większą od zera albo zostaw puste.";
    else out[d] = v;
  }
  return Object.keys(errors).length ? { errors } : { value: out, errors };
}

export function parseHours(body: unknown): { value?: { weekday: number; open: string | null; close: string | null }[]; error?: string } {
  if (!Array.isArray(body) || body.length !== 7) return { error: "Podaj godziny dla wszystkich dni tygodnia." };
  const out = [];
  for (const day of body as Record<string, unknown>[]) {
    const weekday = Number(day.weekday);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) return { error: "Nieprawidłowy dzień tygodnia." };
    if (day.closed === true || (!day.open && !day.close)) {
      out.push({ weekday, open: null, close: null });
      continue;
    }
    if (!isTime(day.open) || !isTime(day.close) || day.close <= day.open) return { error: "Godzina zamknięcia musi być późniejsza niż otwarcia." };
    out.push({ weekday, open: day.open, close: day.close });
  }
  return { value: out };
}

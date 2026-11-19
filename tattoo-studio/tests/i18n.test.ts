import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BUDGET_IDS, PLACEMENT_IDS, SIDE_IDS, SIZE_IDS, STYLE_OPTIONS, TIME_IDS } from "@/config/booking";
import { PRICING } from "@/config/pricing";
import { SPECIALTIES } from "@/config/specialties";
import { WORK, WORK_STYLES } from "@/config/work";
import { LOCALES, ROUTES, localizedPath, routeFromPath } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { pl, type Dictionary } from "@/i18n/dictionaries/pl";
import { legalEn } from "@/i18n/legal/en";
import { legalPl } from "@/i18n/legal/pl";
import type { FieldErrorCodes } from "@/lib/booking/schema";

/** Wszystkie teksty słownika (funkcje wywołane z przykładowymi argumentami). */
function strings(value: unknown, path = ""): { path: string; text: string }[] {
  if (typeof value === "string") return [{ path, text: value }];
  if (typeof value === "function") {
    const args = Array.from({ length: value.length }, (_, i) => (i === 0 ? 3 : "Przykład"));
    return [{ path, text: String(value(...args)) }];
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value)
      .filter(([k]) => k !== "id") // identyfikatory techniczne nie są wyświetlane
      .flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  return [];
}

/** Struktura słownika (klucze, długości list, typy) — musi być identyczna w każdym języku. */
function shape(value: unknown): unknown {
  if (typeof value === "function") return "fn";
  if (typeof value === "string") return "str";
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  return typeof value;
}

describe("słowniki PL/EN", () => {
  it("mają identyczną strukturę", () => {
    expect(shape(en)).toEqual(shape(pl));
    expect(shape(legalEn)).toEqual(shape(legalPl));
  });

  it("nie zawierają pustych tekstów", () => {
    for (const dict of [pl, en] as Dictionary[]) {
      for (const { path, text } of strings(dict)) expect(text.trim(), path).not.toBe("");
    }
  });

  it("tłumaczą każdą pracę, styl, specjalizację i opcję formularza", () => {
    for (const dict of [pl, en] as Dictionary[]) {
      for (const work of WORK) expect(dict.work.items[work.id]?.title).toBeTruthy();
      for (const style of WORK_STYLES) expect(dict.gallery.styles[style]).toBeTruthy();
      for (const s of SPECIALTIES) expect(dict.specialties.items[s.id]?.name).toBeTruthy();
      for (const o of STYLE_OPTIONS) expect(dict.booking.options.styles[o.id]?.label).toBeTruthy();
      for (const id of PLACEMENT_IDS) expect(dict.booking.options.placements[id]).toBeTruthy();
      for (const id of SIDE_IDS) expect(dict.booking.options.sides[id]).toBeTruthy();
      for (const id of SIZE_IDS) expect(dict.booking.options.sizes[id]?.label).toBeTruthy();
      for (const id of BUDGET_IDS) expect(dict.booking.options.budgets[id]).toBeTruthy();
      for (const id of TIME_IDS) expect(dict.booking.options.times[id]).toBeTruthy();
      for (const s of PRICING.sizes) expect(dict.pricing.sizes[s.id]?.label).toBeTruthy();
      for (const p of PRICING.placements) expect(dict.pricing.placements[p.id]).toBeTruthy();
    }
  });

  it("mają komunikat dla każdego kodu błędu walidacji", () => {
    const codes: { [K in keyof FieldErrorCodes]: FieldErrorCodes[K][] } = {
      fullName: ["required", "tooShort", "tooLong"],
      email: ["required", "invalid"],
      phone: ["invalid", "requiredForPhone"],
      contactMethod: ["required"],
      description: ["required", "tooShort", "tooLong"],
      meaning: ["tooLong"],
      firstTattoo: ["required"],
      designType: ["required"],
      styles: ["required", "invalid"],
      placement: ["required"],
      placementNote: ["tooLong"],
      side: ["required"],
      size: ["required"],
      budget: ["required"],
      preferredDate: ["invalid", "past", "tooFar"],
      preferredTime: ["required"],
      privacyAccepted: ["required"],
      accuracyConfirmed: ["required"],
    };
    for (const dict of [pl, en] as Dictionary[]) {
      for (const [field, list] of Object.entries(codes)) {
        for (const code of list) expect((dict.booking.errors as Record<string, Record<string, string>>)[field][code], `${field}.${code}`).toBeTruthy();
      }
    }
  });

  it("polski słownik nie zawiera angielskich napisów interfejsu", () => {
    const english =
      /\b(the|and|your|our|you|with|book|booking|gallery|step|continue|previous|submit|edit|next|prev|contact|about|pricing|reviews?|specialties|optional|choose|work|size|budget|privacy|policy|terms|search|close|black|grey|fine line|placement|details|concept|upload|images?|please|thank|home)\b/i;
    // Nazwy własne i terminy japońskie/francuskie są dozwolone.
    const allowed = /C'est la vie|Instagram/;
    const offenders = [...strings(pl), ...strings(legalPl)].filter(({ text }) => english.test(text.replace(allowed, "").replace(/\{\{[^}]+\}\}/g, "")));
    expect(offenders).toEqual([]);
  });
});

describe("adresy językowe", () => {
  it("każda strona ma adres w każdym języku i da się ją rozpoznać po adresie", () => {
    for (const route of Object.keys(ROUTES) as (keyof typeof ROUTES)[]) {
      for (const locale of LOCALES) {
        expect(routeFromPath(localizedPath(route, locale))).toEqual({ route, locale });
      }
    }
    expect(localizedPath("home", "en", "gallery")).toBe("/en#gallery");
    expect(localizedPath("booking", "pl", undefined, "size=large")).toBe("/rezerwacja?size=large");
    expect(routeFromPath("/nieistniejaca")).toBeNull();
  });
});

describe("fonty", () => {
  it("podzbiory fontów zawierają każdy znak japoński użyty w kodzie", () => {
    const included = new Set<string>(JSON.parse(readFileSync(join(__dirname, "../src/app/fonts/glyphs.json"), "utf8")).japanese);
    const isJapanese = (ch: string) => {
      const cp = ch.codePointAt(0)!;
      return (cp >= 0x3000 && cp <= 0x30ff) || (cp >= 0x3400 && cp <= 0x9fff) || (cp >= 0xf900 && cp <= 0xfaff) || (cp >= 0xff00 && cp <= 0xffef);
    };
    const missing = new Set<string>();
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.(ts|tsx|css)$/.test(name)) for (const ch of readFileSync(path, "utf8")) if (isJapanese(ch) && !included.has(ch)) missing.add(ch);
      }
    };
    walk(join(__dirname, "../src"));
    // Brakujące znaki: uruchom `python3 scripts/subset-fonts.py <katalog z fontami>`.
    expect([...missing]).toEqual([]);
  });
});

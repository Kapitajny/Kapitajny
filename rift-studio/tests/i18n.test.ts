import { describe, expect, it } from "vitest";
import pl from "@/i18n/dictionaries/pl";
import en from "@/i18n/dictionaries/en";
import { legal } from "@/content/legal";
import { switchLocalePath, legalHref } from "@/i18n/routes";
import { localePath } from "@/i18n/config";

/** Kształt obiektu: klucze, typy i długości list – bez wartości tekstów. */
function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]));
  return typeof v;
}

function strings(v: unknown, path = ""): [string, string][] {
  if (typeof v === "string") return [[path, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => strings(x, `${path}[${i}]`));
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => strings(x, path ? `${path}.${k}` : k));
  return [];
}

describe("tłumaczenia", () => {
  it("EN ma dokładnie ten sam kształt co PL (klucze i długości list)", () => {
    expect(shape(en)).toEqual(shape(pl));
  });

  it("żaden tekst nie jest pusty, a zmienne {x} są zgodne", () => {
    const enMap = new Map(strings(en));
    for (const [path, text] of strings(pl)) {
      expect(text.trim(), path).not.toBe("");
      const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      expect(vars(enMap.get(path) ?? ""), path).toEqual(vars(text));
    }
  });

  it("dokumenty prawne istnieją w obu językach z tą samą liczbą sekcji", () => {
    for (const doc of Object.keys(legal.pl) as (keyof typeof legal.pl)[]) {
      expect(legal.en[doc].sections.length, doc).toBe(legal.pl[doc].sections.length);
    }
  });
});

describe("adresy językowe", () => {
  it("PL bez prefiksu, EN z /en", () => {
    expect(localePath("pl", "/")).toBe("/");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/admin")).toBe("/en/admin");
  });

  it("przełącznik języka tłumaczy adresy dokumentów", () => {
    expect(switchLocalePath("/", "pl", "en")).toBe("/en");
    expect(switchLocalePath("/en", "en", "pl")).toBe("/");
    expect(switchLocalePath("/regulamin-rezerwacji", "pl", "en")).toBe(legalHref("en", "booking"));
    expect(switchLocalePath("/en/privacy-policy", "en", "pl")).toBe("/polityka-prywatnosci");
    expect(switchLocalePath("/rezerwacja/abc", "pl", "en")).toBe("/en/rezerwacja/abc");
    // ścieżka wewnętrzna po przepisaniu przez proxy
    expect(switchLocalePath("/pl/regulamin-rezerwacji", "pl", "en")).toBe("/en/booking-terms");
    expect(switchLocalePath("/pl", "pl", "en")).toBe("/en");
  });
});

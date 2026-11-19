import type pl from "./dictionaries/pl";
import type { Locale } from "./config";

/** Kształt słownika wyprowadzony z PL; literały zamienione na `string`, żeby EN mógł mieć własne teksty. */
type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? Widen<U>[] : { [K in keyof T]: Widen<T[K]> };
export type Dictionary = Widen<typeof pl>;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  pl: () => import("./dictionaries/pl").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export const getDictionary = (lang: Locale) => loaders[lang]();

/** Podstawia zmienne `{nazwa}` w tekście. */
export const fmt = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));

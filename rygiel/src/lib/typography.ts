const NBSP = "\u00A0";

// Jednoliterowe spójniki i przyimki nie powinny zostawać na końcu wiersza (zasada polskiej typografii).
// Lookbehind nie „zjada” poprzedzającego znaku, więc sąsiadujące spójniki („a w domu”) obsługuje jeden przebieg.
const ORPHAN = /(?<=^|[\s(„"])([aiouwzAIOUWZ])[^\S\u00A0]+/g;
// Półpauza nie powinna rozpoczynać wiersza.
const DASH = /\s+–/g;

export function typeset(text: string): string {
  return text.replace(ORPHAN, `$1${NBSP}`).replace(DASH, `${NBSP}–`);
}

/** Stosuje typeset do wszystkich tekstów w strukturze treści (obiekty, tablice). */
export function typesetDeep<T>(value: T): T {
  if (typeof value === "string") return typeset(value) as T;
  if (Array.isArray(value)) return value.map((item) => typesetDeep(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typesetDeep(item)])) as T;
  }
  return value;
}

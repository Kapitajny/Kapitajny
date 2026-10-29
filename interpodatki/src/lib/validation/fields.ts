/** Wspólne reguły walidacji pól – te same w przeglądarce i w API. Komunikaty po polsku. */

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

export type ValidationResult<T, K extends string = string> =
  | { ok: true; data: T }
  | { ok: false; errors: FieldErrors<K> };

// Usuwa znaki sterujące (poza nową linią i tabulatorem) i nadmiarowe spacje na końcach.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

export function checkName(value: string): string | undefined {
  if (!value) return "Podaj imię.";
  if (value.length < 2) return "Imię powinno mieć co najmniej 2 znaki.";
  if (value.length > 60) return "Imię może mieć maksymalnie 60 znaków.";
  if (/[<>{}$\d]/.test(value)) return "Imię może zawierać tylko litery, spacje i myślniki.";
  return undefined;
}

export function checkEmail(value: string): string | undefined {
  if (!value) return "Podaj adres e-mail.";
  if (value.length > 120 || !EMAIL.test(value)) return "Wpisz poprawny adres e-mail, np. jan@firma.pl.";
  return undefined;
}

export function checkPhone(value: string): string | undefined {
  if (!value) return undefined;
  if (!/^\+?[\d\s()-]+$/.test(value)) return "Numer telefonu może zawierać cyfry, spacje, nawiasy i znak +.";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) return "Numer telefonu powinien mieć od 9 do 15 cyfr.";
  return undefined;
}

export function checkOptionalText(value: string, max: number, label: string): string | undefined {
  if (value.length > max) return `${label} może mieć maksymalnie ${max} znaków.`;
  if (/[<>]/.test(value)) return `${label} nie może zawierać znaków < ani >.`;
  return undefined;
}

export function checkInteger(value: unknown, min: number, max: number, label: string): string | undefined {
  if (value === "" || value === null || value === undefined) return `Podaj ${label}.`;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n)) return `${capitalize(label)} musi być liczbą całkowitą.`;
  if (n < min || n > max) return `${capitalize(label)}: wpisz wartość od ${min} do ${max}.`;
  return undefined;
}

export function toInt(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

export function oneOfOrEmpty<T extends string>(list: readonly T[], value: unknown): T | "" {
  return typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T) : "";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}

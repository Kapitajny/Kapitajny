/** Walidacja danych od klienta – wspólna dla formularzy w przeglądarce i API na serwerze. */

export type FieldErrors = Partial<Record<string, string>>;

export function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export function cleanMultiline(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, max) : "";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return value.length <= 160 && EMAIL.test(value);
}

/** Akceptuje numery polskie (9 cyfr) i międzynarodowe z „+”. Zwraca znormalizowaną postać lub null. */
export function normalizePhone(value: string): string | null {
  const compact = value.replace(/[\s().-]/g, "");
  if (/^\d{9}$/.test(compact)) return `+48${compact}`;
  if (/^\+\d{8,15}$/.test(compact)) return compact;
  if (/^00\d{8,15}$/.test(compact)) return `+${compact.slice(2)}`;
  return null;
}

export interface ContactFields {
  name: string;
  email: string;
  phone: string;
}

export function validateContact(input: { name?: unknown; email?: unknown; phone?: unknown }): { value: ContactFields; errors: FieldErrors } {
  const name = cleanText(input.name, 80);
  const email = cleanText(input.email, 160).toLowerCase();
  const phoneRaw = cleanText(input.phone, 30);
  const phone = normalizePhone(phoneRaw);
  const errors: FieldErrors = {};
  if (name.length < 3 || !/\s/.test(name)) errors.name = "Podaj imię i nazwisko.";
  if (!isEmail(email)) errors.email = "Podaj poprawny adres e-mail, np. jan@example.com.";
  if (!phone) errors.phone = "Podaj numer telefonu, np. 600 100 200.";
  return { value: { name, email, phone: phone ?? phoneRaw }, errors };
}

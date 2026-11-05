import { budgetOptions, serviceOptions, type BudgetValue, type ServiceValue } from "@/data/offer";

/** Dane formularza kontaktowego – wspólne reguły dla przeglądarki i serwera. */
export type ContactInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: ServiceValue;
  budget: BudgetValue | "";
  message: string;
  privacy: true;
  /** Slug koncepcji z portfolio, z której klient przeszedł do formularza (opcjonalnie). */
  reference: string;
};

export type ContactField = "name" | "company" | "email" | "phone" | "service" | "budget" | "message" | "privacy";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = { name: 100, company: 120, email: 254, phone: 30, message: 5000, messageMin: 20, reference: 60 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{7,}$/;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function validateEmail(value: string): string | null {
  if (!value) return "Podaj adres e-mail – na niego wyślemy odpowiedź.";
  if (value.length > LIMITS.email || !EMAIL_PATTERN.test(value)) return "Sprawdź adres e-mail – powinien wyglądać jak nazwa@domena.pl.";
  return null;
}

/**
 * Sprawdza dane formularza. Zwraca oczyszczone dane albo komunikaty błędów przypisane do pól –
 * te same komunikaty pokazujemy pod polami w przeglądarce i zwracamy z API.
 */
export function validateContact(raw: unknown): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: ContactErrors = {};

  const name = text(input.name).replace(/\s+/g, " ");
  if (!name) errors.name = "Podaj imię i nazwisko.";
  else if (name.length < 2) errors.name = "Imię i nazwisko jest za krótkie.";
  else if (name.length > LIMITS.name) errors.name = `Imię i nazwisko może mieć najwyżej ${LIMITS.name} znaków.`;

  const company = text(input.company);
  if (company.length > LIMITS.company) errors.company = `Nazwa firmy może mieć najwyżej ${LIMITS.company} znaków.`;

  const email = text(input.email).toLowerCase();
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const phone = text(input.phone);
  if (phone && (phone.length > LIMITS.phone || !PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 9)) {
    errors.phone = "Sprawdź numer telefonu, np. 600 000 000 lub +48 600 000 000.";
  }

  const service = text(input.service) as ServiceValue;
  if (!serviceOptions.some((option) => option.value === service)) errors.service = "Wybierz, czego dotyczy zapytanie.";

  const budget = text(input.budget) as BudgetValue | "";
  if (budget && !budgetOptions.some((option) => option.value === budget)) errors.budget = "Wybierz budżet z listy.";

  const message = text(input.message);
  if (!message) errors.message = "Opowiedz krótko o swoim projekcie.";
  else if (message.length < LIMITS.messageMin) errors.message = `Opisz projekt w kilku zdaniach (co najmniej ${LIMITS.messageMin} znaków).`;
  else if (message.length > LIMITS.message) errors.message = `Opis może mieć najwyżej ${LIMITS.message} znaków.`;

  if (input.privacy !== true) errors.privacy = "Potwierdź zapoznanie się z polityką prywatności.";

  const reference = text(input.reference).slice(0, LIMITS.reference).replace(/[^a-z0-9-]/g, "");

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, company, email, phone, service, budget, message, privacy: true, reference } };
}

export const PRIVACY_TEXT = "Zapoznałem(-am) się z polityką prywatności i wiem, w jakim celu przetwarzane będą moje dane.";

export function labelOf(list: readonly { value: string; label: string }[], value: string): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

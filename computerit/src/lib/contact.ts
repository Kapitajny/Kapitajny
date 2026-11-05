import { budgets, projectTypes, type Budget, type ProjectType } from "@/data/offer";

/** Dane formularza kontaktowego – wspólne dla przeglądarki i serwera. */
export type ContactInput = {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType;
  budget: Budget;
  message: string;
  consent: true;
};

export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = { name: 80, email: 254, company: 120, message: 4000, messageMin: 20 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/**
 * Sprawdza dane formularza. Zwraca oczyszczone dane albo listę błędów przypisanych do pól.
 * Komunikaty mówią, co poprawić – są wyświetlane bezpośrednio pod polami.
 */
export function validateContact(raw: unknown): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: ContactErrors = {};

  const name = text(input.name);
  if (!name) errors.name = "Podaj swoje imię.";
  else if (name.length > LIMITS.name) errors.name = `Imię może mieć najwyżej ${LIMITS.name} znaków.`;

  const email = text(input.email).toLowerCase();
  if (!email) errors.email = "Podaj adres e-mail, na który mam odpowiedzieć.";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) errors.email = "Sprawdź adres e-mail – wygląda na niepełny.";

  const company = text(input.company);
  if (company.length > LIMITS.company) errors.company = `Nazwa firmy może mieć najwyżej ${LIMITS.company} znaków.`;

  const projectType = text(input.projectType) as ProjectType;
  if (!projectTypes.some((type) => type.value === projectType)) errors.projectType = "Wybierz rodzaj projektu.";

  const budget = text(input.budget) as Budget;
  if (!budgets.some((option) => option.value === budget)) errors.budget = "Wybierz przybliżony budżet.";

  const message = text(input.message);
  if (message.length < LIMITS.messageMin) errors.message = `Opisz projekt w kilku zdaniach (co najmniej ${LIMITS.messageMin} znaków).`;
  else if (message.length > LIMITS.message) errors.message = `Wiadomość może mieć najwyżej ${LIMITS.message} znaków.`;

  if (input.consent !== true) errors.consent = "Zaznacz zgodę – bez niej nie mogę odpowiedzieć na zapytanie.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, company, projectType, budget, message, consent: true } };
}

export const CONSENT_TEXT =
  "Wyrażam zgodę na przetwarzanie podanych danych w celu odpowiedzi na zapytanie i przygotowania oferty.";

export function labelOf(list: readonly { value: string; label: string }[], value: string): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

/** Walidacja formularza kontaktowego – ta sama logika działa w przeglądarce i na serwerze. */

export const serviceOptions = [
  { value: "obsluga-it", label: "Obsługa IT" },
  { value: "cyberbezpieczenstwo", label: "Cyberbezpieczeństwo" },
  { value: "chmura-i-infrastruktura", label: "Chmura i infrastruktura" },
  { value: "inne", label: "Wdrożenie, konsultacja lub szkolenie" },
  { value: "nie-wiem", label: "Jeszcze nie wiem" },
] as const;

export const scopeOptions = [
  { value: "konsultacja", label: "Jednorazowa konsultacja" },
  { value: "projekt", label: "Projekt z określonym końcem" },
  { value: "stala-wspolpraca", label: "Stała współpraca" },
  { value: "nie-wiem", label: "Trudno powiedzieć" },
] as const;

export type ServiceValue = (typeof serviceOptions)[number]["value"];
export type ScopeValue = (typeof scopeOptions)[number]["value"];

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  company: { max: 120 },
  message: { min: 20, max: 3000 },
} as const;

export type ContactField = "name" | "email" | "company" | "service" | "scope" | "message" | "consent";

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  service: string;
  scope: string;
  message: string;
  consent: boolean;
};

export type ContactData = {
  name: string;
  email: string;
  company: string | null;
  service: ServiceValue;
  scope: ScopeValue | null;
  message: string;
};

export type FieldErrors = Partial<Record<ContactField, string>>;

export type ValidationResult = { ok: true; data: ContactData } | { ok: false; errors: FieldErrors };

// Praktyczna walidacja adresu: część lokalna, @, domena z kropką i TLD min. 2 znaki, bez spacji.
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;

/** Usuwa znaki sterujące (poza nową linią i tabulatorem w treści) i normalizuje zapis Unicode. */
export function cleanText(value: unknown, { multiline = false } = {}): string {
  if (typeof value !== "string") return "";
  const normalized = value.normalize("NFC").replace(/\r\n?/g, "\n");
  const stripped = multiline ? normalized.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : normalized.replace(/[\u0000-\u001F\u007F]/g, " ");
  return (multiline ? stripped.replace(/\n{4,}/g, "\n\n\n") : stripped.replace(/\s+/g, " ")).trim();
}

export function validateField(field: ContactField, input: ContactInput): string | undefined {
  switch (field) {
    case "name": {
      const value = input.name.trim();
      if (!value) return "Podaj imię, żebyśmy wiedzieli, jak się do Ciebie zwracać.";
      if (value.length < LIMITS.name.min) return "Imię powinno mieć co najmniej 2 znaki.";
      if (value.length > LIMITS.name.max) return `Imię może mieć najwyżej ${LIMITS.name.max} znaków.`;
      return undefined;
    }
    case "email": {
      const value = input.email.trim();
      if (!value) return "Podaj adres e-mail, na który mamy odpowiedzieć.";
      if (value.length > LIMITS.email.max || !EMAIL.test(value)) return "Sprawdź adres e-mail – powinien mieć postać nazwa@firma.pl.";
      return undefined;
    }
    case "company":
      return input.company.trim().length > LIMITS.company.max ? `Nazwa firmy może mieć najwyżej ${LIMITS.company.max} znaków.` : undefined;
    case "service":
      return serviceOptions.some((option) => option.value === input.service) ? undefined : "Wybierz usługę, której dotyczy zapytanie.";
    case "scope":
      return input.scope === "" || scopeOptions.some((option) => option.value === input.scope) ? undefined : "Wybierz zakres z listy.";
    case "message": {
      const length = input.message.trim().length;
      if (length === 0) return "Opisz krótko problem lub potrzebę.";
      if (length < LIMITS.message.min) return `Napisz trochę więcej – co najmniej ${LIMITS.message.min} znaków. Wystarczą dwa zdania.`;
      if (length > LIMITS.message.max) return `Opis może mieć najwyżej ${LIMITS.message.max} znaków.`;
      return undefined;
    }
    case "consent":
      return input.consent ? undefined : "Potwierdź, że znasz zasady przetwarzania danych.";
  }
}

export const FIELD_ORDER: ContactField[] = ["name", "email", "company", "service", "scope", "message", "consent"];

export function validateContact(input: ContactInput): ValidationResult {
  const errors: FieldErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, input);
    if (message) errors[field] = message;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      company: input.company.trim() || null,
      service: input.service as ServiceValue,
      scope: (input.scope || null) as ScopeValue | null,
      message: input.message.trim(),
    },
  };
}

/** Odczyt i oczyszczenie danych z FormData (serwer). */
export function inputFromFormData(formData: FormData): ContactInput {
  return {
    name: cleanText(formData.get("name")),
    email: cleanText(formData.get("email")),
    company: cleanText(formData.get("company")),
    service: cleanText(formData.get("service")),
    scope: cleanText(formData.get("scope")),
    message: cleanText(formData.get("message"), { multiline: true }),
    consent: formData.get("consent") === "on",
  };
}

export function labelFor<T extends { value: string; label: string }>(options: readonly T[], value: string | null): string {
  return options.find((option) => option.value === value)?.label ?? "—";
}

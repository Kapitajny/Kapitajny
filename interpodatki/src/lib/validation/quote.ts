import { BUSINESS_TYPES, SERVICE_IDS, pricingConfig, type BusinessType, type ServiceId } from "@/lib/pricing/config";
import {
  checkEmail,
  checkInteger,
  checkName,
  checkOptionalText,
  checkPhone,
  cleanText,
  hasErrors,
  oneOfOrEmpty,
  toInt,
  type FieldErrors,
  type ValidationResult,
} from "./fields";

export const TAX_FORMS = {
  "zasady-ogolne": "Zasady ogólne (skala podatkowa)",
  liniowy: "Podatek liniowy",
  ryczalt: "Ryczałt od przychodów ewidencjonowanych",
  cit: "Podatek CIT",
  "nie-wiem": "Nie wiem / do ustalenia",
} as const;
export type TaxForm = keyof typeof TAX_FORMS;

export const BUDGETS = {
  "do-1200": "Do 1 200 zł miesięcznie",
  "1200-2500": "1 200 – 2 500 zł miesięcznie",
  "2500-5000": "2 500 – 5 000 zł miesięcznie",
  "5000-10000": "5 000 – 10 000 zł miesięcznie",
  "powyzej-10000": "Powyżej 10 000 zł miesięcznie",
  "do-ustalenia": "Do ustalenia",
} as const;
export type Budget = keyof typeof BUDGETS;

export const START_TERMS = {
  "jak-najszybciej": "Jak najszybciej",
  "do-miesiaca": "W ciągu miesiąca",
  "1-3-miesiace": "Za 1–3 miesiące",
  pozniej: "Później / jeszcze nie wiem",
} as const;
export type StartTerm = keyof typeof START_TERMS;

export type QuoteFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: BusinessType | "";
  taxForm: TaxForm | "";
  documents: string;
  employees: string;
  services: ServiceId[];
  budget: Budget | "";
  startTerm: StartTerm | "";
  message: string;
  consent: boolean;
};

export type QuoteField = keyof QuoteFormValues;

export type QuoteData = Omit<QuoteFormValues, "documents" | "employees" | "businessType" | "taxForm" | "budget" | "startTerm"> & {
  businessType: BusinessType;
  taxForm: TaxForm | "";
  budget: Budget;
  startTerm: StartTerm;
  documents: number;
  employees: number;
};

export const emptyQuote: QuoteFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  businessType: "",
  taxForm: "",
  documents: "",
  employees: "",
  services: [],
  budget: "",
  startTerm: "",
  message: "",
  consent: false,
};

/** Pola podzielone na kroki formularza – pozwala walidować tylko bieżący krok. */
export const QUOTE_STEPS: { title: string; fields: QuoteField[] }[] = [
  { title: "Firma i zakres", fields: ["businessType", "taxForm", "documents", "employees", "services"] },
  { title: "Oczekiwania", fields: ["budget", "startTerm", "message"] },
  { title: "Dane kontaktowe", fields: ["name", "email", "phone", "company", "consent"] },
];

export function normalizeQuote(raw: Record<string, unknown>): QuoteFormValues {
  const services = Array.isArray(raw.services) ? raw.services : [];
  return {
    name: cleanText(raw.name, 80),
    email: cleanText(raw.email, 160).toLowerCase(),
    phone: cleanText(raw.phone, 30),
    company: cleanText(raw.company, 160),
    businessType: oneOfOrEmpty(BUSINESS_TYPES, raw.businessType),
    taxForm: oneOfOrEmpty(Object.keys(TAX_FORMS) as TaxForm[], raw.taxForm),
    documents: cleanText(String(raw.documents ?? ""), 8),
    employees: cleanText(String(raw.employees ?? ""), 8),
    services: SERVICE_IDS.filter((id) => services.includes(id)),
    budget: oneOfOrEmpty(Object.keys(BUDGETS) as Budget[], raw.budget),
    startTerm: oneOfOrEmpty(Object.keys(START_TERMS) as StartTerm[], raw.startTerm),
    message: cleanText(raw.message, 2500),
    consent: raw.consent === true,
  };
}

export function validateQuote(values: QuoteFormValues, only?: QuoteField[]): FieldErrors<QuoteField> {
  const e: FieldErrors<QuoteField> = {};
  const { limits } = pricingConfig;
  e.businessType = values.businessType ? undefined : "Wybierz rodzaj działalności.";
  e.documents = checkInteger(values.documents, limits.documents.min, limits.documents.max, "liczbę dokumentów");
  e.employees = checkInteger(values.employees, limits.employees.min, limits.employees.max, "liczbę pracowników");
  e.services = values.services.length ? undefined : "Zaznacz co najmniej jedną usługę.";
  e.budget = values.budget ? undefined : "Wybierz orientacyjny budżet lub „Do ustalenia”.";
  e.startTerm = values.startTerm ? undefined : "Wybierz preferowany termin rozpoczęcia.";
  e.message = checkOptionalText(values.message, 2000, "Dodatkowe informacje");
  e.name = checkName(values.name);
  e.email = checkEmail(values.email);
  e.phone = checkPhone(values.phone);
  e.company = checkOptionalText(values.company, 120, "Nazwa firmy");
  e.consent = values.consent ? undefined : "Zaznacz zgodę, aby wysłać zgłoszenie.";

  const result: FieldErrors<QuoteField> = {};
  for (const [key, msg] of Object.entries(e) as [QuoteField, string | undefined][]) {
    if (msg && (!only || only.includes(key))) result[key] = msg;
  }
  return result;
}

export function parseQuote(raw: Record<string, unknown>): ValidationResult<QuoteData, QuoteField> {
  const values = normalizeQuote(raw);
  const errors = validateQuote(values);
  if (hasErrors(errors)) return { ok: false, errors };
  return {
    ok: true,
    data: {
      ...values,
      businessType: values.businessType as BusinessType,
      budget: values.budget as Budget,
      startTerm: values.startTerm as StartTerm,
      documents: toInt(values.documents),
      employees: toInt(values.employees),
    },
  };
}

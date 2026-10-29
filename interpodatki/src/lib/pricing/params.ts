import { defaultCalculatorInput, normalizeCalculatorInput, type CalculatorInput } from "./calculator";

/**
 * Konfiguracja kalkulatora zapisana w adresie URL. Zawiera wyłącznie parametry wyceny –
 * nigdy dane osobowe – dzięki czemu można ją bezpiecznie przekazać do formularza i zamówienia.
 */
const KEYS = {
  businessType: "typ",
  legalForm: "forma",
  services: "uslugi",
  documents: "dokumenty",
  employees: "pracownicy",
  hrDocuments: "kadrowe",
  scale: "skala",
  complexity: "zlozonosc",
  urgent: "pilna",
  frequentReporting: "raporty",
  extraConsultationHours: "godziny",
  customScope: "indywidualny",
} as const satisfies Record<keyof CalculatorInput, string>;

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function read(source: ParamSource, key: string): string | undefined {
  if (source instanceof URLSearchParams) return source.get(key) ?? undefined;
  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

export function hasCalculatorParams(source: ParamSource): boolean {
  return read(source, KEYS.businessType) !== undefined;
}

export function parseCalculatorParams(source: ParamSource): CalculatorInput {
  if (!hasCalculatorParams(source)) return defaultCalculatorInput;
  const services = read(source, KEYS.services);
  return normalizeCalculatorInput({
    businessType: read(source, KEYS.businessType),
    legalForm: read(source, KEYS.legalForm),
    services: services ? services.split(",") : [],
    documents: read(source, KEYS.documents),
    employees: read(source, KEYS.employees),
    hrDocuments: read(source, KEYS.hrDocuments),
    scale: read(source, KEYS.scale),
    complexity: read(source, KEYS.complexity),
    urgent: read(source, KEYS.urgent) === "1",
    frequentReporting: read(source, KEYS.frequentReporting) === "1",
    extraConsultationHours: read(source, KEYS.extraConsultationHours),
    customScope: read(source, KEYS.customScope) === "1",
  });
}

export function calculatorToParams(input: CalculatorInput): URLSearchParams {
  const p = new URLSearchParams();
  p.set(KEYS.businessType, input.businessType);
  p.set(KEYS.legalForm, input.legalForm);
  p.set(KEYS.services, input.services.join(","));
  p.set(KEYS.documents, String(input.documents));
  p.set(KEYS.employees, String(input.employees));
  if (input.hrDocuments > 0) p.set(KEYS.hrDocuments, String(input.hrDocuments));
  p.set(KEYS.scale, input.scale);
  p.set(KEYS.complexity, input.complexity);
  if (input.urgent) p.set(KEYS.urgent, "1");
  if (input.frequentReporting) p.set(KEYS.frequentReporting, "1");
  if (input.extraConsultationHours > 0) p.set(KEYS.extraConsultationHours, String(input.extraConsultationHours));
  if (input.customScope) p.set(KEYS.customScope, "1");
  return p;
}

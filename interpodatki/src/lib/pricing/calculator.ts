import {
  BUSINESS_TYPES,
  COMPLEXITIES,
  SCALES,
  SERVICE_IDS,
  pricingConfig as cfg,
  type BusinessType,
  type Complexity,
  type LegalForm,
  type Scale,
  type ServiceId,
} from "./config";
import { packageForMonthly, type ServicePackage } from "./packages";

export type CalculatorInput = {
  businessType: BusinessType;
  legalForm: LegalForm;
  services: ServiceId[];
  documents: number;
  employees: number;
  hrDocuments: number;
  scale: Scale;
  complexity: Complexity;
  urgent: boolean;
  frequentReporting: boolean;
  extraConsultationHours: number;
  customScope: boolean;
};

export type BreakdownLine = {
  id: string;
  label: string;
  amount: number;
  detail?: string;
};

export type CalculationResult = {
  ok: boolean;
  /** Komunikaty blokujące wynik (np. brak wybranych usług). */
  errors: string[];
  /** Wskazówki, które nie blokują wyniku. */
  notes: string[];
  lines: BreakdownLine[];
  /** Mnożniki skali i złożoności oraz dopłaty procentowe – już przeliczone na kwoty. */
  adjustments: BreakdownLine[];
  monthly: number;
  range: { min: number; max: number };
  recommendedPackage: ServicePackage;
  requiresIndividualQuote: boolean;
  /** Opłata jednorazowa rekomendowanego pakietu; `null` – ustalana indywidualnie. */
  oneTimeFee: number | null;
};

export const defaultCalculatorInput: CalculatorInput = {
  businessType: "jdg",
  legalForm: "jdg",
  services: ["ksiegowosc"],
  documents: 20,
  employees: 0,
  hrDocuments: 0,
  scale: "mikro",
  complexity: "standard",
  urgent: false,
  frequentReporting: false,
  extraConsultationHours: 0,
  customScope: false,
};

function clampInt(value: unknown, { min, max }: { min: number; max: number }, fallback: number): number {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function oneOf<T extends string>(list: readonly T[], value: unknown, fallback: T): T {
  return typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T) : fallback;
}

/**
 * Sprowadza dowolne (np. pochodzące z adresu URL lub żądania HTTP) dane do poprawnej konfiguracji.
 * Wartości spoza konfiguracji są zastępowane domyślnymi, liczby – przycinane do dozwolonych zakresów.
 */
export function normalizeCalculatorInput(raw: Partial<Record<keyof CalculatorInput, unknown>>): CalculatorInput {
  const d = defaultCalculatorInput;
  const businessType = oneOf(BUSINESS_TYPES, raw.businessType, d.businessType);
  const typeCfg = cfg.businessTypes[businessType];
  const legalForm = oneOf(typeCfg.legalForms, raw.legalForm, typeCfg.defaultLegalForm);
  const rawServices = Array.isArray(raw.services) ? raw.services : d.services;
  const services = SERVICE_IDS.filter((id) => rawServices.includes(id));

  return {
    businessType,
    legalForm,
    services,
    documents: clampInt(raw.documents, cfg.limits.documents, d.documents),
    employees: clampInt(raw.employees, cfg.limits.employees, d.employees),
    hrDocuments: clampInt(raw.hrDocuments, cfg.limits.hrDocuments, d.hrDocuments),
    scale: oneOf(SCALES, raw.scale, d.scale),
    complexity: oneOf(COMPLEXITIES, raw.complexity, d.complexity),
    urgent: raw.urgent === true,
    frequentReporting: raw.frequentReporting === true,
    extraConsultationHours: clampInt(raw.extraConsultationHours, cfg.limits.extraConsultationHours, 0),
    customScope: raw.customScope === true,
  };
}

/** Dopłata za dokumenty ponad limit zawarty w cenie bazowej (stawki malejące). */
export function documentSurcharge(extraDocuments: number): number {
  let remaining = Math.max(0, extraDocuments);
  let previous = 0;
  let total = 0;
  for (const tier of cfg.documentTiers) {
    const inTier = Math.min(remaining, tier.upTo - previous);
    total += inTier * tier.perDocument;
    remaining -= inTier;
    previous = tier.upTo;
    if (remaining <= 0) break;
  }
  return total;
}

const roundUp = (value: number, step: number) => Math.ceil(value / step) * step;
const roundDown = (value: number, step: number) => Math.floor(value / step) * step;
const money = (value: number) => Math.round(value);

export function calculate(input: CalculatorInput): CalculationResult {
  const i = normalizeCalculatorInput(input);
  const typeCfg = cfg.businessTypes[i.businessType];
  const has = (id: ServiceId) => i.services.includes(id);
  const lines: BreakdownLine[] = [];
  const notes: string[] = [];
  const errors: string[] = [];

  if (i.services.length === 0) {
    errors.push("Wybierz co najmniej jedną usługę, aby zobaczyć szacunek.");
  }

  if (has("ksiegowosc")) {
    lines.push({
      id: "ksiegowosc",
      label: `Księgowość – ${typeCfg.label.toLowerCase()}`,
      amount: typeCfg.accountingBase,
      detail: `Zawiera do ${typeCfg.includedDocuments} dokumentów miesięcznie`,
    });
    const extraDocs = i.documents - typeCfg.includedDocuments;
    if (extraDocs > 0) {
      lines.push({
        id: "dokumenty",
        label: "Dodatkowe dokumenty",
        amount: documentSurcharge(extraDocs),
        detail: `${extraDocs} ponad limit, stawka malejąca`,
      });
    }
  } else if (i.services.length > 0) {
    notes.push("Bez księgowości szacunek obejmuje tylko wybrane usługi dodatkowe.");
  }

  const legal = cfg.legalForms[i.legalForm];
  if (legal.surcharge > 0) {
    lines.push({ id: "forma-prawna", label: `Forma prawna: ${legal.label.toLowerCase()}`, amount: legal.surcharge });
  }

  if (has("vat")) {
    lines.push({ id: "vat", label: cfg.services.vat.label, amount: cfg.services.vat.monthly[i.businessType] });
  }

  if (has("kadry")) {
    const k = cfg.services.kadry;
    const amount = k.base + i.employees * k.perEmployee + i.hrDocuments * k.perHrDocument;
    const parts = [`${i.employees} ${plural(i.employees, "pracownik", "pracowników", "pracowników")}`];
    if (i.hrDocuments > 0) parts.push(`${i.hrDocuments} dok. kadrowych`);
    lines.push({ id: "kadry", label: k.label, amount, detail: parts.join(", ") });
    if (i.employees === 0) notes.push("Podaj liczbę pracowników, aby szacunek kadr i płac był pełny.");
  }

  if (has("raportowanie")) {
    lines.push({ id: "raportowanie", label: cfg.services.raportowanie.label, amount: cfg.services.raportowanie.monthly });
  }
  if (has("konsultacje")) {
    lines.push({ id: "konsultacje", label: cfg.services.konsultacje.label, amount: cfg.services.konsultacje.monthly });
  }
  if (has("ecommerce")) {
    lines.push({ id: "ecommerce", label: cfg.services.ecommerce.label, amount: cfg.services.ecommerce.monthly });
  }
  if (has("doradztwo")) {
    lines.push({
      id: "doradztwo",
      label: cfg.services.doradztwo.label,
      amount: cfg.services.doradztwo.monthly,
      detail: "Zakres ustalany z uprawnionym doradcą",
    });
    notes.push("Doradztwo podatkowe świadczy uprawniony doradca – ostateczny zakres i koszt wymagają rozmowy.");
  }

  if (i.frequentReporting) {
    lines.push({
      id: "czestsze-raportowanie",
      label: cfg.extras.frequentReporting.label,
      amount: cfg.extras.frequentReporting.monthly,
    });
  }
  if (i.extraConsultationHours > 0) {
    lines.push({
      id: "godziny-konsultacji",
      label: cfg.extras.consultationHour.label,
      amount: i.extraConsultationHours * cfg.extras.consultationHour.perHour,
      detail: `${i.extraConsultationHours} h × ${cfg.extras.consultationHour.perHour} zł`,
    });
  }

  const servicesTotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const adjustments: BreakdownLine[] = [];
  let running = servicesTotal;

  const scale = cfg.scales[i.scale];
  if (scale.factor !== 1) {
    const amount = money(running * (scale.factor - 1));
    adjustments.push({ id: "skala", label: `Skala działalności: ${scale.label.toLowerCase()}`, amount, detail: `+${pct(scale.factor - 1)}` });
    running += amount;
  }
  const complexity = cfg.complexities[i.complexity];
  if (complexity.factor !== 1) {
    const amount = money(running * (complexity.factor - 1));
    adjustments.push({
      id: "zlozonosc",
      label: `Złożoność rozliczeń: ${complexity.label.toLowerCase()}`,
      amount,
      detail: `+${pct(complexity.factor - 1)}`,
    });
    running += amount;
  }
  if (i.urgent) {
    const amount = money(running * cfg.extras.urgent.rate);
    adjustments.push({ id: "pilna", label: cfg.extras.urgent.label, amount, detail: `+${pct(cfg.extras.urgent.rate)}` });
    running += amount;
  }
  if (running > 0 && running < cfg.minimumMonthly) {
    adjustments.push({
      id: "minimum",
      label: "Wyrównanie do opłaty minimalnej",
      amount: cfg.minimumMonthly - running,
      detail: `Minimalny abonament to ${cfg.minimumMonthly} zł`,
    });
    running = cfg.minimumMonthly;
  }

  const ok = errors.length === 0;
  const monthly = ok ? Math.max(cfg.minimumMonthly, roundUp(running, cfg.roundTo)) : 0;
  const upperFactor = i.customScope ? cfg.range.upperCustomScope : cfg.range.upper;
  const range = ok
    ? {
        min: Math.max(cfg.minimumMonthly, roundDown(monthly * cfg.range.lower, cfg.range.step)),
        max: roundUp(monthly * upperFactor, cfg.range.step),
      }
    : { min: 0, max: 0 };

  const recommendedPackage = packageForMonthly(monthly);
  const requiresIndividualQuote =
    ok && (i.customScope || monthly >= cfg.individualQuoteThreshold || !recommendedPackage.orderable);
  if (i.customScope) notes.push("Indywidualny zakres współpracy wymaga rozmowy – przedział cenowy jest szerszy.");
  if (ok && monthly >= cfg.individualQuoteThreshold) {
    notes.push("Przy tej skali obsługi przygotowujemy wyłącznie indywidualną wycenę.");
  }

  return {
    ok,
    errors,
    notes,
    lines,
    adjustments,
    monthly,
    range,
    recommendedPackage,
    requiresIndividualQuote,
    oneTimeFee: recommendedPackage.onboardingFee,
  };
}

function pct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** Polska odmiana liczebników: 1 pracownik, 2 pracowników… – wariant uproszczony dla etykiet. */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const lastTwo = n % 100;
  const last = n % 10;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
}

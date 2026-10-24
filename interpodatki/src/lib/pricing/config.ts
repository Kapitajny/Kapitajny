/**
 * Demonstracyjne stawki kalkulatora abonamentu InterPodatki.
 *
 * Wszystkie kwoty to założenia projektowe (zł netto miesięcznie), a nie zweryfikowany cennik rynkowy.
 * Zmiana cen odbywa się wyłącznie tutaj – interfejs, serwer i testy korzystają z tej samej konfiguracji.
 */

export const BUSINESS_TYPES = ["jdg", "spzoo", "inna-spolka", "ecommerce", "inna"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const SERVICE_IDS = [
  "ksiegowosc",
  "vat",
  "kadry",
  "raportowanie",
  "konsultacje",
  "ecommerce",
  "doradztwo",
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

export const LEGAL_FORMS = [
  "jdg",
  "spzoo",
  "cywilna",
  "jawna",
  "partnerska",
  "komandytowa",
  "komandytowo-akcyjna",
  "akcyjna",
  "psa",
  "fundacja",
  "stowarzyszenie",
  "inna",
] as const;
export type LegalForm = (typeof LEGAL_FORMS)[number];

export const SCALES = ["mikro", "mala", "srednia", "duza"] as const;
export type Scale = (typeof SCALES)[number];

export const COMPLEXITIES = ["standard", "podwyzszona", "wysoka"] as const;
export type Complexity = (typeof COMPLEXITIES)[number];

export type BusinessTypeConfig = {
  label: string;
  description: string;
  /** Opłata za prowadzenie księgowości, obejmująca `includedDocuments` dokumentów. */
  accountingBase: number;
  includedDocuments: number;
  legalForms: readonly LegalForm[];
  defaultLegalForm: LegalForm;
};

export const pricingConfig = {
  /** Najniższa możliwa opłata miesięczna – wynik nigdy nie spada poniżej tej kwoty. */
  minimumMonthly: 700,
  /** Powyżej tej kwoty zakres zawsze wymaga indywidualnej wyceny. */
  individualQuoteThreshold: 10_000,
  /** Zaokrąglenie wyniku w górę (zł). */
  roundTo: 10,
  /** Przedział cenowy: dolna i górna granica względem szacunku. */
  range: { lower: 0.9, upper: 1.15, upperCustomScope: 1.35, step: 50 },

  businessTypes: {
    jdg: {
      label: "Jednoosobowa działalność",
      description: "Freelancerzy, usługi B2B, mała działalność usługowa lub handlowa.",
      accountingBase: 700,
      includedDocuments: 20,
      legalForms: ["jdg"],
      defaultLegalForm: "jdg",
    },
    spzoo: {
      label: "Spółka z o.o.",
      description: "Pełna księgowość spółki kapitałowej, sprawozdawczość i obsługa wspólników.",
      accountingBase: 1500,
      includedDocuments: 30,
      legalForms: ["spzoo"],
      defaultLegalForm: "spzoo",
    },
    "inna-spolka": {
      label: "Inna spółka",
      description: "Spółki osobowe, akcyjne i prosta spółka akcyjna.",
      accountingBase: 1200,
      includedDocuments: 30,
      legalForms: ["cywilna", "jawna", "partnerska", "komandytowa", "komandytowo-akcyjna", "akcyjna", "psa"],
      defaultLegalForm: "jawna",
    },
    ecommerce: {
      label: "Sklep internetowy",
      description: "Sprzedaż online, wiele kanałów płatności i duża liczba transakcji.",
      accountingBase: 1000,
      includedDocuments: 40,
      legalForms: ["jdg", "spzoo", "jawna", "komandytowa", "psa"],
      defaultLegalForm: "jdg",
    },
    inna: {
      label: "Inna działalność",
      description: "Fundacje, stowarzyszenia i nietypowe modele działalności.",
      accountingBase: 900,
      includedDocuments: 20,
      legalForms: ["fundacja", "stowarzyszenie", "inna"],
      defaultLegalForm: "fundacja",
    },
  } satisfies Record<BusinessType, BusinessTypeConfig>,

  legalForms: {
    jdg: { label: "Jednoosobowa działalność gospodarcza", surcharge: 0 },
    spzoo: { label: "Spółka z ograniczoną odpowiedzialnością", surcharge: 0 },
    cywilna: { label: "Spółka cywilna", surcharge: 0 },
    jawna: { label: "Spółka jawna", surcharge: 100 },
    partnerska: { label: "Spółka partnerska", surcharge: 150 },
    komandytowa: { label: "Spółka komandytowa", surcharge: 300 },
    "komandytowo-akcyjna": { label: "Spółka komandytowo-akcyjna", surcharge: 600 },
    akcyjna: { label: "Spółka akcyjna", surcharge: 900 },
    psa: { label: "Prosta spółka akcyjna", surcharge: 400 },
    fundacja: { label: "Fundacja", surcharge: 0 },
    stowarzyszenie: { label: "Stowarzyszenie", surcharge: 0 },
    inna: { label: "Inna forma prawna", surcharge: 200 },
  } satisfies Record<LegalForm, { label: string; surcharge: number }>,

  /**
   * Dopłata za dokumenty ponad limit zawarty w cenie bazowej.
   * Progi liczone od pierwszego dokumentu ponad limit (stawka malejąca).
   */
  documentTiers: [
    { upTo: 80, perDocument: 9 },
    { upTo: 280, perDocument: 7 },
    { upTo: Infinity, perDocument: 5 },
  ],

  services: {
    ksiegowosc: {
      label: "Księgowość",
      description: "Ewidencja dokumentów i bieżące rozliczenia w uzgodnionym zakresie.",
    },
    vat: {
      label: "Rozliczenia VAT",
      description: "Ewidencje i deklaracje VAT przygotowywane na podstawie przekazanych dokumentów.",
      monthly: { jdg: 150, spzoo: 250, "inna-spolka": 250, ecommerce: 300, inna: 200 } satisfies Record<
        BusinessType,
        number
      >,
    },
    kadry: {
      label: "Kadry i płace",
      description: "Listy płac, dokumentacja pracownicza i rozliczenia związane z zatrudnieniem.",
      base: 150,
      perEmployee: 60,
      perHrDocument: 15,
    },
    raportowanie: {
      label: "Raportowanie zarządcze",
      description: "Okresowe zestawienia kosztów, przychodów i wyników w ustalonym formacie.",
      monthly: 450,
    },
    konsultacje: {
      label: "Konsultacje bieżące",
      description: "Stały pakiet 2 godzin konsultacji księgowych w miesiącu.",
      monthly: 300,
    },
    ecommerce: {
      label: "Dokumentacja e-commerce",
      description: "Uzgadnianie raportów z platform sprzedażowych i operatorów płatności.",
      monthly: 350,
    },
    doradztwo: {
      label: "Doradztwo podatkowe",
      description:
        "Wsparcie uprawnionego doradcy podatkowego. Zakres ustalany indywidualnie – kwota obejmuje stałą gotowość i analizę bieżących zagadnień.",
      monthly: 600,
    },
  },

  scales: {
    mikro: { label: "Mikro", hint: "Pierwsze lata działalności, niewielka skala obrotów", factor: 1 },
    mala: { label: "Mała", hint: "Stabilna sprzedaż, kilku stałych kontrahentów", factor: 1.1 },
    srednia: { label: "Średnia", hint: "Rozbudowana struktura kosztów, wielu kontrahentów", factor: 1.25 },
    duza: { label: "Duża", hint: "Wysokie obroty, wiele procesów finansowych", factor: 1.45 },
  } satisfies Record<Scale, { label: string; hint: string; factor: number }>,

  complexities: {
    standard: { label: "Standardowa", hint: "Typowe dokumenty krajowe, powtarzalne operacje", factor: 1 },
    podwyzszona: { label: "Podwyższona", hint: "Transakcje zagraniczne, środki trwałe, wiele walut", factor: 1.15 },
    wysoka: { label: "Wysoka", hint: "Nietypowe transakcje, projekty, wiele podmiotów", factor: 1.35 },
  } satisfies Record<Complexity, { label: string; hint: string; factor: number }>,

  extras: {
    urgent: { label: "Pilna obsługa", description: "Skrócony czas reakcji na zgłoszenia.", rate: 0.15 },
    frequentReporting: {
      label: "Częstsze raportowanie",
      description: "Zestawienia co tydzień zamiast co miesiąc.",
      monthly: 250,
    },
    consultationHour: {
      label: "Dodatkowe godziny konsultacji",
      description: "Godziny ponad stały pakiet konsultacji.",
      perHour: 200,
    },
    customScope: {
      label: "Indywidualny zakres współpracy",
      description: "Zakres wykraczający poza standardowe usługi – wymaga rozmowy i indywidualnej wyceny.",
    },
  },

  limits: {
    documents: { min: 0, max: 5000 },
    employees: { min: 0, max: 1000 },
    hrDocuments: { min: 0, max: 2000 },
    extraConsultationHours: { min: 0, max: 40 },
  },
} as const;

export type PricingConfig = typeof pricingConfig;

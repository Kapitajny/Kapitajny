/**
 * Demonstracyjne pakiety abonamentowe. Ceny „od” są założeniami projektowymi, nie ofertą handlową.
 */

export const PACKAGE_IDS = ["start", "biznes", "pro", "premium", "enterprise"] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

export type ServicePackage = {
  id: PackageId;
  name: string;
  /** Cena wyjściowa (zł netto / mies.). `null` – wyłącznie wycena indywidualna. */
  priceFrom: number | null;
  /** Górna granica szacunku, od której kalkulator proponuje kolejny pakiet. */
  recommendedBelow: number;
  /** Jednorazowa opłata wdrożeniowa (przejęcie dokumentacji, konfiguracja obiegu dokumentów). */
  onboardingFee: number | null;
  audience: string;
  features: string[];
  orderable: boolean;
};

export const packages: ServicePackage[] = [
  {
    id: "start",
    name: "Start",
    priceFrom: 700,
    recommendedBelow: 1200,
    onboardingFee: 300,
    audience: "Jednoosobowe działalności i freelancerzy o niewielkiej liczbie dokumentów.",
    features: [
      "Podstawowa obsługa księgowa",
      "Ewidencja dokumentów w uzgodnionym zakresie",
      "Standardowe rozliczenia",
      "Podstawowy kontakt z biurem",
    ],
    orderable: true,
  },
  {
    id: "biznes",
    name: "Biznes",
    priceFrom: 1200,
    recommendedBelow: 2500,
    onboardingFee: 500,
    audience: "Rozwijające się firmy, które potrzebują stałego kontaktu i okresowych zestawień.",
    features: [
      "Szersza obsługa księgowa",
      "Rozliczenia podatkowe w uzgodnionym zakresie",
      "Bieżąca komunikacja",
      "Okresowe zestawienia",
    ],
    orderable: true,
  },
  {
    id: "pro",
    name: "Pro",
    priceFrom: 2500,
    recommendedBelow: 5000,
    onboardingFee: 900,
    audience: "Spółki i firmy z większą liczbą dokumentów oraz bardziej złożonymi rozliczeniami.",
    features: [
      "Rozszerzona obsługa przedsiębiorstwa",
      "Większa liczba dokumentów",
      "Uzgodniony zakres wsparcia podatkowego",
      "Priorytetowa komunikacja",
    ],
    orderable: true,
  },
  {
    id: "premium",
    name: "Premium",
    priceFrom: 5000,
    recommendedBelow: 10_000,
    onboardingFee: 1500,
    audience: "Przedsiębiorstwa zatrudniające pracowników, potrzebujące raportowania dla zarządu.",
    features: [
      "Szeroki zakres obsługi księgowej",
      "Kadry i płace w zakresie określonym umową",
      "Raportowanie zarządcze",
      "Indywidualne ustalenia",
    ],
    orderable: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceFrom: null,
    recommendedBelow: Infinity,
    onboardingFee: null,
    audience: "Grupy spółek i organizacje o złożonej strukturze – zakres ustalany po analizie.",
    features: [
      "Indywidualna wycena – zwykle do 10 000 zł miesięcznie i więcej",
      "Zakres usług określany po analizie potrzeb",
      "Dedykowany zespół w uzgodnionym składzie",
      "Harmonogram wdrożenia ustalany wspólnie",
    ],
    orderable: false,
  },
];

export function getPackage(id: string | null | undefined): ServicePackage | undefined {
  return packages.find((p) => p.id === id);
}

/** Pakiet, którego zakres cenowy obejmuje podaną miesięczną kwotę. */
export function packageForMonthly(monthly: number): ServicePackage {
  return packages.find((p) => monthly < p.recommendedBelow) ?? packages[packages.length - 1];
}

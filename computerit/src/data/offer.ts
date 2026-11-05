/** Oferta i cennik – jedno źródło dla sekcji „Usługi i cennik”, „Pakiet promocyjny” i formularza. */

export type ProjectType = "strona" | "sklep" | "promocja" | "inne";

export const projectTypes: { value: ProjectType; label: string }[] = [
  { value: "strona", label: "Strona internetowa" },
  { value: "sklep", label: "Sklep internetowy" },
  { value: "promocja", label: "Pakiet promocyjny – strona za 800 zł" },
  { value: "inne", label: "Inny projekt" },
];

export const budgets = [
  { value: "do-1500", label: "do 1500 zł" },
  { value: "1500-3000", label: "1500–3000 zł" },
  { value: "3000-6000", label: "3000–6000 zł" },
  { value: "powyzej-6000", label: "powyżej 6000 zł" },
  { value: "nie-wiem", label: "Jeszcze nie wiem" },
] as const;

export type Budget = (typeof budgets)[number]["value"];

export const services = [
  {
    id: "strona",
    project: "strona" as ProjectType,
    name: "Strony internetowe",
    price: 1300,
    description: "Nowoczesne strony internetowe dopasowane do charakteru Twojej firmy i potrzeb klientów.",
    scope: [
      "Indywidualny projekt graficzny",
      "Responsywność",
      "Dopracowana struktura",
      "Formularz kontaktowy",
      "Podstawowa optymalizacja SEO",
      "Wdrożenie strony",
    ],
    cta: "Zapytaj o stronę",
  },
  {
    id: "sklep",
    project: "sklep" as ProjectType,
    name: "Sklepy internetowe",
    price: 2000,
    description: "Funkcjonalne sklepy internetowe przygotowane do sprzedaży produktów online.",
    scope: [
      "Indywidualny wygląd sklepu",
      "Responsywność",
      "Karty produktów",
      "Kategorie produktów",
      "Koszyk zakupowy",
      "Przygotowanie integracji płatności",
      "Podstawowa optymalizacja SEO",
    ],
    cta: "Zapytaj o sklep",
  },
] as const;

export const promo = {
  price: 800,
  seats: 5,
};

/** 1300 → „1300”, 12500 → „12 500” (polska konwencja: spacja od pięciu cyfr). */
export function formatPrice(value: number): string {
  const digits = String(value);
  return digits.length < 5 ? digits : digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

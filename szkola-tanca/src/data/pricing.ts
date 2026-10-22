/** CENNIK – CENY PRZYKŁADOWE (projekt demonstracyjny). Kwoty w złotych. */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  /** Np. „za zajęcia”, „za pakiet”. */
  unit: string;
  summary: string;
  details: string[];
  /** Liczba wejść na karnecie (dziurki do skasowania); `null` – bez limitu. */
  entries: number | null;
  /** Wyróżniony pakiet (jeden). */
  featured?: boolean;
}

export const PRICING: PricingPlan[] = [
  {
    id: "proba",
    name: "Lekcja próbna",
    price: 25,
    unit: "jednorazowo",
    summary: "Pierwsze zajęcia w wybranym stylu – sprawdź, czy to dla Ciebie.",
    details: ["Dowolna grupa na poziomie „Od zera” lub „Podstawowy”", "Rozmowa z instruktorem po zajęciach"],
    entries: 1,
  },
  {
    id: "wejscie",
    name: "Pojedyncze wejście",
    price: 50,
    unit: "za zajęcia",
    summary: "Gdy chcesz przyjść raz na jakiś czas, bez zobowiązań.",
    details: ["Dowolne zajęcia z grafiku", "Ważne w dniu zakupu"],
    entries: 1,
  },
  {
    id: "pakiet-4",
    name: "Pakiet 4 zajęć",
    price: 180,
    unit: "za pakiet",
    summary: "Raz w tygodniu przez miesiąc – dobry rytm na początek.",
    details: ["45 zł za zajęcia", "Ważny 30 dni od pierwszych zajęć", "Dowolne style i grupy na Twoim poziomie"],
    entries: 4,
  },
  {
    id: "pakiet-8",
    name: "Pakiet 8 zajęć",
    price: 320,
    unit: "za pakiet",
    summary: "Dwa razy w tygodniu – tempo, w którym najszybciej widać postępy.",
    details: ["40 zł za zajęcia", "Ważny 45 dni od pierwszych zajęć", "Dowolne style i grupy na Twoim poziomie"],
    entries: 8,
    featured: true,
  },
  {
    id: "miesieczny",
    name: "Karnet miesięczny",
    price: 390,
    unit: "za 30 dni",
    summary: "Dla osób, które chcą tańczyć często i w kilku stylach.",
    details: ["Bez limitu wejść przez 30 dni", "Wszystkie grupy na Twoim poziomie"],
    entries: null,
  },
];

export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("pl-PL").format(value)} zł`;
}

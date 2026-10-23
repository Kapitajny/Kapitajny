/**
 * ★ CENNIK
 *
 * UWAGA: ceny i czasy poniżej są PRZYKŁADOWE (dodane na prośbę właściciela, aby pokazać wygląd
 * cennika). Przed publikacją wpisz prawdziwe wartości i ustaw `PRICES_ARE_EXAMPLES = false` –
 * do tego czasu strona wyświetla przy cenach informację, że są przykładowe.
 *
 * `service` łączy pozycję z usługą z data/services.ts (cena pojawia się wtedy także przy usłudze).
 */

export const PRICES_ARE_EXAMPLES = true;

export interface PriceItem {
  /** Opcjonalny identyfikator – "pierwsza-wizyta" oznacza konsultację pokazywaną na stronie głównej. */
  id?: string;
  title: string;
  note?: string;
  /** Np. "50 min". */
  duration: string | null;
  /** Np. "190 zł". */
  price: string | null;
  service?: string;
}

export interface PriceGroup {
  title: string;
  items: PriceItem[];
}

export const PRICE_GROUPS: PriceGroup[] = [
  {
    title: "Konsultacje",
    items: [
      {
        id: "pierwsza-wizyta",
        title: "Pierwsza wizyta (konsultacja fizjoterapeutyczna)",
        note: "Rozmowa, ocena funkcjonalna, omówienie planu i pierwsze ćwiczenia",
        duration: "60 min",
        price: "220 zł",
      },
    ],
  },
  {
    title: "Terapia",
    items: [
      { title: "Fizjoterapia indywidualna", duration: "50 min", price: "190 zł", service: "fizjoterapia-indywidualna" },
      { title: "Rehabilitacja ortopedyczna", duration: "50 min", price: "190 zł", service: "rehabilitacja-ortopedyczna" },
      { title: "Terapia bólu pleców i karku", duration: "50 min", price: "190 zł", service: "terapia-bolu-plecow-i-karku" },
      { title: "Rehabilitacja pooperacyjna", duration: "50 min", price: "200 zł", service: "rehabilitacja-pooperacyjna" },
      { title: "Ćwiczenia usprawniające", duration: "45 min", price: "160 zł", service: "cwiczenia-usprawniajace" },
      { title: "Masaż leczniczy", note: "Krótki masaż jednej okolicy", duration: "30 min", price: "120 zł", service: "masaz-leczniczy" },
      { title: "Masaż leczniczy", note: "Masaż kilku okolic", duration: "60 min", price: "200 zł", service: "masaz-leczniczy" },
    ],
  },
  {
    title: "Pakiety",
    items: [
      { title: "Pakiet 5 wizyt fizjoterapii", note: "Do wykorzystania w ciągu 2 miesięcy", duration: "5 × 50 min", price: "900 zł" },
      { title: "Pakiet 10 wizyt fizjoterapii", note: "Do wykorzystania w ciągu 4 miesięcy", duration: "10 × 50 min", price: "1700 zł" },
    ],
  },
];

export const PRICE_LIST: PriceItem[] = PRICE_GROUPS.flatMap((group) => group.items);

/** Pierwsza wizyta (konsultacja) – pozycja z `id: "pierwsza-wizyta"`; pokazywana w hero, CTA i „O gabinecie”. */
export const FIRST_VISIT: PriceItem | undefined = PRICE_LIST.find((item) => item.id === "pierwsza-wizyta");

/** Wartość liczbowa ceny zapisanej tekstem, np. "1 200 zł" → 1200. */
export function priceValue(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

/**
 * Cena usługi do listy usług: najniższa z wariantów ("od 120 zł"), a czas jako zakres
 * wszystkich wariantów ("30–60 min"), żeby nie sugerować jednej, konkretnej oferty.
 */
export function priceForService(slug: string): { price: string; duration: string | null; from: boolean } | null {
  const items = PRICE_LIST.filter((item) => item.service === slug && item.price);
  if (items.length === 0) return null;
  const sorted = [...items].sort((a, b) => priceValue(a.price!) - priceValue(b.price!));
  const durations = [...new Set(sorted.map((item) => item.duration).filter(Boolean))] as string[];
  const minutes = durations.map((d) => priceValue(d)).sort((a, b) => a - b);
  const duration =
    durations.length > 1 && minutes.every((m) => m > 0) ? `${minutes[0]}–${minutes[minutes.length - 1]} min` : (durations[0] ?? null);
  return { price: sorted[0].price!, duration, from: items.length > 1 };
}

/** Akceptowane formy płatności, np. ["gotówka", "karta płatnicza", "BLIK"]. `null` = do uzupełnienia. */
export const PAYMENT_METHODS: string[] | null = null;

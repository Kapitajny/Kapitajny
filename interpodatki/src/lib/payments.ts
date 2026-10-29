/** Wspólne dla przeglądarki i serwera definicje demonstracyjnych płatności. */

export const PAYMENT_METHODS = {
  blik: { label: "BLIK (symulacja)", hint: "Bez wpisywania kodu – wynik wybierasz poniżej." },
  przelew: { label: "Szybki przelew (symulacja)", hint: "Bez przekierowania do banku." },
  karta: { label: "Karta płatnicza (symulacja)", hint: "Nie podajesz numeru karty – dane kart nie są przetwarzane." },
} as const;
export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export const PAYMENT_SCENARIOS = {
  success: { label: "Płatność zaakceptowana", hint: "Scenariusz testowy zakończony powodzeniem." },
  declined: { label: "Płatność odrzucona", hint: "Symulacja odmowy autoryzacji." },
  error: { label: "Błąd operatora", hint: "Symulacja chwilowej niedostępności usługi." },
} as const;
export type PaymentScenario = keyof typeof PAYMENT_SCENARIOS;

export type OrderStatus = "awaiting_payment" | "paid" | "failed";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: "Oczekuje na płatność demonstracyjną",
  paid: "Opłacone w trybie demo",
  failed: "Płatność demonstracyjna nieudana",
};

/** Kształt zamówienia zwracany przez API (bez danych wewnętrznych). */
export type PublicOrder = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  packageId: string;
  packageName: string;
  priceBasis: "calculator" | "package";
  lines: { label: string; amount: number }[];
  scope: string[];
  monthly: number;
  oneTimeFee: number;
  dueNow: number;
  customer: { name: string; company: string; emailMasked: string };
  payments: PublicPayment[];
  calculatorQuery: string | null;
};

export type PublicPayment = {
  reference: string;
  method: PaymentMethod;
  status: "succeeded" | "failed";
  message: string;
  createdAt: string;
};

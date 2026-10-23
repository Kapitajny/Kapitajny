/**
 * Metody dostawy. Ceny i terminy są przykładowe – ustaw stawki zgodne z umową z przewoźnikiem
 * przed uruchomieniem sprzedaży. Sklep nie oferuje darmowej dostawy, dopóki nie zostanie tu skonfigurowana.
 */

export type ShippingMethodId = "kurier" | "punkt";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  description: string;
  /** Cena w groszach. */
  price: number;
  /** Czy klient musi podać punkt odbioru (kod lub adres punktu). */
  requiresPickupPoint: boolean;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "kurier",
    name: "Kurier",
    description: "Dostawa pod wskazany adres, zwykle 1–2 dni robocze od nadania.",
    price: 1999,
    requiresPickupPoint: false,
  },
  {
    id: "punkt",
    name: "Punkt odbioru",
    description: "Odbiór w wybranym punkcie lub automacie paczkowym, zwykle 1–2 dni robocze od nadania.",
    price: 1499,
    requiresPickupPoint: true,
  },
];

/** Czas przygotowania paczki – wyświetlany na stronie produktu i w regulaminie. */
export const DISPATCH_TIME = "do 2 dni roboczych";
/** Ustawowy termin na odstąpienie od umowy zawartej na odległość. */
export const RETURN_DAYS = 14;

export const getShippingMethod = (id: unknown) => SHIPPING_METHODS.find((m) => m.id === id) ?? null;

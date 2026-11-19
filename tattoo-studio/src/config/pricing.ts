/**
 * KALKULATOR CENY — WARTOŚCI DO UZUPEŁNIENIA PRZEZ STUDIO (etykiety w słownikach: `pricing`).
 *
 * Liczby są PRZYKŁADOWE i nie są cennikiem studia. Dopóki `PRICING_CONFIRMED` = false,
 * kalkulator wyraźnie oznacza wynik jako poglądowy.
 *
 * Przedział = bazowy przedział rozmiaru × mnożnik miejsca × mnożnik szczegółowości × mnożnik charakteru,
 * zaokrąglony do `roundTo`, nie niższy niż `minimumPrice`.
 */

export const PRICING_CONFIRMED = false;

export const PRICING = {
  currency: "PLN",
  roundTo: 50,
  minimumPrice: 300,
  sizes: [
    { id: "small", maxCm: 5, base: [300, 500], bookingSize: "small" },
    { id: "medium", maxCm: 15, base: [600, 1200], bookingSize: "medium" },
    { id: "large", maxCm: 30, base: [1300, 2600], bookingSize: "large" },
    { id: "extra-large", maxCm: 40, base: [2800, 5000], bookingSize: "extra-large" },
  ],
  placements: [
    { id: "forearm", factor: 1, bookingPlacement: "forearm" },
    { id: "upper-arm", factor: 1, bookingPlacement: "upper-arm" },
    { id: "thigh", factor: 1, bookingPlacement: "thigh" },
    { id: "calf", factor: 1.05, bookingPlacement: "calf" },
    { id: "back", factor: 1.05, bookingPlacement: "back" },
    { id: "chest", factor: 1.1, bookingPlacement: "chest" },
    { id: "neck", factor: 1.2, bookingPlacement: "neck" },
    { id: "hand", factor: 1.2, bookingPlacement: "hand" },
  ],
  detail: [
    { id: "simple", factor: 1 },
    { id: "detailed", factor: 1.3 },
    { id: "intricate", factor: 1.65 },
  ],
  character: [
    { id: "fine-line", factor: 0.9, bookingStyle: "fine-line" },
    { id: "black-grey", factor: 1.1, bookingStyle: "black-grey" },
    { id: "japanese", factor: 1.2, bookingStyle: "japanese-traditional" },
    { id: "color", factor: 1.3, bookingStyle: "japanese-neo-traditional" },
  ],
} as const;

export type PricingSizeId = (typeof PRICING.sizes)[number]["id"];
export type PricingPlacementId = (typeof PRICING.placements)[number]["id"];
export type PricingDetailId = (typeof PRICING.detail)[number]["id"];
export type PricingCharacterId = (typeof PRICING.character)[number]["id"];

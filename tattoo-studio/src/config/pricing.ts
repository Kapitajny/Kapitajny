/**
 * KALKULATOR CENY — WARTOŚCI DO UZUPEŁNIENIA PRZEZ STUDIO.
 *
 * Poniższe liczby są PRZYKŁADOWE i nie są cennikiem studia. Dopóki `PRICING_CONFIRMED`
 * ma wartość `false`, kalkulator wyraźnie oznacza wynik jako wartości poglądowe.
 *
 * Jak liczony jest przedział:
 *   bazowy przedział dla rozmiaru × mnożnik miejsca × mnożnik szczegółowości × mnożnik charakteru,
 *   zaokrąglony do `roundTo`, nie niższy niż `minimumPrice`.
 */

export const PRICING_CONFIRMED = false;

export const PRICING = {
  currency: "PLN",
  roundTo: 50,
  minimumPrice: 300,

  sizes: [
    { id: "small", label: "Small", detail: "do 5 cm", base: [300, 500], bookingSize: "small" },
    { id: "medium", label: "Medium", detail: "5–15 cm", base: [600, 1200], bookingSize: "medium" },
    { id: "large", label: "Large", detail: "15–30 cm", base: [1300, 2600], bookingSize: "large" },
    { id: "extra-large", label: "Extra Large", detail: "ponad 30 cm", base: [2800, 5000], bookingSize: "extra-large" },
  ],

  placements: [
    { id: "forearm", label: "Przedramię", factor: 1, bookingPlacement: "forearm" },
    { id: "upper-arm", label: "Ramię", factor: 1, bookingPlacement: "upper-arm" },
    { id: "thigh", label: "Udo", factor: 1, bookingPlacement: "thigh" },
    { id: "calf", label: "Łydka", factor: 1.05, bookingPlacement: "calf" },
    { id: "back", label: "Plecy", factor: 1.05, bookingPlacement: "back" },
    { id: "chest", label: "Klatka piersiowa", factor: 1.1, bookingPlacement: "chest" },
    { id: "neck", label: "Szyja", factor: 1.2, bookingPlacement: "neck" },
    { id: "hand", label: "Dłoń", factor: 1.2, bookingPlacement: "hand" },
  ],

  detail: [
    { id: "simple", label: "Prosty", description: "Kontur, niewiele wypełnień", factor: 1 },
    { id: "detailed", label: "Szczegółowy", description: "Cieniowanie, więcej elementów", factor: 1.3 },
    { id: "intricate", label: "Bardzo szczegółowy", description: "Gęsta kompozycja, drobny detal", factor: 1.65 },
  ],

  character: [
    { id: "fine-line", label: "Fine line / liternictwo", factor: 0.9, bookingStyle: "fine-line" },
    { id: "black-grey", label: "Black & grey", factor: 1.1, bookingStyle: "black-grey" },
    { id: "japanese", label: "Japoński tradycyjny", factor: 1.2, bookingStyle: "japanese-traditional" },
    { id: "color", label: "Kolor / neo-traditional", factor: 1.3, bookingStyle: "japanese-neo-traditional" },
  ],
} as const;

export type PricingSizeId = (typeof PRICING.sizes)[number]["id"];
export type PricingPlacementId = (typeof PRICING.placements)[number]["id"];
export type PricingDetailId = (typeof PRICING.detail)[number]["id"];
export type PricingCharacterId = (typeof PRICING.character)[number]["id"];

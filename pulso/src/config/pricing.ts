/**
 * ★ Cennik obsługi kampanii.
 *
 * Ceny i zakresy to ROBOCZA propozycja do zatwierdzenia. Zmieniasz je tylko tutaj:
 * sekcja cennika, porównanie pakietów i formularz kontaktowy czytają te same dane.
 */
export type PackageId = "start" | "growth" | "professional";

export type PricingPackage = {
  id: PackageId;
  name: string;
  priceNet: number;
  /** Ile platform reklamowych obejmuje pakiet. */
  platforms: { min: number; max: number };
  platformsLabel: string;
  summary: string;
};

export const currency = "zł";
export const priceSuffix = "netto / miesiąc";
export const pricingIsDraft = true;

export const packages: PricingPackage[] = [
  {
    id: "start",
    name: "START",
    priceNet: 799,
    platforms: { min: 1, max: 1 },
    platformsLabel: "1 platforma reklamowa",
    summary: "Dla firm, które zaczynają od jednego kanału i chcą go dobrze poukładać.",
  },
  {
    id: "growth",
    name: "GROWTH",
    priceNet: 1399,
    platforms: { min: 2, max: 2 },
    platformsLabel: "2 platformy reklamowe",
    summary: "Dla firm, które łączą np. wyszukiwarkę z social media i chcą porównywać kanały.",
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    priceNet: 2199,
    platforms: { min: 3, max: 4 },
    platformsLabel: "do 4 platform reklamowych",
    summary: "Dla firm prowadzących kilka kanałów jednocześnie, z jedną strategią dla całości.",
  },
];

/**
 * Porównanie pakietów. `true` = w zakresie, `false` = poza zakresem, tekst = szczegół zakresu.
 * Kolejność wartości odpowiada kolejności pakietów powyżej.
 */
export const comparison: { feature: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { feature: "Platformy reklamowe", values: ["1", "2", "do 4"] },
  { feature: "Analiza firmy, konkurencji i grupy docelowej", values: [true, true, true] },
  { feature: "Strategia kampanii na piśmie", values: [true, true, true] },
  { feature: "Konfiguracja konta, pikseli i konwersji", values: [true, true, true] },
  { feature: "Bieżąca optymalizacja kampanii", values: [true, true, true] },
  { feature: "Raport z wynikami", values: ["co miesiąc", "co miesiąc", "co 2 tygodnie"] },
  { feature: "Rozmowa podsumowująca", values: ["co miesiąc", "co miesiąc", "co 2 tygodnie"] },
  { feature: "Testy A/B kreacji i grup odbiorców", values: [false, true, true] },
  { feature: "Porównanie skuteczności między kanałami", values: [false, true, true] },
  { feature: "Wspólny plan budżetu dla wszystkich kanałów", values: [false, false, true] },
];

export const budgetNote =
  "Budżet reklamowy nie jest wliczony w cenę obsługi. Płacisz go bezpośrednio platformom reklamowym (Meta, Google, TikTok), z własnej karty lub konta firmowego. Widzisz każdą wydaną złotówkę na fakturach od platform.";

export function formatPrice(value: number): string {
  // Separator tysięcy zawsze (Intl w pl-PL nie grupuje liczb czterocyfrowych); twarda spacja zapobiega łamaniu.
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

export function packageById(id: string | null | undefined): PricingPackage | undefined {
  return packages.find((p) => p.id === id);
}

/** Pakiet dopasowany do liczby platform wybranej przez użytkownika. */
export function packageForPlatformCount(count: number): PricingPackage {
  const n = Math.max(1, Math.min(4, Math.round(count)));
  return packages.find((p) => n >= p.platforms.min && n <= p.platforms.max) ?? packages[packages.length - 1];
}

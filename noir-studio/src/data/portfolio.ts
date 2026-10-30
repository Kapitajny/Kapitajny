import type { Dictionary } from "@/i18n/pl";

/** Kategorie portfolio. Nazwy są w słownikach (`portfolio.categories`). */
export const CATEGORY_IDS = ["weddings", "portraits", "fashion", "commercial", "stories"] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface PortfolioItem {
  /** Klucz zdjęcia – także klucz tytułu i miejsca w słownikach (`portfolio.items`). */
  image: PortfolioImageKey;
  category: CategoryId;
  year: number;
}

export type PortfolioImageKey = keyof Dictionary["portfolio"]["items"];

/** Kolejność odpowiada układowi galerii w widoku „Wszystkie”. */
export const PORTFOLIO: PortfolioItem[] = [
  { image: "weddingVows", category: "weddings", year: 2025 },
  { image: "portraitStudio", category: "portraits", year: 2026 },
  { image: "fashionCoat", category: "fashion", year: 2025 },
  { image: "commercialInterior", category: "commercial", year: 2025 },
  { image: "storyMorning", category: "stories", year: 2024 },
  { image: "weddingWalk", category: "weddings", year: 2024 },

  { image: "portraitWindow", category: "portraits", year: 2025 },
  { image: "fashionStreet", category: "fashion", year: 2026 },
  { image: "commercialProduct", category: "commercial", year: 2026 },
  { image: "storyKitchen", category: "stories", year: 2025 },
  { image: "weddingDetails", category: "weddings", year: 2026 },
  { image: "storySea", category: "stories", year: 2025 },

  { image: "portraitHands", category: "portraits", year: 2024 },
  { image: "fashionMotion", category: "fashion", year: 2025 },
  { image: "commercialCraft", category: "commercial", year: 2025 },
  { image: "weddingDance", category: "weddings", year: 2025 },
  { image: "storyLetters", category: "stories", year: 2026 },
  { image: "commercialArchitecture", category: "commercial", year: 2024 },

  { image: "portraitArtist", category: "portraits", year: 2026 },
  { image: "fashionDetail", category: "fashion", year: 2026 },
];

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
  // Najpierw kadry, które już mają zdjęcia; kategorie przeplatają się.
  { image: "weddingVows", category: "weddings", year: 2025 },
  { image: "portraitWindow", category: "portraits", year: 2025 },
  { image: "storyMorning", category: "stories", year: 2026 },
  { image: "fashionStreet", category: "fashion", year: 2026 },
  { image: "commercialProduct", category: "commercial", year: 2026 },
  { image: "commercialCamera", category: "commercial", year: 2026 },

  { image: "fashionGown", category: "fashion", year: 2026 },
  { image: "fashionSummer", category: "fashion", year: 2025 },
  { image: "portraitRetro", category: "portraits", year: 2024 },
  { image: "storySea", category: "stories", year: 2025 },
  { image: "commercialTools", category: "commercial", year: 2025 },
  { image: "fashionJewelry", category: "fashion", year: 2025 },

  { image: "commercialFood", category: "commercial", year: 2024 },
  { image: "commercialPainting", category: "commercial", year: 2025 },
  { image: "storyKitchen", category: "stories", year: 2025 },
  { image: "weddingDance", category: "weddings", year: 2025 },
  { image: "portraitStudio", category: "portraits", year: 2026 },
  { image: "storyTorun", category: "stories", year: 2024 },

  { image: "weddingWalk", category: "weddings", year: 2025 },
  // Kadry czekające na zdjęcia.
  { image: "weddingDetails", category: "weddings", year: 2026 },
  { image: "portraitHands", category: "portraits", year: 2024 },
];

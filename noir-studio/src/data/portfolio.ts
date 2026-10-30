import type { ImageKey } from "@/config/images";

export const CATEGORIES = [
  { id: "weddings", label: "Weddings" },
  { id: "portraits", label: "Portraits" },
  { id: "fashion", label: "Fashion" },
  { id: "commercial", label: "Commercial" },
  { id: "stories", label: "Personal Stories" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export interface PortfolioItem {
  image: ImageKey;
  category: CategoryId;
  title: string;
  place: string;
  year: number;
}

/** Kolejność odpowiada układowi galerii w widoku „All work”. */
export const PORTFOLIO: PortfolioItem[] = [
  { image: "weddingVows", category: "weddings", title: "Vows by the north window", place: "Kazimierz Dolny", year: 2025 },
  { image: "portraitStudio", category: "portraits", title: "Study in one light", place: "NOIR Studio, Warszawa", year: 2026 },
  { image: "fashionCoat", category: "fashion", title: "Sand coat, concrete stair", place: "Warszawa", year: 2025 },
  { image: "commercialInterior", category: "commercial", title: "Before the first guest", place: "Restaurant interior, Warszawa", year: 2025 },
  { image: "storyMorning", category: "stories", title: "Saturday, before coffee", place: "Warszawa", year: 2024 },
  { image: "weddingWalk", category: "weddings", title: "After the guests", place: "Wilanów, Warszawa", year: 2024 },

  { image: "portraitWindow", category: "portraits", title: "Mokotów, February", place: "Warszawa", year: 2025 },
  { image: "fashionStreet", category: "fashion", title: "Marszałkowska, six in the morning", place: "Warszawa", year: 2026 },
  { image: "commercialProduct", category: "commercial", title: "Vase on stone", place: "Studio still life", year: 2026 },
  { image: "storyKitchen", category: "stories", title: "Sunday dough", place: "Lublin", year: 2025 },
  { image: "weddingDetails", category: "weddings", title: "The second earring", place: "Warszawa", year: 2026 },
  { image: "storySea", category: "stories", title: "Baltic, January", place: "Łeba", year: 2025 },

  { image: "portraitHands", category: "portraits", title: "The pianist's hands", place: "Kraków", year: 2024 },
  { image: "fashionMotion", category: "fashion", title: "Black dress, half turn", place: "NOIR Studio, Warszawa", year: 2025 },
  { image: "commercialCraft", category: "commercial", title: "Saddle stitch", place: "Leather workshop, Poznań", year: 2025 },
  { image: "weddingDance", category: "weddings", title: "First dance, last candles", place: "Mazury", year: 2025 },
  { image: "storyLetters", category: "stories", title: "Everything she kept", place: "Toruń", year: 2026 },
  { image: "commercialArchitecture", category: "commercial", title: "Facade at blue hour", place: "Gdańsk", year: 2024 },

  { image: "portraitArtist", category: "portraits", title: "Painter among canvases", place: "Łódź", year: 2026 },
  { image: "fashionDetail", category: "fashion", title: "Lapel and silver", place: "NOIR Studio, Warszawa", year: 2026 },
];

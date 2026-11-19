import type { WorkId, WorkStyle } from "./work";

/**
 * SPECJALIZACJE — dane techniczne (nazwy i opisy w słownikach: `specialties.items`).
 * Brak `image` = panel „miejsce na zdjęcie”. `galleryFilter` dodaje link filtrujący galerię.
 */
export const SPECIALTIES = [
  { id: "japanese-traditional", kanji: "和彫", reading: "wabori", pattern: "seigaiha" },
  { id: "japanese-neo-traditional", kanji: "新和", reading: "shin-wa", pattern: "asanoha" },
  { id: "black-grey", kanji: "墨", reading: "sumi", pattern: "kumiko", image: "skull-anubis", galleryFilter: "black-grey" },
  { id: "fine-line", kanji: "線", reading: "sen", pattern: "asanoha", image: "lotus-spine", galleryFilter: "fine-line" },
  { id: "japanese-symbolism", kanji: "象", reading: "shō", pattern: "seigaiha", image: "tiger-chest" },
  { id: "custom", kanji: "創", reading: "sō", pattern: "kumiko", image: "lotus-hip", galleryFilter: "ornamental" },
] as const satisfies readonly {
  id: string;
  kanji: string;
  reading: string;
  pattern: "seigaiha" | "asanoha" | "kumiko";
  image?: WorkId;
  galleryFilter?: WorkStyle;
}[];

export type SpecialtyId = (typeof SPECIALTIES)[number]["id"];

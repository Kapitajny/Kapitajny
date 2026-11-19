/**
 * OPINIE KLIENTÓW.
 *
 * Wpisuj wyłącznie prawdziwe opinie, za zgodą autorów, z podaniem źródła (np. Google, Instagram).
 * Dopóki lista jest pusta, sekcja pokazuje oznaczone miejsca na przyszłe opinie i materiały.
 *
 * Przykład wpisu:
 * {
 *   author: "Anna K.",
 *   rating: 5,
 *   text: "…",
 *   source: "Google",
 *   sourceUrl: "https://…",
 *   date: "2026-10-01",
 *   image: "lotus-spine", // opcjonalnie — id pracy z config/work.ts
 *   lang: "pl", // język oryginału opinii — opinie wyświetlamy w oryginalnym brzmieniu
 * }
 */

export interface Review {
  author: string;
  /** Ocena 1–5. */
  rating: number;
  text: string;
  source: string;
  sourceUrl?: string;
  /** RRRR-MM-DD */
  date?: string;
  /** id pracy z config/work.ts — opcjonalne zdjęcie. */
  image?: string;
  /** Język, w którym napisano opinię (pokazujemy ją w oryginale). */
  lang: "pl" | "en";
}

export const REVIEWS: Review[] = [];

/** Pokazuj oznaczone miejsca na opinie, gdy lista jest pusta. Ustaw `false`, aby ukryć sekcję. */
export const SHOW_REVIEW_PLACEHOLDERS = true;

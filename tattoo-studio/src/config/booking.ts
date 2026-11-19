/**
 * OPCJE FORMULARZA — identyfikatory (etykiety w słownikach: `booking.options`).
 * Te same listy wykorzystuje walidacja po stronie serwera.
 */

export const STYLE_OPTIONS = [
  { id: "japanese-traditional", image: null },
  { id: "japanese-neo-traditional", image: null },
  { id: "black-grey", image: "wolf-peony" },
  { id: "fine-line", image: "lotus-spine" },
  { id: "realism", image: "skull-anubis" },
  { id: "minimalist", image: "fine-line-lettering" },
  { id: "other", image: null },
] as const;

export const PLACEMENT_IDS = ["arm", "forearm", "upper-arm", "full-sleeve", "chest", "back", "neck", "leg", "thigh", "calf", "hand", "other"] as const;
export const SIDE_IDS = ["left", "right", "both", "not-sure"] as const;
export const SIZE_IDS = ["small", "medium", "large", "extra-large", "sleeve", "not-sure"] as const;
export const BUDGET_IDS = ["under-500", "500-1000", "1000-2000", "2000-4000", "4000-plus", "consultation"] as const;
export const TIME_IDS = ["any", "morning", "afternoon", "evening"] as const;

export type StyleId = (typeof STYLE_OPTIONS)[number]["id"];
export type PlacementId = (typeof PLACEMENT_IDS)[number];
export type SideId = (typeof SIDE_IDS)[number];
export type SizeId = (typeof SIZE_IDS)[number];
export type BudgetId = (typeof BUDGET_IDS)[number];
export type TimeId = (typeof TIME_IDS)[number];

/** Limity załączników — wspólne dla przeglądarki i serwera. */
export const UPLOAD_LIMITS = {
  maxFiles: 5,
  /** Maksymalny rozmiar pliku wybranego przez użytkownika (przed kompresją w przeglądarce). */
  maxSourceBytes: 20 * 1024 * 1024,
  /** Maksymalny rozmiar pojedynczego pliku przyjmowany przez serwer. */
  maxFileBytes: 4 * 1024 * 1024,
  /** Maksymalny łączny rozmiar załączników przyjmowany przez serwer. */
  maxTotalBytes: 12 * 1024 * 1024,
  /** Dłuższy bok zdjęcia po kompresji w przeglądarce. */
  maxDimension: 2000,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  acceptAttribute: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
};

/**
 * OPCJE FORMULARZA „BOOK YOUR TATTOO”.
 * Te same listy wykorzystuje walidacja po stronie serwera — zmiana tutaj zmienia obie strony.
 */

export const STYLE_OPTIONS = [
  { id: "japanese-traditional", label: "Japanese Traditional", hint: "Bold outlines, classic irezumi motifs.", image: null },
  { id: "japanese-neo-traditional", label: "Japanese Neo-Traditional", hint: "Traditional motifs, modern rendering.", image: null },
  { id: "black-grey", label: "Black & Grey", hint: "Soft shading in black and grey tones.", image: "wolf-peony" },
  { id: "fine-line", label: "Fine Line", hint: "Thin, precise lines and delicate detail.", image: "lotus-spine" },
  { id: "realism", label: "Realism", hint: "Lifelike portraits and objects.", image: "money-mask" },
  { id: "minimalist", label: "Minimalist", hint: "Small, simple forms with lots of space.", image: "fine-line-lettering" },
  { id: "other", label: "Other / Not Sure Yet", hint: "We'll help you find the right direction.", image: null },
] as const;

export const PLACEMENT_OPTIONS = [
  { id: "arm", label: "Arm" },
  { id: "forearm", label: "Forearm" },
  { id: "upper-arm", label: "Upper Arm" },
  { id: "full-sleeve", label: "Full Sleeve" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "neck", label: "Neck" },
  { id: "leg", label: "Leg" },
  { id: "thigh", label: "Thigh" },
  { id: "calf", label: "Calf" },
  { id: "hand", label: "Hand" },
  { id: "other", label: "Other / Not Sure Yet" },
] as const;

export const SIDE_OPTIONS = [
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
  { id: "both", label: "Both" },
  { id: "not-sure", label: "Not Sure" },
] as const;

export const SIZE_OPTIONS = [
  { id: "small", label: "Small", detail: "up to 5 cm" },
  { id: "medium", label: "Medium", detail: "5–15 cm" },
  { id: "large", label: "Large", detail: "15–30 cm" },
  { id: "extra-large", label: "Extra Large", detail: "over 30 cm" },
  { id: "sleeve", label: "Full Sleeve / Large Composition", detail: "multi-session project" },
  { id: "not-sure", label: "Not Sure Yet", detail: "we'll decide together" },
] as const;

export const BUDGET_OPTIONS = [
  { id: "under-500", label: "Under 500 PLN" },
  { id: "500-1000", label: "500–1,000 PLN" },
  { id: "1000-2000", label: "1,000–2,000 PLN" },
  { id: "2000-4000", label: "2,000–4,000 PLN" },
  { id: "4000-plus", label: "4,000+ PLN" },
  { id: "consultation", label: "I need a consultation first" },
] as const;

export const TIME_OPTIONS = [
  { id: "any", label: "Any time" },
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
] as const;

export type StyleId = (typeof STYLE_OPTIONS)[number]["id"];
export type PlacementId = (typeof PLACEMENT_OPTIONS)[number]["id"];
export type SideId = (typeof SIDE_OPTIONS)[number]["id"];
export type SizeId = (typeof SIZE_OPTIONS)[number]["id"];
export type BudgetId = (typeof BUDGET_OPTIONS)[number]["id"];
export type TimeId = (typeof TIME_OPTIONS)[number]["id"];

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

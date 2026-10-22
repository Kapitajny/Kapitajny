export const LEVELS = {
  start: { label: "Od zera", description: "Bez wcześniejszego doświadczenia" },
  basic: { label: "Podstawowy", description: "Znasz pierwsze kroki i chcesz je utrwalić" },
  intermediate: { label: "Średniozaawansowany", description: "Tańczysz regularnie od kilku miesięcy" },
  advanced: { label: "Zaawansowany", description: "Szlifujesz technikę i pracujesz nad choreografią" },
} as const;

export type LevelId = keyof typeof LEVELS;

export const LEVEL_IDS = Object.keys(LEVELS) as LevelId[];

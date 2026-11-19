/**
 * ZDJĘCIA PRAC — dane techniczne. Podpisy i opisy alternatywne są w słownikach
 * (`src/i18n/dictionaries/*.ts`, klucz `work.items`), osobno dla każdego języka.
 *
 * Aby dodać pracę: wgraj plik do `public/images/work/`, dopisz wpis poniżej (wymiary w pikselach)
 * i dodaj teksty w obu słownikach — TypeScript wskaże brakujące tłumaczenia.
 *
 * WAŻNE — `PORTFOLIO_IS_SAMPLE`
 * Obecne zdjęcia to materiał roboczy: część ma znaki wodne innych studiów (`credit`), żadne nie przedstawia
 * pracy w stylu japońskim. Dopóki flaga ma wartość `true`, strona oznacza je jako zdjęcia poglądowe.
 */

export const PORTFOLIO_IS_SAMPLE = true;

export const WORK_DIR = "/images/work";

export const WORK_STYLES = ["black-grey", "fine-line", "ornamental", "blackwork", "color"] as const;
export type WorkStyle = (typeof WORK_STYLES)[number];

export interface WorkItem {
  id: string;
  file: string;
  width: number;
  height: number;
  style: WorkStyle;
  /** Autor/studio ze znaku wodnego — gdy zdjęcie nie jest pracą tego studia. */
  credit?: string;
}

export const WORK = [
  { id: "candle-lantern", file: "candle-lantern-sleeve.jpg", width: 468, height: 654, style: "color" },
  { id: "wolf-peony", file: "wolf-peony-half-sleeve.jpg", width: 498, height: 615, style: "black-grey", credit: "Aggie Tattoo" },
  { id: "lotus-spine", file: "lotus-spine.jpg", width: 447, height: 447, style: "fine-line" },
  { id: "skull-anubis", file: "skull-anubis-sleeve.jpg", width: 448, height: 685, style: "black-grey" },
  { id: "tiger-chest", file: "tiger-chest.jpg", width: 447, height: 447, style: "black-grey" },
  { id: "floral-mandala", file: "floral-mandala-forearm.jpg", width: 480, height: 639, style: "black-grey" },
  { id: "polynesian-sleeve", file: "polynesian-sleeve.jpg", width: 415, height: 739, style: "blackwork" },
  { id: "tigers-leg", file: "tigers-linework-leg.jpg", width: 554, height: 554, style: "fine-line" },
  { id: "lotus-hip", file: "lotus-hip.jpg", width: 588, height: 447, style: "ornamental" },
  { id: "fine-line-lettering", file: "fine-line-lettering-arm.jpg", width: 495, height: 619, style: "fine-line", credit: "Genrava / Zajawa Gdańsk" },
  { id: "ship-shoulder", file: "ship-shoulder.jpg", width: 447, height: 447, style: "color", credit: "Moko Tusz" },
  { id: "money-mask", file: "money-mask-sleeve.jpg", width: 424, height: 471, style: "black-grey" },
  { id: "polynesian", file: "polynesian-chest-sleeve.jpg", width: 468, height: 600, style: "blackwork" },
  { id: "spider-color", file: "spider-color-head.jpg", width: 387, height: 516, style: "color" },
  { id: "lotus-thighs", file: "lotus-thighs.jpg", width: 739, height: 415, style: "ornamental" },
  { id: "clown-mask", file: "clown-mask-forearm.jpg", width: 377, height: 530, style: "black-grey", credit: "Gans Tattoo" },
  { id: "tiger-calf", file: "tiger-linework-calf.jpg", width: 300, height: 300, style: "fine-line" },
  { id: "cards-dice", file: "cards-dice-forearm.jpg", width: 236, height: 396, style: "black-grey" },
  { id: "mask-calf", file: "mask-money-calf.jpg", width: 236, height: 408, style: "black-grey" },
  { id: "spider-chest", file: "spider-blackwork-chest.jpg", width: 194, height: 259, style: "blackwork" },
] as const satisfies readonly WorkItem[];

export type WorkId = (typeof WORK)[number]["id"];

export function workById(id: WorkId): WorkItem {
  return WORK.find((w) => w.id === id)!;
}

export function workSrc(item: WorkItem): string {
  return `${WORK_DIR}/${item.file}`;
}

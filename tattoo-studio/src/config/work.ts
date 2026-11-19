/**
 * ZDJĘCIA PRAC
 *
 * Pliki leżą w `public/images/work/`. Aby dodać pracę: wgraj plik i dopisz wpis poniżej
 * (wymiary w pikselach — potrzebne do układu bez przeskoków).
 *
 * WAŻNE — `PORTFOLIO_IS_SAMPLE`
 * Obecne zdjęcia zostały dostarczone jako materiał roboczy. Część z nich ma znaki wodne innych
 * studiów (`credit`), a żadne nie przedstawia pracy w stylu japońskim. Dopóki ta flaga ma wartość
 * `true`, strona uczciwie oznacza je jako zdjęcia poglądowe. Po podmianie na własne realizacje
 * studia ustaw `false`.
 */

export const PORTFOLIO_IS_SAMPLE = true;

export const WORK_DIR = "/images/work";

export type WorkStyle = "black-grey" | "fine-line" | "ornamental" | "blackwork" | "color";

export const WORK_STYLES: { id: WorkStyle; label: string }[] = [
  { id: "black-grey", label: "Black & Grey" },
  { id: "fine-line", label: "Fine Line" },
  { id: "ornamental", label: "Ornamental" },
  { id: "blackwork", label: "Blackwork" },
  { id: "color", label: "Color" },
];

export interface WorkItem {
  id: string;
  file: string;
  width: number;
  height: number;
  alt: string;
  /** Krótki podpis widoczny pod zdjęciem. */
  title: string;
  placement: string;
  style: WorkStyle;
  /** Autor/studio widoczne na znaku wodnym — jeśli zdjęcie nie jest pracą tego studia. */
  credit?: string;
}

export const WORK: WorkItem[] = [
  {
    id: "wolf-peony",
    file: "wolf-peony-half-sleeve.jpg",
    width: 498,
    height: 615,
    alt: "Tatuaż black & grey na ramieniu: wilk otoczony kwiatami piwonii i liśćmi",
    title: "Wilk i piwonie",
    placement: "Ramię",
    style: "black-grey",
    credit: "Aggie Tattoo",
  },
  {
    id: "lotus-spine",
    file: "lotus-spine.jpg",
    width: 447,
    height: 447,
    alt: "Delikatny tatuaż kwiatu lotosu z ornamentem wzdłuż kręgosłupa",
    title: "Lotos",
    placement: "Plecy",
    style: "fine-line",
  },
  {
    id: "tiger-chest",
    file: "tiger-chest.jpg",
    width: 447,
    height: 447,
    alt: "Realistyczny tatuaż głowy tygrysa na klatce piersiowej",
    title: "Tygrys",
    placement: "Klatka piersiowa",
    style: "black-grey",
  },
  {
    id: "floral-mandala",
    file: "floral-mandala-forearm.jpg",
    width: 480,
    height: 639,
    alt: "Tatuaż na przedramieniu: róża, mandala i kwiaty hibiskusa w cieniowaniu black & grey",
    title: "Róża i mandala",
    placement: "Przedramię",
    style: "black-grey",
  },
  {
    id: "lotus-hip",
    file: "lotus-hip.jpg",
    width: 588,
    height: 447,
    alt: "Ornamentalny tatuaż lotosu z zawieszonymi piórami na biodrze i udzie",
    title: "Lotos z piórami",
    placement: "Biodro",
    style: "ornamental",
  },
  {
    id: "fine-line-lettering",
    file: "fine-line-lettering-arm.jpg",
    width: 495,
    height: 619,
    alt: "Cienki, kaligraficzny napis „C'est la vie” na ramieniu",
    title: "C'est la vie",
    placement: "Ramię",
    style: "fine-line",
    credit: "Genrava / Zajawa Gdańsk",
  },
  {
    id: "polynesian",
    file: "polynesian-chest-sleeve.jpg",
    width: 468,
    height: 600,
    alt: "Tatuaż w stylu polinezyjskim obejmujący klatkę piersiową, bark i całe ramię",
    title: "Ornament polinezyjski",
    placement: "Klatka piersiowa i rękaw",
    style: "blackwork",
  },
  {
    id: "money-mask",
    file: "money-mask-sleeve.jpg",
    width: 424,
    height: 471,
    alt: "Realistyczny rękaw: kobieca twarz, maska i banknoty",
    title: "Maska i banknoty",
    placement: "Pełny rękaw",
    style: "black-grey",
  },
  {
    id: "spider-color",
    file: "spider-color-head.jpg",
    width: 387,
    height: 516,
    alt: "Kolorowy tatuaż pająka z pajęczyną na boku głowy",
    title: "Pająk i pajęczyna",
    placement: "Głowa",
    style: "color",
  },
  {
    id: "lotus-thighs",
    file: "lotus-thighs.jpg",
    width: 739,
    height: 415,
    alt: "Dwa symetryczne ornamentalne tatuaże lotosu z tyłu ud",
    title: "Lotosy w symetrii",
    placement: "Uda",
    style: "ornamental",
  },
  {
    id: "clown-mask",
    file: "clown-mask-forearm.jpg",
    width: 377,
    height: 530,
    alt: "Realistyczny tatuaż na przedramieniu: postać z makijażem klauna i maska",
    title: "Dwie maski",
    placement: "Przedramię",
    style: "black-grey",
    credit: "Gans Tattoo",
  },
  {
    id: "cards-dice",
    file: "cards-dice-forearm.jpg",
    width: 236,
    height: 396,
    alt: "Tatuaż black & grey: karty, kości do gry, łańcuch i bila numer osiem",
    title: "Karty i kości",
    placement: "Przedramię",
    style: "black-grey",
  },
  {
    id: "mask-calf",
    file: "mask-money-calf.jpg",
    width: 236,
    height: 408,
    alt: "Tatuaż na łydce: maska, kobieca twarz i worek z pieniędzmi",
    title: "Maska",
    placement: "Łydka",
    style: "black-grey",
  },
  {
    id: "spider-chest",
    file: "spider-blackwork-chest.jpg",
    width: 194,
    height: 259,
    alt: "Mały, wypełniony czernią tatuaż pająka na środku klatki piersiowej",
    title: "Pająk",
    placement: "Klatka piersiowa",
    style: "blackwork",
  },
];

export function workById(id: string): WorkItem {
  const item = WORK.find((w) => w.id === id);
  if (!item) throw new Error(`Unknown work item: ${id}`);
  return item;
}

export function workSrc(item: WorkItem): string {
  return `${WORK_DIR}/${item.file}`;
}

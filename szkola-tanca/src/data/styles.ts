import type { PhotoKey } from "@/config/photos";
import type { LevelId } from "./levels";

export interface DanceStyle {
  id: string;
  name: string;
  /** Jedno zdanie do listy stylów. */
  tagline: string;
  description: string;
  /** Poziomy, na których prowadzimy grupy (patrz grafik). */
  levels: LevelId[];
  /** Typowy czas zajęć w minutach. */
  duration: string;
  bring: string;
  /** `null` – brak odpowiedniego zdjęcia; wyświetlany jest placeholder. */
  photo: { key: PhotoKey; position: string; zoom?: number } | null;
}

export const STYLES: DanceStyle[] = [
  {
    id: "pierwsze-kroki",
    name: "Pierwsze kroki",
    tagline: "Zajęcia dla osób, które nigdy nie tańczyły",
    description:
      "Spokojne wprowadzenie do tańca: rytm, koordynacja, praca z ciałem i krótkie układy z elementów różnych stylów. Każdy ruch rozkładamy na części i powtarzamy tyle razy, ile potrzeba.",
    levels: ["start"],
    duration: "60 min",
    bring: "Wygodny strój i obuwie sportowe na czystej podeszwie",
    photo: { key: "classJoy", position: "18% 40%", zoom: 1.55 },
  },
  {
    id: "wspolczesny",
    name: "Taniec współczesny",
    tagline: "Płynność, oddech i praca w parterze",
    description:
      "Ruch wynikający z oddechu i ciężaru ciała. Uczymy przejść do parteru, obrotów i improwizacji, a z czasem budujemy z nich choreografię. Dobre miejsce, by poczuć ciało na nowo.",
    levels: ["basic", "intermediate", "advanced"],
    duration: "75–90 min",
    bring: "Wygodny strój, skarpetki lub boso",
    photo: { key: "teamMotion", position: "40% 60%", zoom: 1.35 },
  },
  {
    id: "hip-hop",
    name: "Hip-hop",
    tagline: "Groove, energia i taniec do ulubionej muzyki",
    description:
      "Zaczynamy od bounce’u i podstawowych kroków, potem łączymy je w krótkie choreografie. Dużo muzyki, dużo powtórzeń i zero oceniania – liczy się frajda z ruchu.",
    levels: ["start", "basic", "intermediate", "advanced"],
    duration: "60–75 min",
    bring: "Luźny strój i czyste sneakersy",
    photo: { key: "classJoy", position: "86% 45%", zoom: 1.6 },
  },
  {
    id: "balet",
    name: "Balet dla dorosłych",
    tagline: "Postawa, równowaga i praca przy drążku",
    description:
      "Klasyczna technika w wersji dla dorosłych: ćwiczenia przy drążku, na środku sali i proste kombinacje. Wzmacnia, wydłuża sylwetkę i uczy precyzji bez wymagań baletowej szkoły.",
    levels: ["start", "basic"],
    duration: "60–75 min",
    bring: "Dopasowany strój, baletki lub skarpetki",
    photo: { key: "studioHall", position: "72% 62%", zoom: 1.7 },
  },
  {
    id: "high-heels",
    name: "High heels",
    tagline: "Pewność siebie, linia ciała i zmysłowa choreografia",
    description:
      "Choreografie na obcasach z naciskiem na stabilność, pracę bioder i świadomość ciała. Na pierwszych zajęciach możesz tańczyć w sneakersach – obcasy dołączamy, kiedy poczujesz się gotowa lub gotowy.",
    levels: ["start", "basic", "intermediate"],
    duration: "60 min",
    bring: "Stabilne buty na obcasie (opcjonalnie) i nakolanniki",
    photo: null,
  },
];

export function getStyle(id: string): DanceStyle | undefined {
  return STYLES.find((style) => style.id === id);
}

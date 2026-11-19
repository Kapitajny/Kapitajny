/**
 * SPECJALIZACJE (sekcja „Our Specialties”).
 * `image` wskazuje id z `config/work.ts`. Brak `image` = elegancki panel-zastępnik
 * z oznaczeniem „miejsce na zdjęcie” — wstaw zdjęcie, gdy studio będzie mieć realizację w danym stylu.
 */

export interface Specialty {
  id: string;
  name: string;
  /** Znak/wyraz w panelu zastępczym. */
  kanji: string;
  kanjiReading: string;
  description: string;
  image?: string;
  pattern: "seigaiha" | "asanoha" | "kumiko";
}

export const SPECIALTIES: Specialty[] = [
  {
    id: "japanese-traditional",
    name: "Japanese Traditional",
    kanji: "和彫",
    kanjiReading: "wabori",
    description:
      "Klasyczne motywy irezumi: wyraźny kontur, płaskie wypełnienia i tło z fal, chmur lub wiatru, które spaja całą kompozycję z linią ciała.",
    pattern: "seigaiha",
  },
  {
    id: "japanese-neo-traditional",
    name: "Japanese Neo-Traditional",
    kanji: "新和",
    kanjiReading: "shin-wa",
    description:
      "Tradycyjne japońskie motywy w świeższej formie — bogatsze przejścia tonalne, swobodniejsza paleta i współczesne proporcje.",
    pattern: "asanoha",
  },
  {
    id: "black-grey",
    name: "Black & Grey",
    kanji: "墨",
    kanjiReading: "sumi",
    description: "Praca samą czernią i jej rozcieńczeniami. Miękkie cieniowanie, głęboki kontrast i światło budowane odcieniem szarości.",
    image: "wolf-peony",
    pattern: "kumiko",
  },
  {
    id: "fine-line",
    name: "Fine Line",
    kanji: "線",
    kanjiReading: "sen",
    description: "Cienka, precyzyjna linia i dużo oddechu wokół motywu. Dla subtelnych projektów, liternictwa i drobnych form.",
    image: "lotus-spine",
    pattern: "asanoha",
  },
  {
    id: "japanese-symbolism",
    name: "Japanese Symbolism",
    kanji: "象",
    kanjiReading: "shō",
    description:
      "Tygrys, smok, karp koi, kwiat wiśni, maska Hannya. Motywy dobierane świadomie — z uwagą na ich znaczenie i wzajemne relacje w kompozycji.",
    image: "tiger-chest",
    pattern: "seigaiha",
  },
  {
    id: "custom",
    name: "Custom Tattoo Designs",
    kanji: "創",
    kanjiReading: "sō",
    description:
      "Projekt rysowany od zera na podstawie Twojej historii. Kompozycja, skala i umiejscowienie dopasowane do konkretnej osoby i konkretnego miejsca na ciele.",
    image: "lotus-hip",
    pattern: "kumiko",
  },
];

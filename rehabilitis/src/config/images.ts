/**
 * ★ CENTRALNA MAPA ZDJĘĆ
 *
 * Zdjęcia leżą w katalogu `public/images/rehab/`. Aby podmienić grafikę, wgraj plik
 * o nazwie z pola `file` (albo zmień nazwę tutaj). Brakujące zdjęcie nie psuje strony –
 * w jego miejscu wyświetla się spokojny placeholder (patrz `components/ui/Photo.tsx`).
 *
 * `illustrative: true` dodaje do zdjęcia dyskretny podpis „Zdjęcie poglądowe”, aby nie sugerować,
 * że przedstawione osoby to pracownicy lub pacjenci gabinetu. Po wgraniu własnych zdjęć
 * z gabinetu (za zgodą osób na zdjęciach) ustaw `illustrative: false`.
 *
 * Zalecenia: JPG/WebP, min. 1600 px po dłuższym boku. Po dodaniu plików w trybie
 * produkcyjnym przebuduj projekt (`npm run build`).
 */

export const IMAGE_DIR = "/images/rehab";

export interface ImageDefinition {
  file: string;
  alt: string;
  /** Sugerowane proporcje zdjęcia – tylko informacyjnie, zdjęcie jest kadrowane przez `object-fit: cover`. */
  aspect: string;
  /** Punkt kadrowania (CSS `object-position`), żeby przy różnych proporcjach nie ucinać najważniejszego fragmentu. */
  position: string;
  illustrative: boolean;
}

export const IMAGES = {
  /** Hero i obraz udostępniania: praca z pacjentem w jasnym gabinecie. */
  hero: {
    file: "terapia-biodra-gabinet.jpg",
    alt: "Fizjoterapeutka zgina nogę pacjentki leżącej na stole terapeutycznym w jasnym gabinecie",
    aspect: "3:2",
    position: "40% 50%",
    illustrative: true,
  },
  serviceIndividual: {
    file: "fizjoterapeuta-z-pacjentem.jpg",
    alt: "Fizjoterapeutka prowadzi ćwiczenie ruchomości biodra u pacjenta leżącego na boku na stole terapeutycznym",
    aspect: "1:1",
    position: "50% 50%",
    illustrative: true,
  },
  serviceOrthopedic: {
    file: "terapia-kolana.jpg",
    alt: "Fizjoterapeutka obejmuje dłońmi zgięte kolano pacjenta leżącego na macie",
    aspect: "5:4",
    position: "55% 45%",
    illustrative: true,
  },
  serviceBack: {
    file: "cwiczenia-na-pilce.jpg",
    alt: "Ćwiczenie mobilności kręgosłupa na dużej piłce gimnastycznej z asekuracją terapeuty",
    aspect: "3:2",
    position: "50% 50%",
    illustrative: true,
  },
  serviceMassage: {
    file: "terapia-manualna-bark.jpg",
    alt: "Terapeutka pracuje dłońmi z barkiem i biodrem pacjentki leżącej na boku",
    aspect: "3:2",
    position: "55% 40%",
    illustrative: true,
  },
  servicePostOp: {
    file: "cwiczenia-z-tasma.jpg",
    alt: "Pacjent leżący na stole terapeutycznym wykonuje ćwiczenie nogi z taśmą oporową pod kontrolą terapeuty",
    aspect: "3:2",
    position: "60% 40%",
    illustrative: true,
  },
  serviceExercise: {
    file: "cwiczenia-stabilizacyjne.jpg",
    alt: "Mężczyzna wykonuje na macie ćwiczenie stabilizacji tułowia z uniesioną ręką i nogą",
    aspect: "3:2",
    position: "50% 50%",
    illustrative: true,
  },
  /** Miejsce na prawdziwe zdjęcie fizjoterapeuty – plik celowo jeszcze nie istnieje. */
  therapist: {
    file: "fizjoterapeuta-portret.jpg",
    alt: "Portret fizjoterapeuty prowadzącego gabinet",
    aspect: "4:5",
    position: "50% 30%",
    illustrative: false,
  },
  /** Miejsce na prawdziwe zdjęcie wnętrza gabinetu – plik celowo jeszcze nie istnieje. */
  clinicRoom: {
    file: "gabinet-wnetrze.jpg",
    alt: "Wnętrze gabinetu rehabilitacji",
    aspect: "16:10",
    position: "50% 50%",
    illustrative: false,
  },
} satisfies Record<string, ImageDefinition>;

export type ImageKey = keyof typeof IMAGES;

/** Obraz po sprawdzeniu, czy plik istnieje w `public/`. */
export interface ResolvedImage {
  key: ImageKey;
  /** `null`, gdy pliku nie ma – wtedy renderowany jest placeholder. */
  src: string | null;
  /** Oczekiwana ścieżka pliku (dla osoby edytującej stronę, gdy zdjęcia brakuje). */
  expectedPath: string;
  alt: string;
  illustrative: boolean;
  position: string;
}

export type ImageManifest = Record<ImageKey, ResolvedImage>;

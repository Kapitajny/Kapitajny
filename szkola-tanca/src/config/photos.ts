import type { StaticImageData } from "next/image";
import classJoy from "@/assets/photos/class-joy.jpg";
import instructorDaniel from "@/assets/photos/instructor-daniel.jpg";
import instructorHana from "@/assets/photos/instructor-hana.jpg";
import instructorKai from "@/assets/photos/instructor-kai.jpg";
import instructorLena from "@/assets/photos/instructor-lena.jpg";
import studioHall from "@/assets/photos/studio-hall.jpg";
import teamMotion from "@/assets/photos/team-motion.jpg";

/**
 * CENTRALNA MAPA ZDJĘĆ
 *
 * Źródła (oryginały) leżą w `assets-source/`, a wersje używane na stronie – po korekcie koloru
 * do palety marki – w `src/assets/photos/` (patrz `scripts/grade-photos.py`).
 * Portrety instruktorów są kadrami ze zdjęcia zespołu.
 *
 * Aby podmienić zdjęcie, zastąp plik w `src/assets/photos/` (ta sama nazwa) albo zmień import poniżej.
 * Wymiary i rozmyty podgląd (blur) Next.js odczytuje automatycznie z importu.
 */

export interface PhotoDefinition {
  src: StaticImageData;
  alt: string;
}

export const PHOTOS = {
  classJoy: {
    src: classJoy,
    alt: "Uśmiechnięta tancerka prowadzi grupę podczas zajęć w sali z drewnianą podłogą",
  },
  teamMotion: {
    src: teamMotion,
    alt: "Pięcioro tancerzy w ruchu: skok, praca w parterze i szerokie wykroki na tle luster",
  },
  studioHall: {
    src: studioHall,
    alt: "Jasna sala taneczna z drewnianą podłogą, lustrami na całej ścianie, drążkami baletowymi i dużymi oknami",
  },
  instructorHana: { src: instructorHana, alt: "Portret instruktorki Hany w tanecznym wykroku" },
  instructorDaniel: { src: instructorDaniel, alt: "Portret instruktora Daniela z uniesioną ręką" },
  instructorKai: { src: instructorKai, alt: "Portret instruktora Kaia w wyskoku" },
  instructorLena: { src: instructorLena, alt: "Portret instruktorki Leny podczas pracy w parterze" },
} satisfies Record<string, PhotoDefinition>;

export type PhotoKey = keyof typeof PHOTOS;

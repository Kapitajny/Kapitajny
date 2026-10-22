import type { StaticImageData } from "next/image";
import cityData from "@/assets/miasto-danych.jpg";
import lightLines from "@/assets/linie-swiatla.jpg";
import networkProtection from "@/assets/ochrona-sieci.jpg";
import dataTunnel from "@/assets/tunel-danych.jpg";

export type IllustrationName = "ochrona-sieci" | "tunel-danych" | "linie-swiatla" | "miasto-danych";

type IllustrationAsset = { src: StaticImageData; alt: string };

// Teksty alternatywne opisują, co widać na grafice – wszystkie są abstrakcyjnymi ilustracjami, nie zdjęciami realizacji.
export const illustrations: Record<IllustrationName, IllustrationAsset> = {
  "ochrona-sieci": {
    src: networkProtection,
    alt: "Nocna panorama miasta pokryta siecią połączeń, na której węzłach widać symbole kłódek i ostrzeżeń – ilustracja ochrony infrastruktury IT.",
  },
  "tunel-danych": {
    src: dataTunnel,
    alt: "Tunel ze świetlistych strumieni danych w odcieniach błękitu, różu i pomarańczu – ilustracja przepływu danych między systemami.",
  },
  "linie-swiatla": {
    src: lightLines,
    alt: "Turkusowe linie światła biegnące w głąb przestrzeni wśród kolorowych punktów – ilustracja sieci firmowej.",
  },
  "miasto-danych": {
    src: cityData,
    alt: "Granatowy krajobraz ułożony ze świecących punktów, przypominający miasto zbudowane z danych.",
  },
};

import type { StaticImageData } from "next/image";
import shopCounter from "@/assets/morelowa/lokal-lada.jpg";
import breadImage from "@/assets/morelowa/pieczywo-krojenie-chleba.jpg";
import craftImage from "@/assets/morelowa/historia-piekarz-przy-stole.jpg";
import heroImage from "@/assets/morelowa/hero-piekarnia-piec.jpg";
import patisserieImage from "@/assets/morelowa/cukiernia-torty-i-tarty.jpg";

/**
 * Pięć głównych fotografii strony – każda użyta dokładnie raz, w innej sekcji.
 * Pliki leżą w `src/assets/morelowa/`; import statyczny daje Next.js wymiary
 * i rozmyty podgląd (placeholder="blur") bez dodatkowej konfiguracji.
 * Źródła są kwadratowe – kadr w sekcjach ustawia `object-position`.
 */
export interface SitePhoto {
  src: StaticImageData;
  alt: string;
}

export const photos = {
  hero: {
    src: heroImage,
    alt: "Piekarz wsuwa łopatą bochenek chleba do rozgrzanego pieca opalanego drewnem; na stole wyrastające ciasto w koszykach i świeże bochenki",
  },
  bread: {
    src: breadImage,
    alt: "Piekarz kroi bochenek chleba na drewnianej desce, wokół kosze z chlebami na zakwasie i bagietkami",
  },
  patisserie: {
    src: patisserieImage,
    alt: "Piętrowy tort z morelami na paterze, tarta owocowa i monoporcje na marmurowym blacie",
  },
  craft: {
    src: craftImage,
    alt: "Piekarz przy pracy przy drewnianym stole posypanym mąką, za nim drewniane półki pełne bochenków",
  },
  shop: {
    src: shopCounter,
    alt: "Piekarz podaje klientce bochenek chleba nad drewnianą ladą, w tle półki z pieczywem i wiklinowe kosze z bagietkami",
  },
} satisfies Record<string, SitePhoto>;

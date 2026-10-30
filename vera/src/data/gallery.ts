import type { ImageKey } from "@/config/images";

/** Editorial gallery on the home page – a horizontal strip; `width` sets the frame size in the strip. */
export const editorial: { image: ImageKey; width: "narrow" | "regular" | "wide"; caption: string }[] = [
  { image: "editorialSilk", width: "regular", caption: "Burgundy, in silk" },
  { image: "editorialStill", width: "narrow", caption: "Still life, black stone" },
  { image: "editorialRoom", width: "wide", caption: "The treatment room" },
  { image: "editorialLips", width: "regular", caption: "Natural, close" },
  { image: "editorialMirror", width: "regular", caption: "Reflection" },
  { image: "editorialDoor", width: "narrow", caption: "Kazimierz entrance" },
];

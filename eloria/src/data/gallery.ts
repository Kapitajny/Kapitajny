import type { ImageKey } from "@/config/images";

export type GalleryGroup = "wnetrza" | "detale" | "praca";

export const galleryGroups: { value: GalleryGroup; label: string }[] = [
  { value: "wnetrza", label: "Wnętrza" },
  { value: "detale", label: "Detale" },
  { value: "praca", label: "Przy pracy" },
];

/**
 * Kolejność i rozmiary kafelków galerii.
 * `span` steruje kompozycją mozaiki na szerokich ekranach: „wide” – 2 kolumny, „tall” – 2 rzędy.
 */
export const gallery: { image: ImageKey; group: GalleryGroup; span?: "wide" | "tall" }[] = [
  { image: "highlightRoom", group: "wnetrza", span: "wide" },
  { image: "interiorLounge", group: "wnetrza", span: "tall" },
  { image: "heroDetail", group: "detale" },
  { image: "svcCare", group: "praca" },
  { image: "interiorConsultation", group: "wnetrza", span: "wide" },
  { image: "detailManicureRed", group: "detale", span: "tall" },
  { image: "workSkinAnalysis", group: "praca" },
  { image: "interiorCorridor", group: "wnetrza", span: "tall" },
  { image: "detailProducts", group: "detale" },
  { image: "workNotes", group: "praca" },
  { image: "interiorWindow", group: "wnetrza" },
  { image: "detailTowels", group: "detale" },
  { image: "workTreatment", group: "praca", span: "wide" },
];

import type { GalleryItem } from "@/components/gallery/Gallery";

/** Kolaż galerii: na przemian owale, kapsuły i miękkie kadry; na telefonie dwie kolumny. */
export const gallery: GalleryItem[] = [
  { image: "nailsBurgundy", caption: "Rytuał dłoni, czerwień studia", span: "lg:col-span-3 lg:mt-20", aspect: "aspect-[3/4]", shape: "capsule" },
  { image: "portraitPlatinum", caption: "Portret kampanijny", span: "lg:col-span-3", aspect: "aspect-[3/4]", shape: "oval" },
  { image: "cream", caption: "Studium tekstury", span: "col-span-2 lg:col-span-3 lg:mt-36", aspect: "aspect-square", shape: "oval" },
  { image: "nailsNude", caption: "Rytuał dłoni, naturalne wykończenie", span: "lg:col-span-3 lg:mt-8", aspect: "aspect-[3/4]", shape: "capsule" },
  { image: "facialMask", caption: "Rytuał VÉRA na twarz", span: "col-span-2 lg:col-span-5 lg:col-start-2", aspect: "aspect-[5/4]", shape: "soft" },
  { image: "serum", caption: "Serum w popołudniowym świetle", span: "lg:col-span-3 lg:mt-16", aspect: "aspect-[3/4]", shape: "capsule" },
  { image: "reception", caption: "Recepcja", span: "lg:col-span-3 lg:mt-4", aspect: "aspect-[3/4]", shape: "oval" },
];

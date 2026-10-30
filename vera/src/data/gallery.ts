import type { GalleryItem } from "@/components/gallery/Gallery";

/** Galeria: różne kadry na siatce 12 kolumn (dwie kolumny na telefonie). */
export const gallery: GalleryItem[] = [
  { image: "portraitPlatinum", caption: "Portret kampanijny", span: "col-span-2 lg:col-span-5 lg:row-span-2", aspect: "aspect-[4/5]" },
  { image: "nailsBurgundy", caption: "Rytuał dłoni, czerwień studia", span: "lg:col-span-3 lg:mt-24", aspect: "aspect-[4/5]" },
  { image: "cream", caption: "Studium tekstury", span: "lg:col-span-4", aspect: "aspect-square" },
  { image: "serum", caption: "Serum w popołudniowym świetle", span: "col-span-2 lg:col-span-4 lg:col-start-6", aspect: "aspect-[5/4]" },
  { image: "nailsNude", caption: "Rytuał dłoni, naturalne wykończenie", span: "lg:col-span-3", aspect: "aspect-square" },
  { image: "reception", caption: "Recepcja", span: "lg:col-span-5 lg:col-start-2", aspect: "aspect-[3/2]" },
  { image: "facialMask", caption: "Rytuał VÉRA na twarz", span: "col-span-2 lg:col-span-6", aspect: "aspect-[5/4]" },
];

import type { GalleryItem } from "@/components/gallery/Gallery";

/** Editorial gallery: varied crops on a 12-column grid (two columns on mobile). */
export const gallery: GalleryItem[] = [
  { image: "portraitPlatinum", caption: "Campaign portrait", span: "col-span-2 lg:col-span-5 lg:row-span-2", aspect: "aspect-[4/5]" },
  { image: "nailsBurgundy", caption: "Hand ritual, studio red", span: "lg:col-span-3 lg:mt-24", aspect: "aspect-[4/5]" },
  { image: "cream", caption: "Texture study", span: "lg:col-span-4", aspect: "aspect-square" },
  { image: "serum", caption: "Serum, late light", span: "col-span-2 lg:col-span-4 lg:col-start-6", aspect: "aspect-[5/4]" },
  { image: "nailsNude", caption: "Hand ritual, bare finish", span: "lg:col-span-3", aspect: "aspect-square" },
  { image: "reception", caption: "The reception", span: "lg:col-span-5 lg:col-start-2", aspect: "aspect-[3/2]" },
  { image: "facialMask", caption: "Signature facial", span: "col-span-2 lg:col-span-6", aspect: "aspect-[5/4]" },
];

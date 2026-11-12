/**
 * Galeria: zdjęcia (i opcjonalnie filmy) z katalogu public/images/kilwater.
 * `area` to układ w siatce 12 kolumn na desktopie (kolumna start/koniec, liczba wierszy).
 * Film: dodaj { type: "video", src: "/video/plik.mp4", poster: "/images/…jpg", … } – odtwarza się po kliknięciu.
 */
export interface GalleryItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  caption: string;
  area: string;
  position?: string;
}

export const gallery: GalleryItem[] = [
  { type: "image", src: "/images/kilwater/hero-aerial.jpg", alt: "Skuter wodny na turkusowej wodzie z długim kilwaterem, widok z drona", caption: "Zatoka z góry", area: "md:col-[1/8] md:row-span-4" },
  { type: "image", src: "/images/kilwater/yamaha-fx.jpg", alt: "Kobieta prowadząca skuter Yamaha FX w ślizgu", caption: "Ślizg", area: "md:col-[8/13] md:row-span-2" },
  { type: "image", src: "/images/kilwater/yamaha-gp1800r-plaza.jpg", alt: "Niebieski skuter Yamaha GP1800R na płyciźnie, w tle przystań", caption: "Na płyciźnie", area: "md:col-[8/11] md:row-span-2", position: "50% 60%" },
  { type: "image", src: "/images/kilwater/sea-doo-spark.jpg", alt: "Kierowca na skuterze Sea-Doo Spark w ostrym zakręcie", caption: "Zakręt", area: "md:col-[11/13] md:row-span-2", position: "40% 50%" },
  { type: "image", src: "/images/kilwater/yamaha-vx.jpg", alt: "Kierowca na skuterze Yamaha VX na zielonkawej wodzie", caption: "Spokojna woda", area: "md:col-[1/6] md:row-span-3", position: "60% 50%" },
  { type: "image", src: "/images/kilwater/yamaha-gp1800r-brzeg.jpg", alt: "Skuter Yamaha GP1800R zacumowany przy brzegu w słoneczny dzień", caption: "Przy brzegu", area: "max-md:col-span-2 max-md:aspect-[16/10] md:col-[6/13] md:row-span-3" },
];

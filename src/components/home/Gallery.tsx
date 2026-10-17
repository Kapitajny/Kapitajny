import Link from "next/link";
import type { ImageKey } from "@/config/images";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Nieregularna siatka zdjęć (12 kolumn na desktopie). Zdjęcia: `galleryXxx` w config/images.ts.
 * Rozpiętości kolumn i wierszy dobrane tak, by kompozycja domykała się bez pustych pól.
 */
const ITEMS: { image: ImageKey; caption: string; span: string }[] = [
  { image: "galleryEspresso", caption: "Espresso", span: "row-span-2 lg:col-span-4" },
  { image: "galleryLatteArt", caption: "Cappuccino z latte art", span: "lg:col-span-4" },
  { image: "galleryLatteGlass", caption: "Latte w szklance", span: "row-span-2 lg:col-span-4" },
  { image: "galleryGroundCoffee", caption: "Świeżo mielone ziarna", span: "lg:col-span-4" },
  { image: "galleryBarista", caption: "Przy barze", span: "col-span-2 row-span-2 sm:col-span-1 lg:col-span-3" },
  { image: "galleryColdBrew", caption: "Cold brew z lodem", span: "lg:col-span-5" },
  { image: "galleryCoffeeCake", caption: "Kawa i ciasto", span: "row-span-2 lg:col-span-4" },
  { image: "galleryInterior", caption: "Wnętrze NOIR", span: "lg:col-span-5" },
];

export function Gallery() {
  return (
    <section id="galeria" aria-labelledby="galeria-title" className="bg-roast py-24 text-oat lg:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="galeria-title" index="04" eyebrow="Galeria" tone="light" className="lg:col-span-7">
            Zobacz. Poczuj. <em className="italic text-oat">Zamów.</em>
          </SectionHeading>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-oat/80">Gęsta crema, jedwabista pianka, chłodny cold brew w słoneczne popołudnie. Tak wygląda dzień w NOIR.</p>
            <Link href="/#menu" className="btn btn-light mt-6">
              Zamów kawę <ArrowRightIcon size={18} />
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid grid-flow-dense auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[15rem] lg:grid-cols-12">
          {ITEMS.map((item, i) => (
            <Reveal as="li" key={item.image} delay={(i % 4) * 70} className={`group relative overflow-hidden rounded-xl ${item.span}`}>
              <figure className="absolute inset-0">
                <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]">
                  <Photo image={item.image} tone="dark" sizes="(min-width: 1024px) 34vw, (min-width: 640px) 33vw, 50vw" />
                </div>
                <figcaption className="absolute bottom-3 left-3 mr-3 rounded-full bg-roast/75 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-paper backdrop-blur-sm sm:text-[0.7rem] sm:tracking-[0.16em]">
                  {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

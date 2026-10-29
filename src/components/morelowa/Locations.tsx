import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { bakeryLocations } from "@/data/morelowa";
import { photos } from "./images";
import { LocationEntry } from "./LocationEntry";

export function Locations() {
  return (
    <section id="lokale" aria-labelledby="lokale-tytul" className="section-y">
      <div className="container-m grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* GRAFIKA 5 – nasze lokale */}
        <div className="lg:col-span-5">
          <Reveal as="figure" className="lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] overflow-hidden bg-bez">
              <Image
                src={photos.shop.src}
                alt={photos.shop.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1312px) 490px, (min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 text-[0.82rem] text-szary italic">
              <span aria-hidden="true" className="h-px w-8 bg-zloto" />
              Przy ladzie zawsze doradzimy, który chleb wybrać
            </figcaption>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow">Nasze lokale</p>
            <h2 id="lokale-tytul" className="display-2 mt-6 text-braz">
              Znajdziesz nas <em className="font-normal text-bordo italic">w dwóch miejscach.</em>
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-braz/80 pt-10 lg:pt-12">
            {bakeryLocations.map((location) => (
              <LocationEntry key={location.id} location={location} />
            ))}
          </div>

          <p className="mt-8 max-w-[34rem] text-[0.82rem] text-szary">
            Morelowa jest marką fikcyjną. Adresy, godziny otwarcia i dane kontaktowe mają charakter demonstracyjny, dlatego nie podajemy linków do
            map ani numerów telefonów.
          </p>
        </div>
      </div>
    </section>
  );
}

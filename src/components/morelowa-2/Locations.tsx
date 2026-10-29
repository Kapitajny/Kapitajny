import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { bakeryLocations } from "@/data/morelowa";
import { LocationCard } from "./LocationCard";

export function Locations() {
  return (
    <section id="lokale" aria-labelledby="lokale-tytul" className="band">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* GRAFIKA 5 – nasze lokale, w łuku jak okno witryny */}
        <Reveal as="figure" className="lg:col-span-5">
          <div className="arch relative mx-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden bg-bez">
            <Image
              src={photos.shop.src}
              alt={photos.shop.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1344px) 480px, (min-width: 1024px) 36vw, 92vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-5 text-center text-[0.85rem] text-szary italic">Przy ladzie zawsze doradzimy, który chleb wybrać.</figcaption>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="kicker">Nasze lokale</p>
            <h2 id="lokale-tytul" className="title-lg mt-6 text-braz">
              Znajdziesz nas <em className="text-bordo italic">w dwóch miejscach.</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-10">
            {bakeryLocations.map((location, index) => (
              <Reveal key={location.id} delay={index * 120} className="flex">
                <LocationCard location={location} />
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-[0.82rem] text-szary">
            Morelowa jest marką fikcyjną. Adresy, godziny otwarcia i dane kontaktowe mają charakter demonstracyjny, dlatego nie podajemy linków do
            map ani numerów telefonów.
          </p>
        </div>
      </div>
    </section>
  );
}

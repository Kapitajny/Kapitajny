import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { bakeryLocations } from "@/data/morelowa";
import { LocationPanel } from "./LocationPanel";

/** Jedyna jasna sekcja strony – lokale; zdjęcie dochodzi do prawej krawędzi ekranu. */
export function Locations() {
  return (
    <section id="lokale" aria-labelledby="lokale-tytul" className="jasne bg-krem text-braz lg:grid lg:grid-cols-2">
      <div className="rytm px-5 sm:px-8 lg:order-1 lg:px-14 xl:px-20">
        <div className="ml-auto max-w-[38rem]">
          <Reveal>
            <p className="etykieta">Nasze lokale</p>
            <h2 id="lokale-tytul" className="display-xl mt-6 text-braz">
              Znajdziesz nas <em className="text-bordo italic">w dwóch miejscach.</em>
            </h2>
          </Reveal>

          <div className="mt-12 border-b border-braz/80">
            {bakeryLocations.map((location, index) => (
              <Reveal key={location.id} delay={index * 120}>
                <LocationPanel location={location} />
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-[0.85rem] text-szary">
            Morelowa jest marką fikcyjną. Adresy, godziny otwarcia i dane kontaktowe mają charakter demonstracyjny, dlatego nie podajemy linków do
            map ani numerów telefonów.
          </p>
        </div>
      </div>

      {/* GRAFIKA 5 – nasze lokale, do prawej krawędzi ekranu */}
      <figure className="relative min-h-[26rem] sm:min-h-[34rem] lg:order-2 lg:min-h-full">
        <Image
          src={photos.shop.src}
          alt={photos.shop.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[30%_50%]"
        />
        <figcaption className="absolute right-0 bottom-0 bg-krem px-5 py-3 text-[0.82rem] text-szary italic">
          Przy ladzie zawsze doradzimy, który chleb wybrać.
        </figcaption>
      </figure>
    </section>
  );
}

import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { bakeryRhythm, breads } from "@/data/morelowa";

/** Pieczywo: zdjęcie od krawędzi ekranu, rytm pracy piekarni i rodzaje pieczywa. */
export function Breads() {
  return (
    <section id="pieczywo" aria-labelledby="pieczywo-tytul" className="bg-braz lg:grid lg:grid-cols-2">
      {/* GRAFIKA 2 – pieczywo, od lewej krawędzi ekranu */}
      <figure className="relative min-h-[26rem] sm:min-h-[34rem] lg:min-h-full">
        <Image
          src={photos.bread.src}
          alt={photos.bread.alt}
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[40%_50%]"
        />
        <figcaption className="absolute bottom-0 left-0 bg-noc/85 px-5 py-3 text-[0.82rem] text-mgla italic">
          Bochenek na zakwasie, krojony prosto na desce.
        </figcaption>
      </figure>

      <div className="rytm px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="max-w-[38rem]">
          <Reveal>
            <p className="etykieta">Nasze wypieki · Pieczywo</p>
            <h2 id="pieczywo-tytul" className="display-xl mt-6 text-krem">
              Pieczemy, zanim <em className="text-zloto italic">miasto się obudzi.</em>
            </h2>
            <p className="lead mt-7 text-mgla">
              Codzienna praca piekarza zaczyna się w nocy. Ciasto formujemy ręcznie, a każdą partię sprawdzamy, zanim trafi na półkę — tak samo jak
              w pierwszym roku.
            </p>
          </Reveal>

          <Reveal as="div" className="mt-12">
            <h3 className="font-sans text-[0.72rem] font-semibold tracking-[0.26em] text-zloto uppercase">Rytm piekarni</h3>
            <ol className="mt-5 border-l border-zloto/50">
              {bakeryRhythm.map((step) => (
                <li key={step.time} className="relative pb-6 pl-6 last:pb-0">
                  <span aria-hidden="true" className="absolute top-[0.6rem] -left-[4px] h-[7px] w-[7px] rounded-full bg-zloto" />
                  <p className="font-serif text-[1.35rem] leading-tight text-krem">{step.time}</p>
                  <p className="mt-1 text-[0.95rem] text-mgla">{step.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <ul className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {breads.map((item, index) => (
              <Reveal as="li" key={item.name} delay={(index % 2) * 100} className="border-t border-linia-ciemna pt-5">
                <h3 className="text-[1.45rem] leading-tight text-krem">{item.name}</h3>
                <p className="mt-2 text-[0.92rem] text-mgla">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

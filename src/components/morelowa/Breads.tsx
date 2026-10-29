import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { breads } from "@/data/morelowa";
import { photos } from "./images";

export function Breads() {
  return (
    <section id="pieczywo" aria-labelledby="pieczywo-tytul" className="section-y border-t border-linia bg-papier">
      <div className="container-m">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linia pb-8">
          <p className="eyebrow">Nasze wypieki — pieczywo</p>
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-szary uppercase">Wypiekane codziennie od świtu</p>
        </div>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* GRAFIKA 2 – pieczywo */}
          <Reveal as="figure" className="lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-bez">
              <Image
                src={photos.bread.src}
                alt={photos.bread.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1312px) 600px, (min-width: 1024px) 46vw, 100vw"
                className="object-cover object-[45%_50%]"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 text-[0.82rem] text-szary italic">
              <span aria-hidden="true" className="h-px w-8 bg-zloto" />
              Bochenek na zakwasie, krojony prosto na desce
            </figcaption>
          </Reveal>

          <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <Reveal>
              <h2 id="pieczywo-tytul" className="display-2 text-braz">
                Codziennie od świtu, <em className="font-normal text-bordo italic">tak jak przed laty.</em>
              </h2>
              <p className="lead mt-7 text-szary">
                Pierwsze bochenki wyjmujemy z pieca, zanim miasto się obudzi. Zakwas dojrzewa powoli, ciasto formujemy ręcznie, a każdą partię
                sprawdzamy, zanim trafi na półkę.
              </p>
            </Reveal>

            <ul className="mt-12 border-t border-braz/80">
              {breads.map((item, index) => (
                <Reveal as="li" key={item.name} delay={index * 90} className="border-b border-linia py-6">
                  <h3 className="font-serif text-[1.55rem] leading-tight text-braz">{item.name}</h3>
                  <p className="mt-2 text-[0.95rem] text-szary">{item.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

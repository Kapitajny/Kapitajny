import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { breadMenu } from "@/data/morelowa";

/** Pieczywo jako karta wypieków: kategorie, przykładowe bochenki, czas fermentacji i gramatura. */
export function Breads() {
  return (
    <section id="pieczywo" aria-labelledby="pieczywo-tytul" className="band bg-papier">
      <div className="wrap">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="kicker">Nasze wypieki · Pieczywo</p>
            <h2 id="pieczywo-tytul" className="title-lg mt-6 text-braz">
              Codziennie od świtu, <em className="text-bordo italic">tak jak przed laty.</em>
            </h2>
          </div>
          <p className="intro text-szary lg:col-span-5">
            Pierwsze bochenki wyjmujemy z pieca, zanim miasto się obudzi. Zakwas dojrzewa powoli, ciasto formujemy ręcznie, a każdą partię sprawdzamy,
            zanim trafi na półkę.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* GRAFIKA 2 – pieczywo, w ramie z przesuniętą złotą linią */}
          <div className="lg:col-span-5">
            <Reveal as="figure" className="lg:sticky lg:top-32">
              <div className="relative ml-3 mt-3 sm:ml-4 sm:mt-4">
                <span aria-hidden="true" className="absolute -top-3 -left-3 h-full w-full border border-zloto sm:-top-4 sm:-left-4" />
                <div className="relative aspect-[4/5] overflow-hidden bg-bez">
                  <Image
                    src={photos.bread.src}
                    alt={photos.bread.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1344px) 480px, (min-width: 1024px) 36vw, 92vw"
                    className="object-cover object-[42%_50%]"
                  />
                </div>
              </div>
              <figcaption className="mt-5 text-[0.85rem] text-szary italic">Bochenek na zakwasie, krojony prosto na desce.</figcaption>
            </Reveal>
          </div>

          <div className="grid content-start gap-x-12 gap-y-12 md:grid-cols-2 lg:col-span-7">
            {breadMenu.map((group, index) => (
              <Reveal key={group.category} delay={(index % 2) * 120} className="border-t border-braz pt-6">
                <h3 className="text-[1.65rem] leading-tight text-braz">{group.category}</h3>
                <p className="mt-2 text-[0.72rem] font-medium tracking-[0.22em] text-zloto-tekst uppercase">{group.note}</p>
                <ul className="mt-6 space-y-3.5">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex items-baseline gap-3 text-[0.98rem]">
                      <span className="text-braz">{item.name}</span>
                      <span aria-hidden="true" className="leader" />
                      <span className="shrink-0 text-[0.82rem] text-szary tabular-nums">{item.spec}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <p className="text-[0.85rem] text-szary md:col-span-2">
              Wybór zmienia się w ciągu dnia i z porami roku. Gramatury i czasy fermentacji są orientacyjne — o szczegóły zapytaj przy ladzie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

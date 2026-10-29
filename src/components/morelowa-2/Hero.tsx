import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { morelowa } from "@/data/morelowa";

export function Hero() {
  return (
    <section id="start" aria-labelledby="hero-tytul" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-noc">
      {/* GRAFIKA 1 – zdjęcie główne na całą wysokość ekranu */}
      <Image
        src={photos.hero.src}
        alt={photos.hero.alt}
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        quality={85}
        className="-z-20 object-cover object-[72%_40%] lg:object-[50%_38%]"
      />
      {/* Przyciemnienie: u góry pod nagłówek, mocniej u dołu pod tekst */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(180deg,rgb(35_25_18/0.75),transparent)]" />
      {/* Na węższych ekranach tekst zajmuje większą część zdjęcia – dodatkowe przyciemnienie dla kontrastu */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-noc/45 lg:hidden" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(35_25_18/0.96)_0%,rgb(35_25_18/0.7)_38%,rgb(35_25_18/0.15)_70%)]" />

      <div className="shell pt-36 pb-12 lg:pb-16">
        <p className="etykieta">Rodzinna tradycja od 1991 roku</p>
        <h1 id="hero-tytul" className="display-xxl mt-6 max-w-[13ch] text-krem">
          Tradycja, którą czuć <em className="text-zloto italic">w każdym kęsie.</em>
        </h1>

        <div className="mt-10 grid gap-8 border-t border-krem/25 pt-8 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <p className="lead text-krem/90 lg:col-span-6">
            Od ponad trzech dekad tworzymy pieczywo i słodkości, które łączą pokolenia. Każdy dzień zaczynamy od tego samego — dobrych składników,
            rzemieślniczej pracy i szacunku do tradycji.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end">
            <a href="#historia" className="cta cta-zloto">
              Poznaj naszą historię <span aria-hidden="true">→</span>
            </a>
            <a href="#pieczywo" className="cta cta-kontur">
              Odkryj nasze wypieki <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <p className="mt-10 hidden font-serif text-[1.15rem] text-mgla italic md:block">{morelowa.tagline}</p>
      </div>
    </section>
  );
}

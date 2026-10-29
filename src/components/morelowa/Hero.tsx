import Image from "next/image";
import { morelowa } from "@/data/morelowa";
import { photos } from "./images";

export function Hero() {
  return (
    <section id="start" aria-labelledby="hero-tytul">
      {/* GRAFIKA 1 – zdjęcie główne */}
      <div className="on-dark relative isolate flex h-[calc(100svh-4.75rem)] max-h-[58rem] min-h-[36rem] items-end overflow-hidden bg-braz lg:h-[calc(100svh-5.5rem)]">
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          quality={85}
          className="-z-20 object-cover object-[78%_50%] sm:object-[70%_40%] lg:object-[50%_32%]"
        />
        {/* Przyciemnienie od dołu i z lewej – dla czytelności tekstu na zdjęciu */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(42_30_23/0.82)_0%,rgb(42_30_23/0.55)_42%,rgb(42_30_23/0.08)_75%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[linear-gradient(0deg,rgb(42_30_23/0.75),transparent)]" />

        <div className="container-m pb-14 sm:pb-20 lg:pb-24">
          <div className="max-w-[44rem] text-krem">
            <p className="inline-flex items-center gap-3 border border-krem/35 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.22em] text-krem uppercase">
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-zloto" />
              Rodzinna tradycja od 1991 roku
            </p>
            <h1 id="hero-tytul" className="display-1 mt-7 text-krem">
              Tradycja, którą czuć <em className="font-normal text-[#ead9bd] italic">w każdym kęsie.</em>
            </h1>
            <p className="lead mt-7 max-w-[34rem] text-krem/90">
              Od ponad trzech dekad tworzymy pieczywo i słodkości, które łączą pokolenia. Każdy dzień zaczynamy od tego samego — dobrych składników,
              rzemieślniczej pracy i szacunku do tradycji.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#historia" className="btn btn-primary">
                Poznaj naszą historię
              </a>
              <a href="#pieczywo" className="btn btn-ghost-light">
                Odkryj nasze wypieki
              </a>
            </div>
          </div>
        </div>

        <p className="absolute bottom-24 right-10 hidden origin-bottom-right translate-x-full -rotate-90 text-[0.66rem] font-semibold tracking-[0.32em] text-krem/80 uppercase xl:block">
          Grodzisk Mazowiecki <span aria-hidden="true" className="mx-3 text-zloto">—</span> Warszawa
        </p>
      </div>

      {/* Hasło marki */}
      <div className="border-b border-linia bg-krem text-braz">
        <div className="container-m flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:justify-center sm:gap-8 sm:py-12">
          <span aria-hidden="true" className="hidden h-px w-16 bg-zloto sm:block" />
          <p className="font-serif text-[1.45rem] leading-snug italic sm:text-[1.75rem]">{morelowa.tagline}</p>
          <span aria-hidden="true" className="hidden h-px w-16 bg-zloto sm:block" />
        </div>
      </div>
    </section>
  );
}

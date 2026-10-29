import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { pastries } from "@/data/morelowa";
import { photos } from "./images";

/** Sekcja cukierni w układzie redakcyjnym – jak rozkładówka magazynu kulinarnego. */
export function Patisserie() {
  return (
    <section id="cukiernia" aria-labelledby="cukiernia-tytul" className="section-y bg-bez">
      <div className="container-m">
        {/* Winieta „magazynu” */}
        <div className="grid grid-cols-2 items-center gap-4 border-y border-braz/70 py-3 text-[0.68rem] font-semibold tracking-[0.24em] text-braz uppercase sm:grid-cols-3">
          <p>Nasze wypieki — cukiernia</p>
          <p className="hidden text-center sm:block">Torty · Tarty · Monoporcje</p>
          <p className="text-right text-bordo">Wydanie sezonowe</p>
        </div>

        <Reveal className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-end">
          <h2 id="cukiernia-tytul" className="display-1 text-braz lg:col-span-8">
            Słodkości <em className="font-normal text-bordo italic">wykańczane ręcznie.</em>
          </h2>
          <p className="lead text-szary lg:col-span-4 lg:pb-2">
            Polska tradycja cukiernicza spotyka się u nas z nowoczesną patisserie. Każdy tort i każda monoporcja przechodzą przez ręce cukiernika.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* GRAFIKA 3 – cukiernia i torty */}
          <Reveal as="figure" className="lg:col-span-8">
            <div className="relative aspect-[4/3] overflow-hidden bg-krem">
              <Image
                src={photos.patisserie.src}
                alt={photos.patisserie.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1312px) 810px, (min-width: 1024px) 64vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-b border-braz/25 pb-4 text-[0.82rem] text-szary">
              <span className="italic">Tort z morelami, tarta owocowa i monoporcje z naszej witryny</span>
              <span aria-hidden="true" className="shrink-0 font-semibold tracking-[0.2em] uppercase">Fot. 03</span>
            </figcaption>
          </Reveal>

          <Reveal delay={150} className="flex flex-col justify-between gap-10 lg:col-span-4">
            <blockquote className="border-l border-bordo pl-6">
              <p className="font-serif text-[1.85rem] leading-[1.2] text-braz italic sm:text-[2.1rem]">
                „Dekorację tortu kończymy zawsze ręcznie. Maszyna nie wie, dla kogo jest ten dzień.”
              </p>
              <footer className="mt-5 text-[0.7rem] font-semibold tracking-[0.22em] text-bordo uppercase">Z pracowni cukierniczej</footer>
            </blockquote>

            <div className="space-y-8">
              {pastries.map((item) => (
                <div key={item.name} className="border-t border-braz/25 pt-6">
                  <h3 className="font-serif text-[1.65rem] leading-tight text-braz">{item.name}</h3>
                  <p className="mt-3 text-[0.95rem] text-szary">{item.text}</p>
                </div>
              ))}
              <p className="text-[0.85rem] text-szary">
                Nie prowadzimy zamówień online — o torcie najlepiej porozmawiać przy ladzie.{" "}
                <a href="#lokale" className="font-semibold text-bordo underline decoration-bordo/40 underline-offset-4 hover:decoration-bordo">
                  Sprawdź, gdzie nas znaleźć
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

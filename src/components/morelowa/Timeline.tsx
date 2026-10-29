import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/data/morelowa";
import { photos } from "./images";

export function Timeline() {
  return (
    <section id="historia" aria-labelledby="historia-tytul" className="on-dark section-y bg-braz text-krem">
      <div className="container-m">
        <Reveal className="max-w-[52rem]">
          <p className="eyebrow">Nasza historia · 1991–2021</p>
          <h2 id="historia-tytul" className="display-2 mt-6 text-krem">
            Trzy dekady. Dwa miasta. <em className="font-normal text-zloto italic">Jedna rodzinna tradycja.</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* GRAFIKA 4 – historia rodzinnej firmy */}
          <div className="lg:col-span-5">
            <Reveal as="figure" className="lg:sticky lg:top-32">
              <div className="relative aspect-[4/5] overflow-hidden bg-braz-ciemny">
                <Image
                  src={photos.craft.src}
                  alt={photos.craft.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1312px) 490px, (min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-[40%_50%]"
                />
              </div>
              <figcaption className="mt-4 flex items-center gap-3 text-[0.82rem] text-krem/75 italic">
                <span aria-hidden="true" className="h-px w-8 bg-zloto" />
                Rzemiosła uczymy się od siebie nawzajem — od pierwszego dnia.
              </figcaption>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="lead text-krem/85">
                Zaczęło się od jednego pieca i kilku receptur zapisanych w zeszycie. Dziś piekarnią i cukiernią opiekuje się kolejne pokolenie
                rodziny — wciąż według tych samych zasad.
              </p>
            </Reveal>

            <ol className="relative mt-12 border-l border-zloto/45 pl-8 sm:pl-12">
              {timeline.map((event, index) => (
                <Reveal as="li" key={event.year} delay={index * 80} className="relative pb-12 last:pb-0">
                  <span aria-hidden="true" className="absolute top-3 -left-8 h-2.5 w-2.5 -translate-x-[calc(50%+0.5px)] rotate-45 bg-zloto sm:-left-12" />
                  <h3 className="flex flex-col gap-2">
                    <span className="font-serif text-[3.2rem] leading-none text-zloto sm:text-[4rem]">{event.year}</span>
                    <span className="font-sans text-[0.75rem] font-semibold tracking-[0.24em] text-krem uppercase">{event.title}</span>
                  </h3>
                  <p className="mt-4 max-w-[32rem] text-krem/80">{event.text}</p>
                </Reveal>
              ))}
            </ol>

            <p className="mt-14 border-t border-krem/15 pt-6 text-[0.8rem] text-krem/60">
              Historia marki jest fikcyjna i służy wyłącznie demonstracji projektu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

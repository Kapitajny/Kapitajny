import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/data/morelowa";

/** Historia jako pozioma oś czasu pod szerokim, kinowym kadrem (na telefonie – oś pionowa). */
export function Timeline() {
  return (
    <section id="historia" aria-labelledby="historia-tytul" className="band bg-bez">
      <div className="wrap">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="kicker">Nasza historia · 1991–2026</p>
            <h2 id="historia-tytul" className="title-lg mt-6 text-braz">
              Trzy dekady. Dwa miasta. <em className="text-bordo italic">Jedna rodzinna tradycja.</em>
            </h2>
          </div>
          <p className="text-szary lg:col-span-4">
            Zaczęło się od jednego pieca i kilku receptur zapisanych w zeszycie. Dziś piekarnią i cukiernią opiekuje się kolejne pokolenie rodziny.
          </p>
        </Reveal>

        {/* GRAFIKA 4 – historia rodzinnej firmy */}
        <Reveal as="figure" className="mt-12 lg:mt-16">
          <div className="relative aspect-[4/3] overflow-hidden bg-braz sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={photos.craft.src}
              alt={photos.craft.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1344px) 1232px, 92vw"
              className="object-cover object-[50%_38%]"
            />
          </div>
          <figcaption className="mt-4 text-[0.85rem] text-szary italic">Rzemiosła uczymy się od siebie nawzajem — od pierwszego dnia.</figcaption>
        </Reveal>

        <ol className="mt-14 lg:mt-20 lg:grid lg:grid-cols-4 lg:gap-10">
          {timeline.map((event, index) => (
            <Reveal
              as="li"
              key={event.year}
              delay={index * 100}
              className="relative border-l border-zloto pb-12 pl-8 last:pb-0 lg:border-t lg:border-l-0 lg:pt-10 lg:pb-0 lg:pl-0"
            >
              <span aria-hidden="true" className="absolute top-2 -left-[5px] h-2.5 w-2.5 rotate-45 bg-bordo lg:-top-[5px] lg:left-0" />
              <h3 className="flex flex-col gap-3">
                <span className="text-[3.4rem] leading-none text-bordo tabular-nums lg:text-[4.2rem]">{event.year}</span>
                <span className="font-sans text-[0.75rem] font-medium tracking-[0.24em] text-braz uppercase">{event.title}</span>
              </h3>
              <p className="mt-4 max-w-[34rem] text-[0.98rem] text-szary">{event.text}</p>
            </Reveal>
          ))}
        </ol>

        <p className="mt-14 border-t border-braz/15 pt-6 text-[0.82rem] text-szary">Historia marki jest fikcyjna i służy wyłącznie demonstracji projektu.</p>
      </div>
    </section>
  );
}

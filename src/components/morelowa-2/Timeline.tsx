import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/data/morelowa";

/** Historia: lata w złotym konturze, zdjęcie rzemiosła po prawej stronie osi. */
export function Timeline() {
  return (
    <section id="historia" aria-labelledby="historia-tytul" className="rytm bg-noc">
      <div className="shell">
        <Reveal className="max-w-[56rem]">
          <p className="etykieta">Nasza historia · 1991–2026</p>
          <h2 id="historia-tytul" className="display-xl mt-6 text-krem">
            Trzy dekady. Dwa miasta. <em className="text-zloto italic">Jedna rodzinna tradycja.</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <ol className="border-b border-linia-ciemna lg:col-span-7">
            {timeline.map((event, index) => (
              <Reveal
                as="li"
                key={event.year}
                delay={index * 80}
                className="grid gap-4 border-t border-linia-ciemna py-9 sm:grid-cols-[12rem_1fr] sm:gap-8 lg:py-11"
              >
                <h3 className="rok-kontur text-[4.2rem] leading-[0.85] tabular-nums sm:text-[5.2rem]">{event.year}</h3>
                <div>
                  <p className="text-[0.75rem] font-semibold tracking-[0.24em] text-zloto uppercase">{event.title}</p>
                  <p className="mt-3 text-mgla">{event.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* GRAFIKA 4 – historia rodzinnej firmy */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal as="figure" className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] overflow-hidden bg-braz">
                <Image
                  src={photos.craft.src}
                  alt={photos.craft.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1376px) 400px, (min-width: 1024px) 30vw, 100vw"
                  className="object-cover object-[38%_50%]"
                />
              </div>
              <figcaption className="mt-4 text-[0.85rem] text-mgla italic">Rzemiosła uczymy się od siebie nawzajem — od pierwszego dnia.</figcaption>
            </Reveal>
          </div>
        </div>

        <p className="mt-12 text-[0.82rem] text-mgla">Historia marki jest fikcyjna i służy wyłącznie demonstracji projektu.</p>
      </div>
    </section>
  );
}

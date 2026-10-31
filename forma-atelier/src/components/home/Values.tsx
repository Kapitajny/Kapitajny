import samples from "@/assets/photos/studio-samples.jpg";
import { ArchMark } from "@/components/brand/Logo";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { values } from "@/data/content";

/** Wartości ułożone schodkowo — każda o krok dalej, jak kolejne stopnie w architekturze wnętrza. */
const steps = ["lg:ml-0", "lg:ml-[10%]", "lg:ml-[20%]", "lg:ml-[30%]"];

export function Values() {
  return (
    <section aria-labelledby="dlaczego" className="bg-graphite py-[var(--section)] text-paper">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <h2 id="dlaczego" className="t-h2">
              Dlaczego FORMA ATELIER
            </h2>
          </Reveal>
          <ul className="mt-16 space-y-12 md:mt-20">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.08} className={`max-w-[30rem] border-t border-line-light pt-7 ${steps[i]}`}>
                <div className="flex items-start gap-5">
                  <ArchMark className="mt-1 h-6 w-4 shrink-0 text-sand" />
                  <div>
                    <h3 className="t-h3">{v.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-8 lg:self-end">
          <RevealImage
            src={samples}
            alt="Próbki kamienia, forniru i tkanin przygotowane do prezentacji dla klienta"
            sizes="(min-width: 1024px) 38vw, 80vw"
            ratio="1 / 1"
            parallax={5}
          />
          <p className="t-meta mt-4 text-mist">Próbki materiałów do projektu Villa Natura.</p>
        </div>
      </div>
    </section>
  );
}

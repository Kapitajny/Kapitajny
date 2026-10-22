import { TESTIMONIALS } from "@/data/testimonials";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

/**
 * Opinie pacjentów – wyłącznie prawdziwe (data/testimonials.ts).
 * Dopóki lista jest pusta, pokazujemy uczciwy pusty stan zamiast wymyślonych opinii.
 */
export function Testimonials() {
  return (
    <section aria-labelledby="opinie-title" className="section-y bg-sage">
      <div className="container-x">
        <SectionHeading id="opinie-title" eyebrow="Opinie pacjentów" className="max-w-3xl">
          Doświadczenia <em className="italic text-forest">naszych pacjentów</em>
        </SectionHeading>

        {TESTIMONIALS.length > 0 ? (
          <ul className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal as="li" key={`${t.author}-${i}`} delay={(i % 2) * 100}>
                <figure className="border-t border-forest/25 pt-8">
                  <span aria-hidden="true" className="block font-serif text-6xl leading-[0.5] text-forest/40">
                    „
                  </span>
                  <blockquote className="mt-4 font-serif text-[clamp(1.3rem,1.15rem+0.6vw,1.6rem)] leading-snug text-ink">
                    <p>{t.quote}</p>
                  </blockquote>
                  <figcaption className="mt-6 text-[0.95rem] text-graphite">
                    <span className="font-semibold">{t.author}</span>
                    {t.context && <span className="text-muted"> · {t.context}</span>}
                    {t.source && <span className="block text-sm text-muted">Źródło: {t.source}</span>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-12 grid gap-8 border-t border-forest/20 pt-10 md:grid-cols-12">
            <span aria-hidden="true" className="font-serif text-[7rem] leading-[0.6] text-forest/25 md:col-span-2">
              „
            </span>
            <div className="md:col-span-7">
              <p className="font-serif text-[clamp(1.4rem,1.2rem+0.8vw,1.85rem)] leading-snug text-ink">
                Wkrótce w tym miejscu pojawią się opinie pacjentów.
              </p>
              <p className="mt-4 max-w-xl text-graphite">
                Publikujemy wyłącznie prawdziwe opinie – za zgodą ich autorów. Po wizycie możesz podzielić się z nami swoimi wrażeniami – każda
                informacja zwrotna pomaga nam pracować lepiej.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

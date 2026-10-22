import { TESTIMONIALS } from "@/data/testimonials";

/**
 * Opinie pacjentów – wyłącznie prawdziwe (data/testimonials.ts).
 * Dopóki lista jest pusta, pokazujemy uczciwą informację zamiast wymyślonych opinii.
 */
export function Testimonials() {
  return (
    <section aria-labelledby="opinie-title" className="section-y bg-sage">
      <div className="container-x">
        <h2 id="opinie-title" className="h2">
          Opinie pacjentów
        </h2>

        {TESTIMONIALS.length > 0 ? (
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <li key={`${t.author}-${i}`}>
                <figure className="h-full rounded-lg bg-white p-6 sm:p-8">
                  <blockquote className="text-lg text-ink">
                    <p>„{t.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-5 text-[0.95rem]">
                    <span className="font-semibold text-ink">{t.author}</span>
                    {t.context && <span className="text-muted">, {t.context}</span>}
                    {t.source && <span className="block text-sm text-muted">Źródło: {t.source}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 max-w-2xl rounded-lg bg-white p-6 sm:p-8">
            <p className="text-lg font-semibold text-ink">Opinie pojawią się tu wkrótce.</p>
            <p className="mt-2 text-graphite">
              Publikujemy wyłącznie prawdziwe opinie, za zgodą ich autorów. Jeśli masz za sobą wizytę u nas, chętnie poznamy Twoje wrażenia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

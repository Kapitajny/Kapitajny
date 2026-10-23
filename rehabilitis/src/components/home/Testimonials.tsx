import { TESTIMONIALS } from "@/data/testimonials";

/**
 * Opinie pacjentów – wyłącznie prawdziwe (data/testimonials.ts).
 * Dopóki lista jest pusta, pokazujemy uczciwą informację zamiast wymyślonych opinii.
 */
export function Testimonials() {
  return (
    <section aria-labelledby="opinie-title" className="section-y border-t border-line">
      <div className="container-x">
        <h2 id="opinie-title" className="h2">
          Opinie pacjentów
        </h2>

        {TESTIMONIALS.length > 0 ? (
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <li key={`${t.author}-${i}`}>
                <figure className="h-full border-l-2 border-forest pl-6">
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
          <p className="section-intro">
            Publikujemy tylko prawdziwe opinie, za zgodą ich autorów. Pierwsze pojawią się tutaj wkrótce. Jeśli masz za sobą wizytę u nas, chętnie poznamy
            Twoje wrażenia.
          </p>
        )}
      </div>
    </section>
  );
}

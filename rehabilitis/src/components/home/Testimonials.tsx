import { TESTIMONIALS } from "@/data/testimonials";

/**
 * Opinie pacjentów – wyłącznie prawdziwe, z data/testimonials.ts.
 * Dopóki lista jest pusta, sekcja się nie wyświetla (nie pokazujemy wymyślonych opinii).
 */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section aria-labelledby="opinie-title" className="border-t border-line py-section">
      <div className="page">
        <h2 id="opinie-title" className="text-h2">
          Opinie pacjentów
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <li key={`${t.author}-${i}`}>
              <figure className="border-l-4 border-brand pl-6">
                <blockquote className="text-lead">
                  <p>„{t.quote}”</p>
                </blockquote>
                <figcaption className="mt-4 text-small">
                  <span className="font-bold">{t.author}</span>
                  {t.context && <span className="text-muted">, {t.context}</span>}
                  {t.source && <span className="block text-muted">Źródło: {t.source}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

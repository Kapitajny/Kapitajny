import { site } from "@/config/site";
import { getGoogleReviews } from "@/lib/server/reviews";

/** Opinie wyłącznie z Google. Bez podłączenia – pusty stan, bez wymyślonych recenzji i ocen. */
export async function Reviews() {
  const data = await getGoogleReviews();

  if (!data || data.reviews.length === 0) {
    return (
      <div className="grid gap-6 border-t-2 border-graphite pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <p className="max-w-2xl text-lg text-muted">
          Opinie naszych klientów pojawią się tutaj automatycznie z profilu Google. Pokazujemy tylko prawdziwe recenzje, bez wybierania i poprawiania.
        </p>
        {site.social.googleReviews && (
          <a href={site.social.googleReviews} target="_blank" rel="noopener noreferrer" className="btn">
            Oceń nas w Google
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {data.rating != null && (
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-display text-6xl font-extrabold leading-none">{data.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1 })}</span>
          <span className="text-muted">średnia ocena w Google{data.count != null ? `, ${data.count} opinii` : ""}</span>
        </p>
      )}
      <ul className="scrollbar-none -mx-5 mt-8 flex snap-x gap-5 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0">
        {data.reviews.slice(0, 6).map((r, i) => (
          <li key={i} className="w-[85%] shrink-0 snap-start border-t-2 border-graphite pt-5 md:w-auto">
            <p className="font-display text-2xl font-bold" aria-label={`Ocena ${r.rating} na 5`}>
              {"★".repeat(Math.round(r.rating))}
              <span className="text-line">{"★".repeat(5 - Math.round(r.rating))}</span>
            </p>
            <blockquote className="mt-3 line-clamp-6 text-[1.02rem]">{r.text}</blockquote>
            <p className="mt-3 text-sm text-muted">
              {r.authorUrl ? (
                <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" className="link">
                  {r.author}
                </a>
              ) : (
                r.author
              )}
              {r.relativeTime && `, ${r.relativeTime}`}
            </p>
          </li>
        ))}
      </ul>
      {data.mapsUrl && (
        <a href={data.mapsUrl} target="_blank" rel="noopener noreferrer" className="link mt-6 inline-block font-semibold">
          Wszystkie opinie w Google
        </a>
      )}
    </div>
  );
}

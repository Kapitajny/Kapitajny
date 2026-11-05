import Image from "next/image";
import Link from "next/link";
import { LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { Hours } from "../Hours";
import { ArrowIcon } from "../Icons";

export function Locations() {
  const [first, second] = LOCATIONS;
  return (
    <section id="lokale" className="section on-dark" aria-labelledby="locations-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div className="section-head__text">
            <h2 id="locations-title" className="display h2">
              Nasze lokale
            </h2>
            <p className="lead muted">Dwie kuchnie, jedna karta. Zjesz na miejscu albo odbierzesz zamówienie na wynos.</p>
          </div>
        </div>

        <div className="locations__grid">
          {LOCATIONS.map((loc, i) => (
            <article key={loc.slug} className="location-card" data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.1}s` }}>
              <div className="location-card__media">
                <Image src={loc.image.src} alt={loc.image.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
                <h3 className="location-card__city">{loc.city}</h3>
              </div>
              <div className="location-card__body">
                <address className="location-card__address">
                  {loc.street}
                  <span>{loc.postalCode}</span>
                </address>
                <div className="location-card__meta">
                  <div>
                    <p className="sr-only">Godziny otwarcia</p>
                    <Hours hours={loc.hours} />
                  </div>
                  <a className="location-card__phone" href={loc.phone.href}>
                    <small>Telefon lokalu</small>
                    {loc.phone.display}
                  </a>
                </div>
                <div className="location-card__actions">
                  <Link className="btn" href={`/lokale/${loc.slug}`} aria-label={`Zobacz lokal: ${loc.city}`}>
                    Zobacz lokal
                  </Link>
                  <a className="text-link" href={mapsDirectionsUrl(loc.mapQuery)} target="_blank" rel="noopener noreferrer">
                    Wyznacz trasę
                    <span className="sr-only"> (otwiera Mapy Google w nowej karcie)</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="route" data-reveal>
          <div className="route__intro">
            <h3 className="h3">Po drodze</h3>
            <p className="muted">Oba lokale leżą przy trasie Warszawa – Grodzisk Mazowiecki. Jedziesz z miasta czy do miasta, zawsze masz jedną BUŁĘ po drodze.</p>
          </div>
          <div>
            <div className="route__line">
              <div className="route__stop">
                <span className="route__dot" aria-hidden="true" />
                <strong>{second.city}</strong>
                <span>{second.street}</span>
              </div>
              <div className="route__track">
                <span>ok. 32 km, 35 min autem</span>
              </div>
              <div className="route__stop">
                <span className="route__dot" aria-hidden="true" />
                <strong>{first.city}</strong>
                <span>{first.street}</span>
              </div>
            </div>
          </div>
          <div className="route__links">
            <Link className="text-link" href={`/lokale/${second.slug}`}>
              Lokal w Grodzisku
              <ArrowIcon width={18} height={18} />
            </Link>
            <Link className="text-link" href={`/lokale/${first.slug}`}>
              Lokal w Warszawie
              <ArrowIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

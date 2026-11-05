import Image from "next/image";
import { LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { Hours } from "../Hours";
import { Arrow, Phone } from "../Icons";
import { OpenPill } from "../OpenStatus";

const PHOTOS: Record<string, { src: string; alt: string }> = {
  warszawa: { src: "/images/c2-lokal-warszawa.jpg", alt: "Witryna lokalu BUŁA w kamienicy przy Marszałkowskiej z musztardową markizą, wieczorem" },
  "grodzisk-mazowiecki": { src: "/images/c2-lokal-grodzisk.jpg", alt: "Wejście do lokalu BUŁA w Grodzisku Mazowieckim: drewniane drzwi, rośliny i rowery przed oknem" },
};

export function Places() {
  return (
    <section id="lokale" className="section" aria-labelledby="places-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="places-title" className="display h2">
            Dwa lokale, ta sama kuchnia
          </h2>
          <p className="lead muted">Zjesz na miejscu albo odbierzesz zamówienie z okienka. Status otwarcia liczymy według czasu w Polsce.</p>
        </div>
        <div className="places">
          {LOCATIONS.map((loc) => (
            <article key={loc.slug} className="place" aria-labelledby={`p-${loc.slug}`}>
              <div className="place__photo">
                <Image src={PHOTOS[loc.slug].src} alt={PHOTOS[loc.slug].alt} fill sizes="(max-width: 1000px) 100vw, 55vw" />
              </div>
              <div className="place__info">
                <OpenPill loc={loc} />
                <h3 id={`p-${loc.slug}`} className="display h2" style={{ fontSize: "clamp(2.2rem, 1.6rem + 2vw, 3.4rem)" }}>
                  {loc.city}
                </h3>
                <address>
                  {loc.street}
                  <br />
                  {loc.postalCode}
                </address>
                <p className="muted">{loc.intro}</p>
                <Hours hours={loc.hours} />
                <div className="place__actions">
                  <a className="btn btn--line" href={mapsDirectionsUrl(loc.mapQuery)} target="_blank" rel="noopener noreferrer">
                    Wyznacz trasę
                    <Arrow />
                    <span className="sr-only"> (Mapy Google, nowa karta)</span>
                  </a>
                  <a className="link" href={loc.phone.href}>
                    <Phone />
                    {loc.phone.display}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

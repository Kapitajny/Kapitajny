import Image from "next/image";
import Link from "next/link";
import { LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { Hours } from "../Hours";
import { OpenPill } from "../OpenStatus";

const PHOTOS: Record<string, { src: string; w: number; h: number; alt: string; layout: "a" | "b" }> = {
  warszawa: {
    src: "/images/warszawa.jpg",
    w: 1536,
    h: 1024,
    alt: "Wnętrze lokalu w kamienicy przy Marszałkowskiej: białe ściany, czarna lada, długi dębowy stół i łukowe okno",
    layout: "a",
  },
  "grodzisk-mazowiecki": {
    src: "/images/grodzisk.jpg",
    w: 1136,
    h: 1408,
    alt: "Biały dwukondygnacyjny budynek lokalu w Grodzisku Mazowieckim z czarną witryną i ławką przed wejściem",
    layout: "b",
  },
};

export function Places() {
  return (
    <section id="lokale" className="section frame" aria-labelledby="places-title">
      <h2 id="places-title" className="sr-only">
        Nasze lokale
      </h2>
      {LOCATIONS.map((loc) => {
        const ph = PHOTOS[loc.slug];
        const two = loc.city.includes(" ");
        return (
          <article key={loc.slug} className="place" data-layout={ph.layout} aria-labelledby={`pl-${loc.slug}`}>
            <h3 id={`pl-${loc.slug}`} className={`mega place__city${two ? " place__city--two" : ""}`}>
              {two ? (
                <>
                  {loc.city.split(" ")[0]}
                  <br />
                  {loc.city.split(" ").slice(1).join(" ")}
                </>
              ) : (
                loc.city
              )}
            </h3>
            <div className="grid place__body">
              <figure className="place__photo zoom reveal">
                <Image src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} sizes="(max-width: 760px) 100vw, 60vw" />
              </figure>
              <div className="place__info">
                <OpenPill loc={loc} />
                <address>
                  {loc.street}
                  <br />
                  <span className="grey">{loc.postalCode}</span>
                </address>
                <p className="prose grey">{loc.intro}</p>
                <Hours hours={loc.hours} />
                <a className="link num" href={loc.phone.href}>
                  {loc.phone.display}
                </a>
                <div className="place__actions">
                  <Link className="btn" href={`/lokale/${loc.slug}`} aria-label={`Zobacz lokal: ${loc.city}`}>
                    Zobacz lokal
                  </Link>
                  <a className="link" href={mapsDirectionsUrl(loc.mapQuery)} target="_blank" rel="noopener noreferrer">
                    Wyznacz trasę<span className="sr-only"> (Mapy Google, nowa karta)</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

import Link from "next/link";
import { Hours } from "@/components/Hours";
import { IconArrow, IconPhone } from "@/components/Icons";
import { MapEmbed } from "@/components/MapEmbed";
import { OpenPill } from "@/components/OpenStatus";
import { LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { SITE } from "@/data/site";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="lokale" className="places" aria-labelledby="places-title">
      <div className="wrap">
        <div className="places__head">
          <h2 id="places-title" className="h2" data-reveal="">
            Lokale i kontakt
          </h2>
          <p className="places__lead">Dwa adresy pod Warszawą i w samym centrum. W obu jesz na miejscu albo odbierasz zamówienie z okienka.</p>
        </div>

        <div className="places__grid">
          {LOCATIONS.map((l) => (
            <article key={l.slug} className="place" aria-labelledby={`place-${l.slug}`}>
              <header className="place__top">
                <h3 id={`place-${l.slug}`} className="place__city">
                  {l.city}
                </h3>
                <OpenPill loc={l} />
              </header>
              <address className="place__addr">
                {l.street}
                <br />
                {l.postalCode}
              </address>
              <Hours hours={l.hours} />
              <div className="place__acts">
                <a className="btn btn--sm btn--order" href={l.phone.href}>
                  <IconPhone className="btn__ico" />
                  <span className="num">{l.phone.display}</span>
                </a>
                <Link className="link link--arrow" href={`/lokale/${l.slug}`}>
                  Więcej o lokalu<span className="sr-only"> {l.city}</span>
                  <IconArrow className="link__ico" />
                </Link>
              </div>
              <MapEmbed query={l.mapQuery} title={`Mapa: BUŁA ${l.city}, ${l.street}`} directionsUrl={mapsDirectionsUrl(l.mapQuery)} />
            </article>
          ))}
        </div>

        <div id="kontakt" className="talk">
          <div className="talk__order">
            <h3 className="talk__title">Zamów telefonicznie</h3>
            <a className="talk__num num" href={SITE.phone.href}>
              {SITE.phone.display}
            </a>
            <p>Jeden numer dla obu lokali. Powiedz, gdzie odbierasz. Zamówienie jest zwykle gotowe po 10–15 minutach.</p>
            <a className="btn btn--lg btn--mustard" href={SITE.phone.href}>
              <IconPhone className="btn__ico" />
              Zadzwoń i zamów
            </a>
          </div>
          <div className="talk__write">
            <h3 className="talk__title">Napisz do nas</h3>
            <p className="talk__sub">Rezerwacja dla grupy, catering, pytanie o alergeny. Odpowiadamy w dni robocze.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

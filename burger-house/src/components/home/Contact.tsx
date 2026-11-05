import { LOCATIONS } from "@/data/locations";
import { SITE } from "@/data/site";
import { Hours } from "../Hours";
import { PhoneIcon } from "../Icons";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="kontakt" className="section on-cream" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__order" data-reveal>
          <h2 id="contact-title" className="display h2">
            Zadzwoń i zamów
          </h2>
          <a className="contact__phone" href={SITE.phone.href} aria-label={`Zadzwoń: ${SITE.phone.display}`}>
            {SITE.phone.display}
          </a>
          <p className="lead">
            Jeden numer dla obu lokali. Powiedz, gdzie odbierasz, a zamówienie przygotujemy w około 15 minut.
          </p>
          <div>
            <a className="btn" href={SITE.phone.href}>
              <PhoneIcon />
              Zadzwoń i zamów
            </a>
          </div>
          <div className="contact__details">
            {LOCATIONS.map((loc) => (
              <div key={loc.slug}>
                <h3 className="h3">{loc.city}</h3>
                <p>{loc.street}</p>
                <Hours hours={loc.hours} />
              </div>
            ))}
          </div>
        </div>

        <div className="form-card" data-reveal style={{ ["--reveal-delay" as string]: "0.1s" }}>
          <div className="form-card__head">
            <h3 className="h3">Napisz do nas</h3>
            <p className="muted">Pytania o catering, rezerwacje dla grup, współpracę albo opinia o burgerze. Odpowiadamy w ciągu dwóch dni roboczych.</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

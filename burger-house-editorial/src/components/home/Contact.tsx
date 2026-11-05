import { LOCATIONS } from "@/data/locations";
import { SITE } from "@/data/site";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="kontakt" aria-labelledby="contact-title">
      <div className="ink section frame">
        <div className="call">
          <h2 id="contact-title" className="mega call__title">
            Zadzwoń.
          </h2>
        </div>
        <a className="call__phone num" href={SITE.phone.href} aria-label={`Zadzwoń i zamów: ${SITE.phone.display}`}>
          {SITE.phone.display}
        </a>
        <div className="grid call__row">
          <p className="prose">Jeden numer dla obu lokali. Powiedz, gdzie odbierasz, a zamówienie będzie gotowe po około 15 minutach.</p>
          {LOCATIONS.map((l) => (
            <p key={l.slug} className="label">
              {l.city}, {l.street}
              <br />
              <span className="grey">
                {l.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(", ")}
              </span>
            </p>
          ))}
        </div>
      </div>
      <div className="section frame">
        <div className="grid write">
          <div className="write__head">
            <h2 className="big">Napisz</h2>
            <p className="prose grey">Catering, rezerwacja dla grupy, współpraca albo uwaga o burgerze. Odpowiadamy w ciągu dwóch dni roboczych.</p>
          </div>
          <div className="write__form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

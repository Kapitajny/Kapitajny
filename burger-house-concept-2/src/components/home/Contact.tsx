import { SITE } from "@/data/site";
import { Phone } from "../Icons";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="kontakt" aria-labelledby="contact-title">
      <div className="order mustard">
        <div className="wrap order__inner">
          <div>
            <h2 id="contact-title" className="h3">
              Zamów telefonicznie, odbierz za kwadrans
            </h2>
            <a className="order__phone" href={SITE.phone.href} aria-label={`Zadzwoń i zamów: ${SITE.phone.display}`}>
              {SITE.phone.display}
            </a>
          </div>
          <a className="btn" href={SITE.phone.href}>
            <Phone />
            Zadzwoń i zamów
          </a>
        </div>
      </div>
      <div className="section">
        <div className="wrap contact">
          <div className="contact__aside">
            <h2 className="display h2">Napisz do nas</h2>
            <p className="lead muted">Catering, rezerwacja dla grupy, współpraca albo uwaga o burgerze. Odpowiadamy w ciągu dwóch dni roboczych.</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

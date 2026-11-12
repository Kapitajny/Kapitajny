import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/data/site";
import styles from "./home.module.css";

export function Contact({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <section id="kontakt" className={`section ${styles.contact}`} aria-labelledby="kontakt-tytul">
      <div className={`container ${styles.contactGrid}`}>
        <div className={styles.contactIntro}>
          <Heading id="kontakt-tytul" className={styles.contactTitle}>
            Kontakt
          </Heading>
          <p className="lead">Masz pytanie o sok, zamówienie albo dostawę? Napisz, odpowiemy.</p>
          <dl className={styles.contactData}>
            <div>
              <dt>Adres</dt>
              <dd>
                {site.contact.street}, {site.contact.postalCode} {site.contact.city}
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>{site.contact.phone}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{site.contact.email}</dd>
            </div>
          </dl>
          <p className="demo-note">
            <strong>Dane demonstracyjne.</strong> Adres, numer telefonu i e-mail są fikcyjne i nie są prawdziwymi danymi
            kontaktowymi.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

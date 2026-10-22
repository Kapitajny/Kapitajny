import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pending } from "@/components/ui/Pending";
import { siteConfig } from "@/content/site";
import { getDeliveryMode } from "@/lib/contact/delivery";
import { pageMetadata } from "@/lib/seo";
import { typesetDeep } from "@/lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt – umów konsultację",
  description:
    "Opisz problem lub potrzebę w formularzu. Po rozmowie wstępnej dowiesz się, od czego warto zacząć w obszarze obsługi IT, bezpieczeństwa lub infrastruktury.",
  path: "/kontakt",
});

const nextSteps = typesetDeep([
  { title: "Czytamy zgłoszenie", text: "Sprawdzamy, czy sprawa mieści się w naszym zakresie. Jeśli nie, powiemy to wprost." },
  { title: "Odpowiadamy e-mailem", text: "Proponujemy termin krótkiej rozmowy albo dopytujemy o szczegóły." },
  { title: "Rozmowa wstępna", text: "Ustalamy, od czego zacząć i czego będziemy potrzebować od Twojej firmy." },
]);

export default function ContactPage() {
  const demoMode = getDeliveryMode() === "demo";

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/kontakt", label: "Kontakt" }]}
        title="Umów konsultację"
        lede="Opisz w kilku zdaniach, co nie działa albo co chcesz zmienić. Nie musisz znać fachowych nazw – dopytamy o szczegóły."
      />
      <div className={`container ${styles.layout}`}>
        <aside className={styles.aside} aria-label="Informacje o kontakcie">
          <section aria-labelledby="co-dalej">
            <h2 id="co-dalej" className={styles.h2}>
              Co stanie się po wysłaniu
            </h2>
            <ol className={styles.steps}>
              {nextSteps.map((step) => (
                <li key={step.title}>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepText}>{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.incident} aria-labelledby="incydent">
            <h2 id="incydent" className={styles.h3}>
              Trwa incydent?
            </h2>
            <p>
              Formularz nie jest kanałem alarmowym. Odłącz podejrzane urządzenie od sieci, ale go nie wyłączaj, i zgłoś incydent do CERT Polska przez{" "}
              <a href="https://incydent.cert.pl" className="text-link" rel="noopener noreferrer" target="_blank">
                incydent.cert.pl
                <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="dane-kontaktowe">
            <h2 id="dane-kontaktowe" className={styles.h3}>
              Inne formy kontaktu
            </h2>
            <dl className={styles.contactList}>
              <div>
                <dt>E-mail</dt>
                <dd>
                  {siteConfig.contactEmail ? (
                    <a href={`mailto:${siteConfig.contactEmail}`} className="text-link">
                      {siteConfig.contactEmail}
                    </a>
                  ) : (
                    <Pending>adres kontaktowy</Pending>
                  )}
                </dd>
              </div>
              <div>
                <dt>Dane firmy</dt>
                <dd>
                  <Pending>nazwa, adres siedziby, NIP</Pending>
                </dd>
              </div>
            </dl>
            <p className={styles.privacy}>
              Dane z formularza wykorzystujemy wyłącznie do odpowiedzi na zapytanie. Szczegóły w{" "}
              <Link href="/polityka-prywatnosci" className="text-link">
                polityce prywatności
              </Link>
              .
            </p>
          </section>
        </aside>

        <section className={styles.formColumn} aria-labelledby="formularz">
          <h2 id="formularz" className={styles.h2}>
            Formularz zapytania
          </h2>
          <ContactForm demoMode={demoMode} />
        </section>
      </div>
    </>
  );
}

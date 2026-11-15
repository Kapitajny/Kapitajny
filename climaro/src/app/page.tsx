import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Hero } from "@/components/Hero";
import { formatPrice, services } from "@/data/services";
import { site } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const reasons = [
  {
    title: "Ceny znasz przed pierwszą rozmową",
    text: "Cennik usług jest jawny. Po wizji lokalnej dostajesz pisemną ofertę z ceną końcową, terminem i zakresem prac.",
  },
  {
    title: "Dobór na podstawie pomiarów, nie na oko",
    text: "Moc klimatyzatora, pompy ciepła czy centrali wentylacyjnej liczymy dla konkretnego budynku i sposobu, w jaki z niego korzystasz.",
  },
  {
    title: "Montaż zgodny z wymaganiami producenta",
    text: "Próba szczelności, próżniowanie instalacji i protokół uruchomienia to warunki, od których zależy gwarancja urządzenia.",
  },
  {
    title: "Jeden zespół od montażu po serwis",
    text: "Instalacje, które wykonaliśmy, serwisujemy sami. Znamy je od pierwszego dnia i wiemy, co sprawdzić przy przeglądzie.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className={`theme-light section`} aria-labelledby="uslugi-tytul">
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 id="uslugi-tytul" className="section-title">
              Usługi i ceny
            </h2>
            <p className="lead">Cztery obszary, jeden zespół: od doboru urządzenia po regularny serwis. Ceny początkowe widzisz od razu.</p>
          </div>

          <ul className={styles.serviceList}>
            {services.map((service) => (
              <li key={service.slug} className={styles.serviceRow}>
                <div className={styles.serviceImage}>
                  <Image src={service.image.src} alt="" fill sizes="(min-width: 60rem) 14rem, 30vw" />
                </div>
                <div className={styles.serviceText}>
                  <h3 className={styles.serviceName}>
                    <Link href={`/uslugi#${service.slug}`} className={styles.serviceLink}>
                      {service.name}
                    </Link>
                  </h3>
                  <p>{service.short}</p>
                </div>
                <dl className={styles.servicePrices}>
                  {service.prices.map((price) => (
                    <div key={price.label}>
                      <dt>{price.label}</dt>
                      <dd className="num">od {formatPrice(price.from)}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>

          <div className={styles.listFoot}>
            <p className={styles.note}>Ceny orientacyjne. Ostateczny koszt podajemy w ofercie po poznaniu budynku i instalacji.</p>
            <Link href="/uslugi" className="text-link">
              Zakres prac i pełny cennik
            </Link>
          </div>
        </div>
      </section>

      <section className={`theme-graphite section`} aria-labelledby="firma-tytul">
        <div className={`container ${styles.about}`}>
          <div className={styles.aboutImage}>
            <Image
              src="/images/o-nas-przeglad.jpg"
              alt="Serwisant z latarką sprawdza jednostkę zewnętrzną klimatyzacji przy domu"
              fill
              sizes="(min-width: 60rem) 40vw, 100vw"
            />
          </div>
          <div className={styles.aboutText}>
            <h2 id="firma-tytul" className="section-title">
              Od {site.foundedYear} roku montujemy i serwisujemy instalacje na Mazowszu
            </h2>
            <p className="prose">
              CLIMARO to firma instalacyjna z Grodziska Mazowieckiego. Zaczynaliśmy od montażu klimatyzacji w domach i biurach, dziś zajmujemy się
              też pompami ciepła, rekuperacją i stałym serwisem instalacji dla firm.
            </p>
            <dl className={styles.facts}>
              <div>
                <dt>Siedziba</dt>
                <dd>{site.city}</dd>
              </div>
              <div>
                <dt>Obszar działania</dt>
                <dd>Całe {site.area}</dd>
              </div>
              <div>
                <dt>Na rynku od</dt>
                <dd className="num">{site.foundedYear} roku</dd>
              </div>
              <div>
                <dt>Uprawnienia</dt>
                <dd>Certyfikaty F-gazowe dla firmy i instalatorów</dd>
              </div>
            </dl>
            <Link href="/o-nas" className="btn btn-secondary">
              Więcej o firmie
            </Link>
          </div>
        </div>
      </section>

      <section className={`theme-light section`} aria-labelledby="dlaczego-tytul">
        <div className={`container ${styles.reasons}`}>
          <div className={styles.reasonsHead}>
            <h2 id="dlaczego-tytul" className="section-title">
              Dlaczego CLIMARO
            </h2>
            <p className="lead">Nie obiecujemy rzeczy, których nie da się sprawdzić. Oto, na co możesz liczyć przy każdym zleceniu.</p>
          </div>
          <ul className={styles.reasonList}>
            {reasons.map((reason) => (
              <li key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

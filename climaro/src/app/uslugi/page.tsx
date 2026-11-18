import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { CheckIcon, ChevronIcon } from "@/components/Icons";
import { PageIntro } from "@/components/PageIntro";
import { PRICE_NOTE, formatPrice, services } from "@/data/services";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Usługi i cennik – klimatyzacja, pompy ciepła, rekuperacja, serwis",
  description:
    "Zakres prac i ceny początkowe: montaż klimatyzacji od 799 zł, pompy ciepła od 12 900 zł, rekuperacja od 8 900 zł, przegląd instalacji od 299 zł. Mazowsze.",
  alternates: { canonical: "/uslugi" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="Usługi i cennik"
        lead="Każda usługa ma cenę początkową. Ostateczny koszt podajemy w pisemnej ofercie, gdy poznamy budynek i instalację."
      >
        <nav aria-label="Usługi na tej stronie" className={styles.jump}>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <a href={`#${service.slug}`}>
                  {service.name}
                  <ChevronIcon />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      {services.map((service, index) => (
        <section
          key={service.slug}
          id={service.slug}
          className={`${index % 2 === 0 ? "theme-white" : "theme-light"} ${styles.service}`}
          aria-labelledby={`${service.slug}-tytul`}
        >
          <div className="container">
            <div className={styles.grid} data-flip={index % 2 === 1 || undefined}>
              <div className={styles.photo}>
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="(min-width: 64rem) 45vw, 100vw"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              <div className={styles.body}>
                <h2 id={`${service.slug}-tytul`} className="h-section">
                  {service.name}
                </h2>
                <p className="lead">{service.description}</p>

                <div className={styles.priceBox}>
                  <table className={styles.prices}>
                    <caption className="visually-hidden">Cennik: {service.name}</caption>
                    <thead className="visually-hidden">
                      <tr>
                        <th scope="col">Usługa</th>
                        <th scope="col">Cena</th>
                      </tr>
                    </thead>
                    <tbody>
                      {service.prices.map((price) => (
                        <tr key={price.label}>
                          <th scope="row">
                            {price.label}
                            {price.note ? <span className={styles.priceNote}>{price.note}</span> : null}
                          </th>
                          <td className="num">od {formatPrice(price.from)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className={styles.includes}>{service.priceIncludes}</p>
                </div>

                <Link href={`/kontakt?usluga=${service.slug}`} className={`btn btn-primary ${styles.ask}`}>
                  Zapytaj o wycenę
                  <span className="visually-hidden"> – {service.name}</span>
                </Link>
              </div>
            </div>

            <div className={styles.details}>
              <div>
                <h3 className="h-card">Zakres prac</h3>
                <ul className={styles.scope}>
                  {service.scope.map((item) => (
                    <li key={item}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="h-card">Od czego zależy koszt</h3>
                <p className={styles.factors}>{service.costFactors}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="theme-light" aria-label="Informacja o cenach">
        <div className={`container ${styles.noteWrap}`}>
          <div className={styles.note} role="note">
            <p>{PRICE_NOTE}</p>
            <p className={styles.demo}>Kwoty na tej stronie są przykładowe – to projekt demonstracyjny, a nie zweryfikowany cennik rynkowy.</p>
          </div>
        </div>
      </section>

      <CtaBand
        image={{ src: "/images/rekuperacja-maszynownia.jpg", position: "50% 45%" }}
        title="Nie wiesz, której usługi potrzebujesz?"
        text="Opisz budynek i to, co chcesz osiągnąć. Doradzimy rozwiązanie i podamy wstępny koszt."
      />
    </>
  );
}

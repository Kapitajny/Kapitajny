import type { Metadata } from "next";
import Link from "next/link";
import { AnnotatedPhoto } from "@/components/AnnotatedPhoto";
import { CtaBand } from "@/components/CtaBand";
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
                  <span>{service.name}</span>
                  <span className="num">
                    {service.prices[0].label.toLowerCase()} od {formatPrice(service.prices[0].from)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.introNote}>{PRICE_NOTE}</p>
      </PageIntro>

      {services.map((service, index) => (
        <section
          key={service.slug}
          id={service.slug}
          className={`${index % 2 === 0 ? "theme-graphite" : "theme-dark"} ${styles.service}`}
          aria-labelledby={`${service.slug}-tytul`}
        >
          <div className="container">
            <div className={styles.grid}>
              <header className={styles.head}>
                <h2 id={`${service.slug}-tytul`} className={styles.name}>
                  {service.name}
                </h2>
                <p className={styles.description}>{service.description}</p>
              </header>

              <div className={styles.photo}>
                <AnnotatedPhoto image={service.image} points={service.points} sizes="(min-width: 64rem) 56vw, 100vw" eager={index === 0} />
              </div>

              <div className={styles.sheet}>
                <table className={styles.prices}>
                  <caption className={styles.caption}>Cennik</caption>
                  <thead className="visually-hidden">
                    <tr>
                      <th scope="col">Usługa</th>
                      <th scope="col">Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.prices.map((price) => (
                      <tr key={price.label}>
                        <th scope="row">{price.label}</th>
                        <td className="num">
                          <span className={styles.from}>od</span> {formatPrice(price.from)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={styles.sheetNote}>Ceny orientacyjne – zależą od instalacji i zakresu prac.</p>
                <Link href={`/kontakt?usluga=${service.slug}`} className={`btn btn-primary ${styles.ask}`}>
                  Zapytaj o wycenę
                  <span className="visually-hidden"> – {service.name}</span>
                </Link>
              </div>
            </div>

            <div className={styles.lower}>
              <div>
                <h3 className={styles.subhead}>Zakres prac</h3>
                <ol className={styles.scope}>
                  {service.scope.map((item, step) => (
                    <li key={item}>
                      <span className={`num ${styles.stepNo}`} aria-hidden="true">
                        {String(step + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={styles.factors}>
                <h3 className={styles.subhead}>Od czego zależy koszt</h3>
                <p>{service.costFactors}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <div className="theme-light">
        <div className={`container ${styles.noteWrap}`}>
          <div className={styles.note} role="note">
            <p>{PRICE_NOTE}</p>
            <p className={styles.demo}>Kwoty na tej stronie są przykładowe – to projekt demonstracyjny, a nie zweryfikowany cennik rynkowy.</p>
          </div>
        </div>
      </div>

      <CtaBand title="Nie wiesz, której usługi potrzebujesz?" text="Opisz budynek i to, co chcesz osiągnąć. Doradzimy rozwiązanie i podamy wstępny koszt." />
    </>
  );
}

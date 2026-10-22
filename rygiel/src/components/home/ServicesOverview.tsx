import Link from "next/link";
import { additionalServices, services } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ServicesOverview.module.css";
import { typeset } from "@/lib/typography";

export function ServicesOverview() {
  return (
    <section className={styles.section} aria-labelledby="uslugi-title">
      <div className="container">
        <SectionHeading
          id="uslugi-title"
          layout="split"
          title="Trzy obszary, za które bierzemy odpowiedzialność"
          intro={
            <p>
              {typeset(
                "Utrzymanie, bezpieczeństwo i infrastruktura w jednych rękach. Dzięki temu nikt nie przerzuca problemu na innego dostawcę, a zmiany w jednym obszarze uwzględniają pozostałe.",
              )}
            </p>
          }
        />

        <div className={styles.table}>
          <div className={styles.head} aria-hidden="true">
            <span>Usługa</span>
            <span>Kiedy warto</span>
            <span>Co obejmuje</span>
          </div>
          <ul role="list" className={styles.rows}>
          {services.map((service) => (
            <li key={service.slug} className={styles.row}>
              <div className={styles.name}>
                <h3 id={`usluga-${service.slug}`} className={styles.title}>
                  {service.name}
                </h3>
                <p className={styles.english} lang="en">
                  {service.englishName}
                </p>
                <Link href={service.href} className={`text-link ${styles.more}`}>
                  Szczegóły usługi<span className="visually-hidden"> {service.name}</span>
                </Link>
              </div>
              <div className={styles.cell}>
                <p className={styles.cellLabel}>Kiedy warto</p>
                <ul role="list" className={styles.problems}>
                  {service.problems.slice(0, 2).map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.cell}>
                <p className={styles.cellLabel}>Co obejmuje</p>
                <ul role="list" className={styles.scope}>
                  {service.scope.map((item) => (
                    <li key={item.title}>{item.title}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          </ul>
        </div>

        <div className={styles.extra}>
          <p className={styles.extraTitle}>Poza stałą współpracą</p>
          <ul role="list" className={styles.extraList}>
            {additionalServices.map((item) => (
              <li key={item.name}>
                <strong>{item.name}.</strong> {item.text}
              </li>
            ))}
          </ul>
          <Link href="/uslugi#dodatkowe" className="text-link">
            Usługi dodatkowe
          </Link>
        </div>
      </div>
    </section>
  );
}

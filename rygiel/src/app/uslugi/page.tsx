import type { Metadata } from "next";
import Link from "next/link";
import { BenefitList, DeliverySteps, ProblemList, ScopeList, ServiceCta } from "@/components/services/ServiceBlocks";
import { Accordion } from "@/components/ui/Accordion";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { PageHeader } from "@/components/ui/PageHeader";
import { additionalServices, services } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Usługi: obsługa IT, cyberbezpieczeństwo, chmura i infrastruktura",
  description:
    "Zakres usług Rygiel: stała administracja i wsparcie IT, audyty i testy bezpieczeństwa wykonywane za zgodą właściciela systemu, kopie zapasowe, ciągłość działania i środowiska chmurowe.",
  path: "/uslugi",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/uslugi", label: "Usługi" }]}
        title="Usługi dla firm, które chcą mieć IT pod kontrolą"
        lede="Trzy obszary, które się przenikają: codzienne utrzymanie, bezpieczeństwo oraz infrastruktura z kopiami zapasowymi. Możesz zacząć od jednego z nich – zakres opisujemy tak, żeby było jasne, za co odpowiadamy my, a za co Twoja firma."
      />

      <div className={`container ${styles.layout}`}>
        <nav className={styles.index} aria-labelledby="spis-uslug">
          <p id="spis-uslug" className={styles.indexTitle}>
            Na tej stronie
          </p>
          <ol className={styles.indexList}>
            {services.map((service) => (
              <li key={service.slug}>
                <a href={`#${service.slug}`}>{service.name}</a>
              </li>
            ))}
            <li>
              <a href="#dodatkowe">Usługi dodatkowe</a>
            </li>
          </ol>
        </nav>

        <div className={styles.content}>
          {services.map((service) => (
            <section key={service.slug} id={service.slug} className={styles.pillar} aria-labelledby={`${service.slug}-title`}>
              <header className={styles.pillarHeader}>
                <p className={styles.english} lang="en">
                  {service.englishName}
                </p>
                <h2 id={`${service.slug}-title`} className={styles.pillarTitle}>
                  {service.name}
                </h2>
                <p className={styles.summary}>{service.summary}</p>
                <Link href={service.href} className="text-link">
                  Pełny opis usługi<span className="visually-hidden">: {service.name}</span>
                </Link>
              </header>

              <div className={styles.blocks}>
                <section className={styles.block} aria-labelledby={`${service.slug}-problemy`}>
                  <h3 id={`${service.slug}-problemy`} className={styles.blockTitle}>
                    Z czym przychodzą firmy
                  </h3>
                  <ProblemList items={service.problems} />
                </section>

                <section className={styles.block} aria-labelledby={`${service.slug}-zakres`}>
                  <h3 id={`${service.slug}-zakres`} className={styles.blockTitle}>
                    Zakres usługi
                  </h3>
                  <ScopeList items={service.scope} columns={1} />
                </section>

                <section className={styles.block} aria-labelledby={`${service.slug}-korzysci`}>
                  <h3 id={`${service.slug}-korzysci`} className={styles.blockTitle}>
                    Co zyskujesz
                  </h3>
                  <BenefitList items={service.benefits} />
                </section>

                <section className={styles.block} aria-labelledby={`${service.slug}-realizacja`}>
                  <h3 id={`${service.slug}-realizacja`} className={styles.blockTitle}>
                    Jak to realizujemy
                  </h3>
                  <DeliverySteps items={service.delivery} />
                </section>

                <section className={`${styles.block} ${styles.wide}`} aria-labelledby={`${service.slug}-faq`}>
                  <h3 id={`${service.slug}-faq`} className={styles.blockTitle}>
                    Najczęstsze pytania
                  </h3>
                  <Accordion items={service.faq} headingLevel={4} />
                </section>
              </div>

              <ServiceCta service={service} />
            </section>
          ))}

          <section id="dodatkowe" className={styles.extra} aria-labelledby="dodatkowe-title">
            <h2 id="dodatkowe-title" className={styles.pillarTitle}>
              Usługi dodatkowe
            </h2>
            <p className={styles.summary}>
              Jednorazowe zadania, które nie wymagają stałej współpracy. Wyceniamy je po krótkiej rozmowie o zakresie.
            </p>
            <dl className={styles.extraList}>
              {additionalServices.map((item) => (
                <div key={item.name}>
                  <dt>{item.name}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
            <Link href="/kontakt?usluga=inne" className="text-link">
              Zapytaj o wdrożenie, konsultację lub szkolenie
            </Link>
          </section>
        </div>
      </div>

      <ClosingCta headingId="uslugi-cta" title="Nie wiesz, od którego obszaru zacząć?" text="To normalne. Zwykle zaczynamy od przeglądu środowiska – jego wynik pokazuje, gdzie jest największe ryzyko i co warto zrobić najpierw." />
    </>
  );
}

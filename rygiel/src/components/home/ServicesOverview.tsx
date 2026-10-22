import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { illustrations, type IllustrationName } from "@/components/ui/illustrations";
import { ArrowIcon } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { additionalServices, services, type ServiceSlug } from "@/content/services";
import { typeset } from "@/lib/typography";
import styles from "./ServicesOverview.module.css";

const serviceIcons: Record<ServiceSlug, IconName> = {
  "obsluga-it": "server",
  cyberbezpieczenstwo: "shield",
  "chmura-i-infrastruktura": "cloud",
};

const serviceImages: Record<ServiceSlug, IllustrationName> = {
  "obsluga-it": "linie-swiatla",
  cyberbezpieczenstwo: "ochrona-sieci",
  "chmura-i-infrastruktura": "tunel-danych",
};

export function ServicesOverview() {
  return (
    <section className={styles.section} aria-labelledby="uslugi-title">
      <div className="container">
        <SectionHeading
          id="uslugi-title"
          title="Usługi"
          intro={
            <p>
              {typeset(
                "Utrzymanie, bezpieczeństwo i infrastruktura w jednych rękach. Dzięki temu nikt nie przerzuca problemu na innego dostawcę, a zmiany w jednym obszarze uwzględniają pozostałe.",
              )}
            </p>
          }
        />

        <ul role="list" className={styles.cards}>
          {services.map((service) => (
            <li key={service.slug} className={styles.card}>
              {/* Grafika jest dekoracyjna – treść karty niesie tytuł i opis */}
              <div className={styles.media}>
                <Image
                  src={illustrations[serviceImages[service.slug]].src}
                  alt=""
                  sizes="(max-width: 60rem) 100vw, 400px"
                  placeholder="blur"
                  className={styles.mediaImage}
                />
              </div>
              <span className={styles.icon}>
                <Icon name={serviceIcons[service.slug]} size={26} />
              </span>
              <h3 className={styles.title}>
                <Link href={service.href} className={styles.titleLink}>
                  {service.name}
                </Link>
              </h3>
              <p className={styles.summary}>{service.summary}</p>
              <ul role="list" className={styles.scope}>
                {service.scope.slice(0, 4).map((item) => (
                  <li key={item.title}>
                    <Icon name="check" size={16} className={styles.scopeIcon} />
                    {item.title}
                  </li>
                ))}
              </ul>
              <span className={styles.more} aria-hidden="true">
                Szczegóły usługi <ArrowIcon />
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.extra}>
          <p className={styles.extraTitle}>Poza stałą współpracą</p>
          <ul role="list" className={styles.extraList}>
            {additionalServices.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.text}</span>
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

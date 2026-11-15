import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Service } from "@/data/services";
import { ChevronIcon } from "./Icons";
import styles from "./ServiceCards.module.css";

/** Karty usług: zdjęcie, nazwa, krótki opis, cena początkowa i przejście do pełnego cennika. */
export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <ul className={styles.grid}>
      {services.map((service) => {
        const main = service.prices[0];
        return (
          <li key={service.slug} className={styles.card}>
            <div className={styles.image}>
              <Image src={service.image.src} alt="" fill sizes="(min-width: 75rem) 22vw, (min-width: 40rem) 45vw, 100vw" />
            </div>
            <div className={styles.body}>
              <h3 className="h-card">
                <Link href={`/uslugi#${service.slug}`} className={styles.link}>
                  {service.name}
                </Link>
              </h3>
              <p className={styles.text}>{service.short}</p>
              <p className={styles.price}>
                <span className={styles.priceLabel}>{main.label}</span>
                <span className="num">
                  od <strong>{formatPrice(main.from)}</strong>
                </span>
                {main.note ? <span className={styles.priceNote}>{main.note}</span> : null}
              </p>
              <span className={styles.more} aria-hidden="true">
                Zakres i cennik
                <ChevronIcon />
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

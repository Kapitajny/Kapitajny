"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Service } from "@/data/services";
import { ChevronIcon } from "./Icons";
import styles from "./ServiceIndex.module.css";

/**
 * Indeks usług: lista z cenami i duże zdjęcie, które zmienia się po najechaniu lub przejściu klawiaturą na wiersz.
 * Na wąskich ekranach każdy wiersz ma własne zdjęcie.
 */
export function ServiceIndex({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.index}>
      <ul className={styles.list}>
        {services.map((service, index) => (
          <li
            key={service.slug}
            className={styles.row}
            data-active={active === index || undefined}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            <div className={styles.rowImage}>
              <Image src={service.image.src} alt="" fill sizes="100vw" />
            </div>
            <div className={styles.rowMain}>
              <h3 className={styles.name}>
                <Link href={`/uslugi#${service.slug}`} className={styles.link}>
                  {service.name}
                </Link>
              </h3>
              <p className={styles.short}>{service.short}</p>
            </div>
            <dl className={styles.prices}>
              <div className={styles.mainPrice}>
                <dt>{service.prices[0].label}</dt>
                <dd className="num">
                  <span className={styles.from}>od</span> {formatPrice(service.prices[0].from)}
                </dd>
              </div>
              {service.prices.slice(1).map((price) => (
                <div key={price.label}>
                  <dt>{price.label}</dt>
                  <dd className="num">od {formatPrice(price.from)}</dd>
                </div>
              ))}
            </dl>
            <ChevronIcon className={styles.chevron} />
          </li>
        ))}
      </ul>

      <div className={styles.stage} aria-hidden="true">
        <div className={styles.stageFrame}>
          {services.map((service, index) => (
            <Image
              key={service.slug}
              src={service.image.src}
              alt=""
              fill
              sizes="(min-width: 64rem) 66vw, 1px"
              className={styles.stageImage}
              data-active={active === index || undefined}
            />
          ))}
        </div>
        <p className={styles.stageCaption}>
          <span>{services[active].name}</span>
          <span className="num">montaż od {formatPrice(services[active].prices[0].from)}</span>
        </p>
      </div>
    </div>
  );
}

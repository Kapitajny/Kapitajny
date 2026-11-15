"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { formatPrice, formatPriceItem, type PhotoPoint, type Service } from "@/data/services";
import { ChevronIcon } from "./Icons";
import styles from "./ServiceIndex.module.css";

// Ramka sceny ma proporcje 3:2. Zdjęcie o innych proporcjach jest kadrowane (object-fit: cover, środek),
// więc położenia punktów przeliczamy tak samo, jak przeglądarka przycina obraz.
const FRAME_RATIO = 3 / 2;

function pointInFrame(point: PhotoPoint, image: Service["image"]) {
  const ratio = image.width / image.height;
  if (ratio > FRAME_RATIO) return { x: 0.5 + (point.x - 0.5) * (ratio / FRAME_RATIO), y: point.y };
  return { x: point.x, y: 0.5 + (point.y - 0.5) * (FRAME_RATIO / ratio) };
}

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
                <dt>
                  {service.prices[0].label}
                  {service.prices[0].note ? <span className={styles.priceNote}>{service.prices[0].note}</span> : null}
                </dt>
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
              sizes="(min-width: 64rem) 42vw, 1px"
              className={styles.stageImage}
              data-active={active === index || undefined}
            />
          ))}
          {/* Oznaczenia aktywnego zdjęcia – ten sam język co w hero i na stronie usług. */}
          <ol key={services[active].slug} className={styles.stageMarkers}>
            {services[active].points.map((point, index) => {
              const at = pointInFrame(point, services[active].image);
              return (
                <li key={point.title} style={{ "--x": at.x, "--y": at.y, "--i": index } as CSSProperties}>
                  <span className="num">{index + 1}</span>
                </li>
              );
            })}
          </ol>
        </div>
        <div className={styles.stageCaption}>
          <p className={styles.stageTitle}>
            <span>{services[active].name}</span>
            <span className="num">
              {services[active].prices[0].label.toLowerCase()} {formatPriceItem(services[active].prices[0])}
            </span>
          </p>
          <ol className={styles.stageLegend}>
            {services[active].points.map((point, index) => (
              <li key={point.title}>
                <span className="num">{index + 1}</span>
                {point.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

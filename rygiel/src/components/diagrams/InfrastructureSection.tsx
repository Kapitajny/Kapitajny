"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { infrastructureLayers, services, type ServiceSlug } from "@/content/services";
import styles from "./InfrastructureSection.module.css";

/**
 * Przekrój infrastruktury firmy: cztery warstwy jako rygle między słupkami ramy.
 * Przełącznik filarów pokazuje, za które warstwy odpowiada dana usługa – linia wymiarowa obejmuje jej zakres.
 */
export function InfrastructureSection({ initial = "cyberbezpieczenstwo" }: { initial?: ServiceSlug }) {
  const [activeSlug, setActiveSlug] = useState<ServiceSlug>(initial);
  const active = services.find((service) => service.slug === activeSlug) ?? services[0]!;
  const descriptionId = useId();

  const activeIndexes = infrastructureLayers.map((layer, index) => (active.layers[layer.id] ? index : -1)).filter((index) => index >= 0);
  const first = activeIndexes[0] ?? 0;
  const last = activeIndexes[activeIndexes.length - 1] ?? 0;

  return (
    <figure className={styles.figure} aria-labelledby={`${descriptionId}-caption`}>
      <div className={styles.controls} role="group" aria-label="Pokaż zakres usługi na przekroju">
        {services.map((service) => (
          <button
            key={service.slug}
            type="button"
            className={styles.toggle}
            aria-pressed={service.slug === activeSlug}
            aria-describedby={service.slug === activeSlug ? descriptionId : undefined}
            onClick={() => setActiveSlug(service.slug)}
          >
            {service.name}
          </button>
        ))}
      </div>

      <div className={styles.sheet}>
        <div className={styles.ruler} aria-hidden="true" />
        <div
          className={styles.frame}
          style={{ "--span-start": first, "--span-end": last + 1 } as React.CSSProperties}
          data-pillar={active.slug}
        >
          <ol role="list" className={styles.layers}>
            {infrastructureLayers.map((layer, index) => {
              const note = active.layers[layer.id];
              return (
                <li key={layer.id} className={styles.layer} data-active={note ? "" : undefined} style={{ "--i": index } as React.CSSProperties}>
                  <div className={styles.beam}>
                    <span className={styles.layerName}>{layer.name}</span>
                    <span className={styles.layerDetail}>{layer.detail}</span>
                  </div>
                  <p className={styles.note}>
                    {note ? (
                      <>
                        <span className="visually-hidden">{active.name} obejmuje: </span>
                        {note}
                      </>
                    ) : (
                      <span className={styles.noteEmpty}>
                        <span className="visually-hidden">Poza zakresem usługi {active.name}</span>
                      </span>
                    )}
                  </p>
                </li>
              );
            })}
          </ol>
          <div className={styles.dimension} aria-hidden="true">
            <span className={styles.dimensionLabel}>{active.name}</span>
          </div>
        </div>
      </div>

      <figcaption id={`${descriptionId}-caption`} className={styles.caption}>
        <span className={styles.captionTitle}>Rys. 1. Przekrój infrastruktury firmy i zakres usługi</span>
        <span id={descriptionId} className={styles.captionText} aria-live="polite">
          {active.summary}{" "}
          <Link href={active.href} className="text-link">
            Szczegóły: {active.name}
          </Link>
        </span>
      </figcaption>
    </figure>
  );
}

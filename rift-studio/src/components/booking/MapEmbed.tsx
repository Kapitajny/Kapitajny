"use client";

import { useState, useSyncExternalStore } from "react";
import { site } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { PinIcon } from "@/components/ui/Icons";
import styles from "./Contact.module.css";

const STORAGE_KEY = "rift-map-consent";

function readConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // brak dostępu do pamięci przeglądarki – zgoda tylko na tę wizytę
  }
}
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

/** Mapa OpenStreetMap ładowana dopiero po zgodzie (zewnętrzny serwis otrzymuje adres IP). */
export function MapEmbed({ t }: { t: Dictionary["contact"] }) {
  const stored = useSyncExternalStore(subscribe, readConsent, () => false);
  const [clicked, setClicked] = useState(false);
  const allowed = stored || clicked;
  const { lat, lng } = site.address.geo;
  const d = 0.008;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d * 1.6},${lat - d},${lng + d * 1.6},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
  const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  const allow = () => {
    setClicked(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // zgoda obowiązuje tylko do końca wizyty
    }
  };

  return (
    <div className={styles.map}>
      {allowed ? (
        <iframe title={t.mapTitle} src={src} loading="lazy" referrerPolicy="no-referrer" className={styles.mapFrame} />
      ) : (
        <div className={styles.mapPlaceholder}>
          <svg className={styles.mapArt} viewBox="0 0 400 220" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
            <path d="M-10 150 C 80 120, 140 170, 220 130 S 360 90, 420 110" className={styles.mapRoad} />
            <path d="M120 -10 L 170 240" className={styles.mapRoadThin} />
            <path d="M-10 60 L 420 90" className={styles.mapRoadThin} />
            <path d="M260 -10 C 250 60, 300 140, 280 240" className={styles.mapRoadThin} />
            <path d="M0 200 L 400 175" className={styles.mapRail} />
          </svg>
          <span className={styles.mapPin} aria-hidden="true">
            <PinIcon size={22} />
          </span>
          <div className={styles.mapCopy}>
            <p>{t.mapConsent}</p>
            <div className={styles.mapActions}>
              <button type="button" className="btn btn-small" onClick={allow}>
                {t.mapLoad}
              </button>
              <a href={link} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                {t.mapOpen}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

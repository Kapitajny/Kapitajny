import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { RiftHeadline } from "@/components/hero/RiftHeadline";
import { NextSlot } from "@/components/hero/NextSlot";
import heroImage from "../../../public/images/hero-booth.jpg";
import styles from "./Hero.module.css";

/** SEKCJA 1 – FUTURISTIC AUDIO */
export function Hero({ lang, t }: { lang: Locale; t: Dictionary["hero"] }) {
  return (
    <section id="start" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Image src={heroImage} alt={t.imageAlt} fill priority sizes="100vw" quality={80} placeholder="blur" className={styles.image} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div id="hero-title">
          <RiftHeadline top={t.titleTop} bottom={t.titleBottom} />
        </div>

        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={styles.lead}>{t.lead}</p>
            <div className={styles.ctas}>
              <a href="#rezerwacja" className="btn btn-primary">
                {t.ctaBook}
              </a>
              <a href="#o-nas" className="btn">
                {t.ctaAbout}
              </a>
            </div>
          </div>
          <NextSlot lang={lang} t={t} />
        </div>
      </div>
    </section>
  );
}

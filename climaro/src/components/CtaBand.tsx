import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { PhoneIcon } from "./Icons";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  title?: string;
  text?: string;
};

/** Zamknięcie strony: zdjęcie elewacji po zmroku, duży nagłówek i dwie drogi kontaktu. */
export function CtaBand({
  title = "Opisz, czego potrzebujesz",
  text = "Odpowiemy z wstępną wyceną i propozycją terminu wizji lokalnej. Wycena jest bezpłatna i do niczego nie zobowiązuje.",
}: CtaBandProps) {
  return (
    <section className={`theme-dark ${styles.band}`} aria-labelledby="cta-tytul">
      <Image src="/images/elewacja-noc.jpg" alt="" fill sizes="100vw" className={styles.photo} />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div>
          <h2 id="cta-tytul" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
        </div>
        <div className={styles.actions}>
          <Link href="/kontakt" className="btn btn-primary">
            Bezpłatna wycena
          </Link>
          <a href={site.phoneHref} className="btn btn-secondary">
            <PhoneIcon />
            <span className="num">{site.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

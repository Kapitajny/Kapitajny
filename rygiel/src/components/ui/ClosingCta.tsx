import Image from "next/image";
import { typeset } from "@/lib/typography";
import { illustrations } from "./illustrations";
import { LinkButton } from "./LinkButton";
import styles from "./ClosingCta.module.css";

type ClosingCtaProps = {
  title?: string;
  text?: string;
  secondary?: { href: string; label: string };
  headingId?: string;
};

export function ClosingCta({
  title = "Porozmawiajmy o IT w Twojej firmie",
  text = "Podczas pierwszej rozmowy ustalimy, od czego zacząć. Jeśli nie będziemy właściwym partnerem, powiemy o tym od razu.",
  secondary = { href: "/baza-wiedzy", label: "Najpierw poczytaj w bazie wiedzy" },
  headingId = "cta-title",
}: ClosingCtaProps) {
  return (
    <section className={`band-navy ${styles.section}`} aria-labelledby={headingId}>
      {/* Tło dekoracyjne, przyciemnione tak, by tekst zachował kontrast */}
      <Image src={illustrations["miasto-danych"].src} alt="" fill sizes="100vw" placeholder="blur" className={styles.backdrop} />
      <div className={`container ${styles.inner}`}>
        <h2 id={headingId} className={styles.title}>
          {typeset(title)}
        </h2>
        <div className={styles.side}>
          <p className={styles.text}>{typeset(text)}</p>
          <div className={styles.actions}>
            <LinkButton href="/kontakt" size="large" withArrow>
              Umów konsultację
            </LinkButton>
            <LinkButton href={secondary.href} variant="secondary" size="large">
              {secondary.label}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

import { LinkButton } from "@/components/ui/LinkButton";
import { NetworkIllustration } from "@/components/ui/NetworkIllustration";
import { typeset, typesetHeading } from "@/lib/typography";
import styles from "./Hero.module.css";

const highlights = [
  "Stała administracja komputerów, serwerów i kont",
  "Audyty i testy bezpieczeństwa za pisemną zgodą",
  "Kopie zapasowe sprawdzane testem odtworzenia",
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            {typesetHeading("Obsługa IT i cyberbezpieczeństwo dla małych i średnich firm")}
          </h1>
          <p className={`lede ${styles.lede}`}>
            {typeset(
              "Administrujemy infrastrukturą, zabezpieczamy dane i pomagamy pracownikom na co dzień. Pracujemy z biurami, firmami usługowymi i sklepami internetowymi, które przetwarzają dane klientów.",
            )}
          </p>
          <div className={styles.actions}>
            <LinkButton href="/kontakt" size="large">
              Umów konsultację
            </LinkButton>
            <LinkButton href="/uslugi" variant="secondary" size="large">
              Zakres usług
            </LinkButton>
          </div>
          <ul role="list" className={styles.highlights}>
            {highlights.map((item) => (
              <li key={item}>{typeset(item)}</li>
            ))}
          </ul>
        </div>
        <div className={styles.media}>
          <NetworkIllustration priority sizes="(max-width: 60rem) 100vw, 640px" />
        </div>
      </div>
    </section>
  );
}

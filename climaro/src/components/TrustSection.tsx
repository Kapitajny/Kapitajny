import { CertificateIcon, DocumentIcon, ShieldIcon, WrenchIcon } from "./Icons";
import styles from "./TrustSection.module.css";

const items = [
  {
    Icon: CertificateIcon,
    title: "Certyfikaty F-gazowe",
    text: "Instalatorzy i firma mają certyfikaty wymagane do pracy z czynnikami chłodniczymi.",
  },
  {
    Icon: ShieldIcon,
    title: "Ubezpieczenie OC",
    text: "Działalność jest objęta ubezpieczeniem odpowiedzialności cywilnej.",
  },
  {
    Icon: DocumentIcon,
    title: "Protokół z pomiarami",
    text: "Po uruchomieniu i każdym przeglądzie dostajesz protokół z wynikami pomiarów.",
  },
  {
    Icon: WrenchIcon,
    title: "Gwarancja producenta",
    text: "Montujemy zgodnie z instrukcją producenta, dzięki czemu gwarancja urządzenia pozostaje ważna.",
  },
];

/** Sekcja zaufania: sprawdzalne fakty o uprawnieniach i standardzie pracy. */
export function TrustSection({ theme = "theme-white" }: { theme?: "theme-light" | "theme-white" }) {
  return (
    <section className={`${theme} section`} aria-labelledby="zaufanie-tytul">
      <div className="container">
        <div className="section-head">
          <h2 id="zaufanie-tytul" className="h-section">
            Bezpieczeństwo i jakość
          </h2>
          <p className="lead">Pracujemy według wymagań producentów i przepisów. Każdy z tych punktów możesz sprawdzić przed podpisaniem umowy.</p>
        </div>
        <ul className={styles.items}>
          {items.map(({ Icon, title, text }) => (
            <li key={title}>
              <Icon className={styles.icon} />
              <h3 className="h-card">{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

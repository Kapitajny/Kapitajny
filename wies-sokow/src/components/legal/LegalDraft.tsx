import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { site } from "@/data/site";
import styles from "@/app/pages.module.css";

type Props = {
  title: string;
  href: string;
  /** Konspekt: tytuł paragrafu i opis tego, co powinien zawierać. */
  outline: { title: string; scope: string }[];
};

/**
 * Miejsce na dokument prawny. Celowo nie zawiera gotowych postanowień:
 * pokazuje strukturę, którą wypełnia prawnik lub właściciel sklepu.
 */
export function LegalDraft({ title, href, outline }: Props) {
  return (
    <>
      <PageHeader title={title} compact />
      <section className={styles.legal} aria-label={title}>
        <div className={`container ${styles.legalBody}`}>
          <p className="notice">
            <strong>Miejsce na treść dokumentu.</strong> Ta strona pokazuje wyłącznie planowaną strukturę. Nie jest
            gotowym ani prawnie zweryfikowanym dokumentem i nie stanowi podstawy żadnej umowy. Przed uruchomieniem
            sklepu treść powinien przygotować lub sprawdzić prawnik.
          </p>

          <ol className={styles.legalList}>
            {outline.map((item) => (
              <li key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.scope}</p>
                <span className={styles.placeholder}>Treść do uzupełnienia</span>
              </li>
            ))}
          </ol>

          <nav className={styles.legalLinks} aria-label="Pozostałe dokumenty">
            {site.legal
              .filter((item) => item.href !== href)
              .map((item) => (
                <Link key={item.href} href={item.href} className="text-link">
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      </section>
    </>
  );
}

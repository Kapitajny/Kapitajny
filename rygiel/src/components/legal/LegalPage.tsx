import { PageHeader } from "@/components/ui/PageHeader";
import proseStyles from "@/components/knowledge/ArticleBody.module.css";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  title: string;
  path: string;
  lede: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalPage({ title, path, lede, updated, children }: LegalPageProps) {
  return (
    <>
      <PageHeader breadcrumbs={[{ href: path, label: title }]} title={title} lede={lede}>
        <p className={styles.meta}>
          Wersja robocza z dnia <time dateTime={updated}>{new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date(updated))}</time>
        </p>
      </PageHeader>
      <div className={`container ${styles.layout}`}>
        <aside className={styles.warning} aria-label="Status dokumentu">
          <p className={styles.warningTitle}>Dokument wymaga uzupełnienia i weryfikacji prawnej</p>
          <p>
            To treść robocza przygotowana dla serwisu demonstracyjnego. Miejsca oznaczone jako „do uzupełnienia” trzeba wypełnić prawdziwymi danymi, a
            całość – przed publikacją – sprawdzić z prawnikiem.
          </p>
        </aside>
        <div className={`${proseStyles.prose} ${styles.document}`}>{children}</div>
      </div>
    </>
  );
}

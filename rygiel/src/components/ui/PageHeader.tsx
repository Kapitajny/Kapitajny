import { typeset, typesetHeading } from "@/lib/typography";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  lede?: string;
  breadcrumbs: Crumb[];
  kicker?: string;
  /** Element po prawej stronie nagłówka (np. tabliczka rysunkowa, CTA) */
  aside?: React.ReactNode;
  children?: React.ReactNode;
  size?: "default" | "large";
};

export function PageHeader({ title, lede, breadcrumbs, kicker, aside, children, size = "default" }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className="container">
        <Breadcrumbs items={breadcrumbs} />
        <div className={`${styles.grid} ${aside ? styles.withAside : ""}`}>
          <div className={styles.main}>
            {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
            <h1 className={`display ${styles.title} ${size === "large" ? styles.large : ""}`}>{typesetHeading(title)}</h1>
            {lede ? <p className={`lede ${styles.lede}`}>{typeset(lede)}</p> : null}
            {children}
          </div>
          {aside ? <div className={styles.aside}>{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}

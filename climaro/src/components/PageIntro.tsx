import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

type PageIntroProps = {
  title: string;
  lead: ReactNode;
  children?: ReactNode;
};

/** Nagłówek podstrony: duży tytuł, wprowadzenie i opcjonalna treść pod spodem (np. nawigacja kotwicowa). */
export function PageIntro({ title, lead, children }: PageIntroProps) {
  return (
    <section className={`theme-dark ${styles.intro}`}>
      <div className="container">
        <h1 className={styles.title}>{title}</h1>
        <p className={`lead ${styles.lead}`}>{lead}</p>
        {children}
      </div>
    </section>
  );
}

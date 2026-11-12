import styles from "./PageHeader.module.css";

type Props = {
  title: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  /** Wąski wariant dla podstron formularzowych i dokumentów. */
  compact?: boolean;
};

export function PageHeader({ title, lead, children, compact = false }: Props) {
  return (
    <header className={`${styles.header} ${compact ? styles.compact : ""}`}>
      <div className={`container ${styles.inner}`}>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}

import styles from "./TitleBlock.module.css";

export type TitleBlockRow = { label: string; value: React.ReactNode; wide?: boolean };

/** Tabliczka rysunkowa – metryczka projektu w formie znanej z dokumentacji technicznej. */
export function TitleBlock({ rows, tone = "graphite", label }: { rows: TitleBlockRow[]; tone?: "graphite" | "cobalt"; label?: string }) {
  return (
    <dl className={`${styles.block} ${tone === "cobalt" ? styles.cobalt : ""}`} aria-label={label}>
      {rows.map((row) => (
        <div key={row.label} className={`${styles.cell} ${row.wide ? styles.wide : ""}`}>
          <dt className={styles.label}>{row.label}</dt>
          <dd className={styles.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

import styles from "./Pending.module.css";

/** Wyraźny znacznik danych, które trzeba uzupełnić i zweryfikować przed publikacją. */
export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <mark className={styles.pending}>
      <span className="visually-hidden">Do uzupełnienia: </span>
      <span aria-hidden="true">[do uzupełnienia: </span>
      {children}
      <span aria-hidden="true">]</span>
    </mark>
  );
}

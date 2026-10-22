import { acceptanceProtocol } from "@/content/approach";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./AcceptanceProtocol.module.css";
import { typeset } from "@/lib/typography";

export function AcceptanceProtocol() {
  return (
    <section className={styles.section} aria-labelledby="rezultaty-title">
      <div className="container">
        <SectionHeading
          id="rezultaty-title"
          title="Efekty pierwszych tygodni współpracy"
          intro={
            <p>
              {typeset(
                "Każdy z tych efektów możesz sprawdzić samodzielnie. W drugiej kolumnie opisujemy, jak to zrobić.",
              )}
            </p>
          }
        />
        <table className={styles.table}>
          <caption className="visually-hidden">Rezultaty współpracy i&nbsp;sposób ich sprawdzenia</caption>
          <thead>
            <tr>
              <th scope="col">Rezultat</th>
              <th scope="col">Jak to sprawdzisz</th>
            </tr>
          </thead>
          <tbody>
            {acceptanceProtocol.map((row) => (
              <tr key={row.result}>
                <th scope="row">
                  <span className={styles.check} aria-hidden="true" />
                  {row.result}
                </th>
                <td>{row.check}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

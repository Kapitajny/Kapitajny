import { processSteps } from "@/data/process";
import styles from "./HowWeWork.module.css";

type HowWeWorkProps = {
  theme?: "theme-light" | "theme-white";
  title?: string;
  lead?: string;
};

/** „Jak pracujemy” – cztery etapy współpracy, opisane zwykłym tekstem. */
export function HowWeWork({
  theme = "theme-light",
  title = "Jak pracujemy",
  lead = "Od pierwszego zapytania do uruchomienia instalacji – cztery etapy, w których zawsze wiesz, co się dzieje i ile to kosztuje.",
}: HowWeWorkProps) {
  return (
    <section className={`${theme} section`} aria-labelledby="proces-tytul">
      <div className="container">
        <div className="section-head">
          <h2 id="proces-tytul" className="h-section">
            {title}
          </h2>
          <p className="lead">{lead}</p>
        </div>
        <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className={`num ${styles.no}`}>Etap {index + 1}</span>
              <h3 className="h-card">{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

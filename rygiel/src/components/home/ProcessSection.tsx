import { processSteps } from "@/content/approach";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ProcessSection.module.css";

export function ProcessSection({ headingId = "proces-title" }: { headingId?: string }) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className="container">
        <SectionHeading
          id={headingId}
          title="Jak zaczynamy współpracę"
          intro={<p>Pięć etapów, a&nbsp;po każdym dostajesz coś, co zostaje w&nbsp;firmie – nawet jeśli na nim skończymy.</p>}
        />
        <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.marker} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
              <p className={styles.deliverable}>
                <span className={styles.deliverableLabel}>Dostajesz:</span> {step.deliverable}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

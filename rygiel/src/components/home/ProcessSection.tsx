import { processSteps } from "@/content/approach";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ProcessSection.module.css";

export function ProcessSection({ headingId = "proces-title" }: { headingId?: string }) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className="container">
        <SectionHeading
          id={headingId}
          title="Jak wygląda współpraca"
          intro={<p>Po każdym etapie dostajesz dokument, który zostaje w&nbsp;firmie – także wtedy, gdy na tym etapie zakończymy współpracę.</p>}
        />
        <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.marker} aria-hidden="true">
                {index + 1}
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

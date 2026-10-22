import { processSteps } from "@/content/approach";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ProcessSection.module.css";

const stepIcons: IconName[] = ["chat", "search", "clipboard", "tool", "refresh"];

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
              <div className={styles.stepHead}>
                <span className={styles.icon}>
                  <Icon name={stepIcons[index] ?? "check"} size={22} />
                </span>
                <span className={styles.number}>Krok {index + 1}</span>
              </div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
              <p className={styles.deliverable}>
                <Icon name="document" size={16} className={styles.deliverableIcon} />
                <span>
                  <span className="visually-hidden">Dostajesz: </span>
                  {step.deliverable}
                </span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

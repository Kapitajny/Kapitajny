import type { ServicePillar } from "@/content/services";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./ServiceBlocks.module.css";

export function ProblemList({ items }: { items: string[] }) {
  return (
    <ul role="list" className={styles.problems}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ScopeList({ items, columns = 2 }: { items: ServicePillar["scope"]; columns?: 1 | 2 }) {
  return (
    <dl className={`${styles.scope} ${columns === 1 ? styles.scopeSingle : ""}`}>
      {items.map((item) => (
        <div key={item.title} className={styles.scopeItem}>
          <dt>{item.title}</dt>
          <dd>{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BenefitList({ items }: { items: string[] }) {
  return (
    <ul role="list" className={styles.benefits}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function DeliverySteps({ items }: { items: ServicePillar["delivery"] }) {
  return (
    <ol className={styles.steps}>
      {items.map((step, index) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.stepNumber} aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <p className={styles.stepTitle}>{step.title}</p>
            <p className={styles.stepText}>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ServiceCta({ service, text }: { service: ServicePillar; text?: string }) {
  return (
    <div className={styles.cta}>
      <p className={styles.ctaText}>
        {text ?? "Opisz krótko sytuację w formularzu. Odpowiemy z propozycją pierwszego kroku i informacją, czego potrzebujemy od Ciebie."}
      </p>
      <LinkButton href={`/kontakt?usluga=${service.slug}`} withArrow>
        Zapytaj o usługę: {service.name}
      </LinkButton>
    </div>
  );
}

import { generalFaq } from "@/content/approach";
import { Accordion } from "@/components/ui/Accordion";
import styles from "./HomeFaq.module.css";

export function HomeFaq() {
  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <h2 id="faq-title" className={styles.title}>
            Częste pytania
          </h2>
          <p className={styles.intro}>Pytania o konkretne usługi znajdziesz na ich stronach.</p>
        </div>
        <div className={styles.list}>
          <Accordion items={generalFaq} />
        </div>
      </div>
    </section>
  );
}

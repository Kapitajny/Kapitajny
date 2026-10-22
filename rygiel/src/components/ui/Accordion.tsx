"use client";

import { useId, useState } from "react";
import styles from "./Accordion.module.css";

type AccordionItem = { question: string; answer: string };

/**
 * Dostępny akordeon (wzorzec WAI-ARIA): przycisk w nagłówku, aria-expanded i aria-controls.
 * Zwinięta treść zostaje w DOM (widoczna dla wyszukiwarek), ale jest ukryta przed fokusem i czytnikami.
 */
export function Accordion({ items, headingLevel = 3 }: { items: AccordionItem[]; headingLevel?: 2 | 3 | 4 }) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set());
  const Heading = `h${headingLevel}` as const;

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <div key={item.question} className={styles.item} data-open={isOpen || undefined}>
            <Heading className={styles.heading}>
              <button id={buttonId} type="button" className={styles.trigger} aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(index)}>
                <span className={styles.question}>{item.question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </Heading>
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel}>
              <div className={styles.panelInner}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

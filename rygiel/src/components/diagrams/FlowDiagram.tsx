import { Fragment } from "react";
import type { FlowDiagram as FlowDiagramData } from "@/content/cases";
import styles from "./FlowDiagram.module.css";

/** Schemat przepływu w języku rysunku technicznego. Tekst pozostaje tekstem – czytelny na każdym ekranie i dla czytników. */
export function FlowDiagram({ diagram, figureNumber }: { diagram: FlowDiagramData; figureNumber?: number }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.canvas}>
        {diagram.columns.map((column, index) => (
          <Fragment key={column.label}>
            <div className={styles.column}>
              <p className={styles.columnLabel}>{column.label}</p>
              <ul role="list" className={styles.nodes}>
                {column.nodes.map((node) => (
                  <li key={node.name} className={styles.node} data-emphasis={node.emphasis ? "" : undefined}>
                    <span className={styles.nodeName}>{node.name}</span>
                    {node.detail ? <span className={styles.nodeDetail}>{node.detail}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
            {index < diagram.links.length ? (
              <div className={styles.link}>
                <span className={styles.linkLine} aria-hidden="true" />
                <span className={styles.linkLabel}>
                  <span className="visually-hidden">Przejście: </span>
                  {diagram.links[index]}
                </span>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionTitle}>
          {figureNumber ? `Rys. ${figureNumber}. ` : null}
          {diagram.title}
        </span>
        <span className={styles.captionText}>{diagram.description}</span>
      </figcaption>
    </figure>
  );
}

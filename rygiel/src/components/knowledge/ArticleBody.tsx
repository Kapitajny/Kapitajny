import type { ArticleBlock } from "@/content/articles";
import { Inline } from "@/components/ui/Inline";
import { typeset } from "@/lib/typography";
import styles from "./ArticleBody.module.css";

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "p":
            return (
              <p key={index}>
                <Inline text={block.text} />
              </p>
            );
          case "h3":
            return <h3 key={index}>{typeset(block.text)}</h3>;
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index}>
                {block.items.map((item) => (
                  <li key={item}>
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <aside key={index} className={styles.callout} aria-label={block.title}>
                <p className={styles.calloutTitle}>{typeset(block.title)}</p>
                <p>
                  <Inline text={block.text} />
                </p>
              </aside>
            );
          case "code":
            return (
              <figure key={index} className={styles.code}>
                <figcaption>{typeset(block.label)}</figcaption>
                <pre tabIndex={0}>
                  <code>{block.code}</code>
                </pre>
              </figure>
            );
          case "table":
            return (
              <div key={index} className={styles.tableWrap}>
                <table>
                  <caption>{typeset(block.caption)}</caption>
                  <thead>
                    <tr>
                      {block.head.map((cell) => (
                        <th key={cell} scope="col">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell, cellIndex) =>
                          cellIndex === 0 ? (
                            <th key={cellIndex} scope="row">
                              {typeset(cell)}
                            </th>
                          ) : (
                            <td key={cellIndex} data-label={block.head[cellIndex]}>
                              {typeset(cell)}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

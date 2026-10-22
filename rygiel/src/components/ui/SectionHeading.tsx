import styles from "./SectionHeading.module.css";

type SectionHeadingProps = {
  id: string;
  title: string;
  intro?: React.ReactNode;
  /** split: nagłówek i wstęp obok siebie; stacked: jeden pod drugim */
  layout?: "split" | "stacked";
  as?: "h2" | "h3";
};

export function SectionHeading({ id, title, intro, layout = "stacked", as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${layout === "split" ? styles.split : ""}`}>
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {intro ? <div className={styles.intro}>{intro}</div> : null}
    </div>
  );
}

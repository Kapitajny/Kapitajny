import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

type PageIntroProps = {
  title: string;
  lead: ReactNode;
  children?: ReactNode;
  /** Opcjonalne zdjęcie w tle – wtedy nagłówek staje się pasem fotograficznym. */
  image?: { src: string; alt: string };
};

/** Nagłówek podstrony: duży tytuł, wprowadzenie i opcjonalna treść pod spodem (np. nawigacja kotwicowa). */
export function PageIntro({ title, lead, children, image }: PageIntroProps) {
  return (
    <section className={`theme-dark ${styles.intro}`} data-photo={image ? true : undefined}>
      {image ? (
        <>
          <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className={styles.photo} />
          <div className={styles.scrim} aria-hidden="true" />
        </>
      ) : null}
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>{title}</h1>
        <p className={`lead ${styles.lead}`}>{lead}</p>
        {children}
      </div>
    </section>
  );
}

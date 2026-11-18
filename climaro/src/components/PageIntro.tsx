import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

type PageIntroProps = {
  title: string;
  lead: ReactNode;
  children?: ReactNode;
  /** Opcjonalne zdjęcie – wyświetlane obok tekstu (na telefonach pod nim). */
  image?: { src: string; alt: string };
};

/** Nagłówek podstrony: tytuł strony, wprowadzenie i opcjonalnie zdjęcie lub nawigacja kotwicowa. */
export function PageIntro({ title, lead, children, image }: PageIntroProps) {
  return (
    <section className={`theme-light ${styles.intro}`}>
      <div className={`container ${styles.grid}`} data-photo={image ? true : undefined}>
        <div className={styles.text}>
          <h1 className="h-page">{title}</h1>
          <p className="lead">{lead}</p>
          {children}
        </div>
        {image ? (
          <div className={styles.photo}>
            <Image src={image.src} alt={image.alt} fill preload sizes="(min-width: 64rem) 45vw, 100vw" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

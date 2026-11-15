import Image from "next/image";
import type { CSSProperties } from "react";
import type { PhotoPoint } from "@/data/services";
import styles from "./AnnotatedPhoto.module.css";

type AnnotatedPhotoProps = {
  image: { src: string; alt: string; width: number; height: number };
  points: PhotoPoint[];
  sizes: string;
  eager?: boolean;
};

/**
 * Zdjęcie z numerowanymi oznaczeniami jak na rysunku technicznym i legendą pod spodem.
 * Ramka zachowuje proporcje pliku, więc położenia punktów (ułamki) trafiają zawsze w to samo miejsce.
 */
export function AnnotatedPhoto({ image, points, sizes, eager }: AnnotatedPhotoProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"} className={styles.photo} />
        <ol className={styles.markers} aria-hidden="true">
          {points.map((point, index) => (
            <li key={point.title} className={styles.marker} style={{ "--x": point.x, "--y": point.y } as CSSProperties}>
              <span className="num">{index + 1}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        <ol className={styles.legend}>
          {points.map((point, index) => (
            <li key={point.title}>
              <span className={`num ${styles.legendNo}`} aria-hidden="true">
                {index + 1}
              </span>
              <span>
                <strong>{point.title}</strong> {point.text}
              </span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

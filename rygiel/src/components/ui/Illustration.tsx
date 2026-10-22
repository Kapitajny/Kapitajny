import Image from "next/image";
import { typeset } from "@/lib/typography";
import { illustrations, type IllustrationName } from "./illustrations";
import styles from "./Illustration.module.css";

type IllustrationProps = {
  image?: IllustrationName;
  caption?: string;
  /** Szerokość wyświetlania – grafiki mają około 600 px, więc nie powiększamy ich ponad naturalny rozmiar. */
  sizes?: string;
  priority?: boolean;
};

export function Illustration({ image = "ochrona-sieci", caption, sizes = "(max-width: 64rem) 100vw, 440px", priority = false }: IllustrationProps) {
  const { src, alt } = illustrations[image];
  return (
    <figure className={styles.figure}>
      <Image src={src} alt={alt} sizes={sizes} placeholder="blur" priority={priority} className={styles.image} />
      {caption ? <figcaption className={styles.caption}>{typeset(caption)}</figcaption> : null}
    </figure>
  );
}

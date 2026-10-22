import Image from "next/image";
import networkImage from "@/assets/ochrona-sieci.jpg";
import { typeset } from "@/lib/typography";
import styles from "./NetworkIllustration.module.css";

type NetworkIllustrationProps = {
  caption?: string;
  /** Szerokość wyświetlania – obraz ma 662 px, więc nie powiększamy go ponad naturalny rozmiar. */
  sizes?: string;
  priority?: boolean;
};

export function NetworkIllustration({ caption, sizes = "(max-width: 64rem) 100vw, 440px", priority = false }: NetworkIllustrationProps) {
  return (
    <figure className={styles.figure}>
      <Image
        src={networkImage}
        alt="Nocna panorama miasta pokryta siecią połączeń, na której węzłach widać symbole kłódek i ostrzeżeń – ilustracja ochrony infrastruktury IT."
        sizes={sizes}
        placeholder="blur"
        priority={priority}
        className={styles.image}
      />
      {caption ? <figcaption className={styles.caption}>{typeset(caption)}</figcaption> : null}
    </figure>
  );
}

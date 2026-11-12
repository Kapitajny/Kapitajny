import Image from "next/image";
import Link from "next/link";
import aleja from "@/assets/photos/historia-aleja-sadu.jpg";
import styles from "./home.module.css";

export function Story() {
  return (
    <section className={styles.story} aria-labelledby="historia-tytul">
      <div className={styles.storyPhoto}>
        <Image
          src={aleja}
          alt="Dwie osoby z koszykiem idą trawiastą aleją między rzędami jabłoni"
          fill
          sizes="100vw"
          placeholder="blur"
        />
      </div>
      <div className="container">
        <div className={styles.storyCard}>
          <h2 id="historia-tytul">Poznaj naszą historię</h2>
          <div className="prose">
            <p>
              Wieś Soków zaczęła się od prostego pomysłu: tłoczyć sok tam, gdzie rosną owoce. Zamiast wozić jabłka
              daleko, postawiliśmy prasę blisko sadu.
            </p>
            <p>
              Dziś przetwarzamy jabłka i gruszki na soki, które sami pijemy przy śniadaniu. Robimy to po swojemu:
              uważnie, w niedużych partiach i z szacunkiem do owocu.
            </p>
          </div>
          <Link href="/o-nas" className="text-link">
            Więcej o naszej firmie
          </Link>
        </div>
      </div>
    </section>
  );
}

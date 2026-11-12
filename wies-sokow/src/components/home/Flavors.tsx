import Image from "next/image";
import Link from "next/link";
import gruszkiStol from "@/assets/photos/smak-gruszki-stol.jpg";
import jablka from "@/assets/photos/smak-jablka.jpg";
import { flavors } from "@/data/products";
import styles from "./home.module.css";

export function Flavors() {
  return (
    <section className={`section ${styles.flavors}`} aria-labelledby="smaki-tytul">
      <div className={`container ${styles.flavorsGrid}`}>
        <header className={styles.flavorsHead}>
          <h2 id="smaki-tytul">Odkryj nasze smaki</h2>
          <p className="lead">
            Zacznij od ulubionego owocu albo spróbuj połączenia. Każdy smak kupisz w opakowaniu 3 lub 5 litrów.
          </p>
        </header>

        <article className={`${styles.flavor} ${styles.flavorApple}`}>
          <Link href="/sklep?smak=jablko" className={styles.flavorMedia}>
            <Image
              src={jablka}
              alt="Czerwone jabłka wśród liści na drzewie"
              fill
              sizes="(min-width: 60rem) 38vw, 100vw"
              placeholder="blur"
            />
          </Link>
          <div className={styles.flavorText}>
            <h3>{flavors.jablko.label}</h3>
            <p>{flavors.jablko.short}</p>
            <Link href="/sklep?smak=jablko" className="text-link">
              Soki jabłkowe
            </Link>
          </div>
        </article>

        <article className={`${styles.flavor} ${styles.flavorPear}`}>
          <Link href="/sklep?smak=gruszka" className={styles.flavorMedia}>
            <Image
              src={gruszkiStol}
              alt="Trzy gruszki na stole, jedna przekrojona na pół"
              fill
              sizes="(min-width: 60rem) 28vw, 62vw"
              placeholder="blur"
            />
          </Link>
          <div className={styles.flavorText}>
            <h3>{flavors.gruszka.label}</h3>
            <p>{flavors.gruszka.short}</p>
            <Link href="/sklep?smak=gruszka" className="text-link">
              Soki gruszkowe
            </Link>
          </div>
        </article>

        <article className={`${styles.flavor} ${styles.flavorMix}`}>
          <Link href="/sklep?smak=jablko-gruszka" className={`${styles.flavorMedia} ${styles.flavorPack}`}>
            <Image src={flavors["jablko-gruszka"].image} alt={flavors["jablko-gruszka"].imageAlt} sizes="(min-width: 60rem) 20vw, 50vw" quality={90} />
          </Link>
          <div className={styles.flavorText}>
            <h3>{flavors["jablko-gruszka"].label}</h3>
            <p>{flavors["jablko-gruszka"].short}</p>
            <Link href="/sklep?smak=jablko-gruszka" className="text-link">
              Soki jabłkowo-gruszkowe
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

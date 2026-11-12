import Image from "next/image";
import jablkaGalaz from "@/assets/photos/jablka-galaz.jpg";
import styles from "./home.module.css";

const reasons = [
  {
    title: "Owoce, które znamy",
    text: "Wybieramy dojrzałe jabłka i gruszki i oglądamy każdą partię, zanim trafi do tłoczenia.",
  },
  {
    title: "Staranność na każdym etapie",
    text: "Myjemy, tłoczymy, pasteryzujemy i pakujemy w jednym miejscu, krótkimi seriami i bez pośpiechu.",
  },
  {
    title: "Smaki do wyboru",
    text: "Jabłko, gruszka albo oba naraz. Każdy sok smakuje inaczej, bo inaczej smakują owoce.",
  },
  {
    title: "Opakowanie z kranikiem",
    text: "Nalewasz tyle, ile potrzebujesz, a reszta zostaje szczelnie zamknięta. Do wyboru 3 lub 5 litrów.",
  },
  {
    title: "Kontakt bez pośredników",
    text: "Kupujesz u producenta. Na pytanie o sok, dostawę czy zamówienie odpowiada osoba, która zna odpowiedź.",
  },
];

export function Why() {
  return (
    <section className={`section ${styles.why}`} aria-labelledby="dlaczego-tytul">
      <div className={`container ${styles.whyGrid}`}>
        <div className={styles.whyIntro}>
          <h2 id="dlaczego-tytul">Dlaczego Wieś Soków?</h2>
          <figure className={styles.whyPhoto}>
            <Image src={jablkaGalaz} alt="Dojrzałe czerwone jabłka na gałęzi na tle nieba" sizes="(min-width: 60rem) 22rem, 60vw" placeholder="blur" />
          </figure>
        </div>
        <ul className={styles.whyList}>
          {reasons.map((reason) => (
            <li key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

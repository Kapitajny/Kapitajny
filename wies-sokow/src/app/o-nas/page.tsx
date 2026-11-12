import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import sadDrabina from "@/assets/photos/sad-drabina.jpg";
import sadKwitnacy from "@/assets/photos/sad-kwitnacy.jpg";
import sadRzad from "@/assets/photos/sad-rzad.jpg";
import gruszkiSiatka from "@/assets/photos/gruszki-siatka.jpg";
import { PageHeader } from "@/components/layout/PageHeader";
import styles from "../pages.module.css";

export const metadata: Metadata = {
  title: "O nas – producent i przetwórca soków",
  description:
    "Wieś Soków to producent soków tłoczonych z jabłek i gruszek. Poznaj nasze podejście do owoców, pracy i sprzedaży bez pośredników.",
  alternates: { canonical: "/o-nas" },
};

const principles = [
  {
    title: "Najpierw owoc",
    text: "Sok jest tak dobry, jak owoce, z których powstał. Dlatego najwięcej uwagi poświęcamy temu, co trafia do prasy.",
  },
  {
    title: "Krótka droga",
    text: "Tłoczymy blisko sadu, a gotowy sok sprzedajemy sami. Mniej etapów pośrednich to dla nas mniej kompromisów.",
  },
  {
    title: "Prosta rozmowa",
    text: "Lubimy wiedzieć, komu smakuje nasz sok. Na wiadomości odpowiadamy sami i po ludzku.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="O nas"
        lead="Jesteśmy producentem i przetwórcą soków. Zajmujemy się jednym: zamieniamy dojrzałe owoce w sok, który chce się pić codziennie."
      />

      <div className={styles.wide}>
        <Image
          src={sadKwitnacy}
          alt="Kwitnący sad: dwa rzędy drzew i trawiasta aleja z żółtymi mleczami"
          fill
          sizes="100vw"
          placeholder="blur"
          preload
        />
      </div>

      <section className={`section ${styles.about}`} aria-labelledby="skad-tytul">
        <div className={`container ${styles.aboutGrid}`}>
          <h2 id="skad-tytul">Od sadu do soku</h2>
          <div className="prose">
            <p>
              Wieś Soków zaczęła się od prostego pomysłu: tłoczyć sok tam, gdzie rosną owoce. Zamiast wozić jabłka
              daleko, postawiliśmy prasę blisko sadu i zaczęliśmy od kilku pierwszych partii dla rodziny i sąsiadów.
            </p>
            <p>
              Z czasem do jabłek dołączyły gruszki, a do butelek wygodne opakowania z kranikiem. Nie zmieniło się
              jedno: każdą partię próbujemy sami, zanim trafi do sprzedaży.
            </p>
            <p>
              Dziś przetwarzamy owoce na trzy soki: jabłkowy, gruszkowy i jabłkowo-gruszkowy. Sprzedajemy je
              bezpośrednio, bo chcemy wiedzieć, do kogo trafiają.
            </p>
          </div>
          <figure className={styles.aboutPhoto}>
            <Image
              src={sadDrabina}
              alt="Sad jabłoniowy z drabiną i drewnianymi beczkami pełnymi czerwonych jabłek"
              sizes="(min-width: 60rem) 34vw, 92vw"
              placeholder="blur"
            />
          </figure>
        </div>
      </section>

      <section className={`section ${styles.principles}`} aria-labelledby="zasady-tytul">
        <div className="container">
          <h2 id="zasady-tytul">Jak pracujemy</h2>
          <ul className={styles.principleList}>
            {principles.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section ${styles.duo}`} aria-labelledby="dalej-tytul">
        <div className={`container ${styles.duoGrid}`}>
          <figure className={styles.duoA}>
            <Image src={sadRzad} alt="Rząd jabłoni obsypanych czerwonymi jabłkami" sizes="(min-width: 60rem) 34vw, 60vw" placeholder="blur" />
          </figure>
          <figure className={styles.duoB}>
            <Image
              src={gruszkiSiatka}
              alt="Gruszki w siatce na zakupy i jedna gruszka obok"
              sizes="(min-width: 60rem) 22vw, 40vw"
              placeholder="blur"
            />
          </figure>
          <div className={styles.duoText}>
            <h2 id="dalej-tytul">Zobacz, jak powstaje sok</h2>
            <p className="lead">Od pielęgnacji drzew po opakowanie z kranikiem. Krok po kroku pokazujemy naszą pracę.</p>
            <div className={styles.actions}>
              <Link href="/produkcja" className="btn">
                Nasza produkcja
              </Link>
              <Link href="/sklep" className="btn btn--outline">
                Przejdź do sklepu
              </Link>
            </div>
            <p className="demo-note">
              <strong>Treść demonstracyjna.</strong> Wieś Soków jest firmą fikcyjną, a opisana historia jest
              przykładowa.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

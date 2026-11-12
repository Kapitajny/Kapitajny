import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import sok from "@/assets/photos/dom-kuchnia.jpg";
import ciagnik from "@/assets/photos/produkcja-ciagnik.jpg";
import kombajn from "@/assets/photos/produkcja-kombajn.jpg";
import pielegnacja from "@/assets/photos/produkcja-pielegnacja.jpg";
import skrzynki from "@/assets/photos/produkcja-skrzynki.jpg";
import zbior from "@/assets/photos/produkcja-zbior.jpg";
import { PageHeader } from "@/components/layout/PageHeader";
import { flavors } from "@/data/products";
import styles from "../pages.module.css";

export const metadata: Metadata = {
  title: "Nasza produkcja – jak powstaje sok",
  description:
    "Pięć etapów, w których owoce z sadu stają się sokiem Wieś Soków: pielęgnacja drzew, zbiór, selekcja, tłoczenie i pakowanie.",
  alternates: { canonical: "/produkcja" },
};

type Step = {
  title: string;
  text: string;
  photo: StaticImageData;
  alt: string;
  shape: "wide" | "tall" | "pack";
  extra?: { photo: StaticImageData; alt: string };
};

const steps: Step[] = [
  {
    title: "Pielęgnacja sadu",
    text: "Praca zaczyna się na długo przed zbiorem. Przez cały sezon doglądamy drzew, kosimy międzyrzędzia i obserwujemy, jak dojrzewają owoce.",
    photo: pielegnacja,
    alt: "Niebieski ciągnik przejeżdża między rzędami drzew w sadzie",
    shape: "wide",
  },
  {
    title: "Zbiór",
    text: "Zbieramy, gdy owoce są dojrzałe. Jabłka i gruszki trafiają do skrzyniopalet prosto między rzędami, żeby jak najkrócej czekały na transport.",
    photo: zbior,
    alt: "Skrzyniopaleta pełna jabłek w międzyrzędziu, w tle maszyna do zbioru",
    shape: "wide",
    extra: { photo: kombajn, alt: "Widok z góry na maszynę do zbioru i dwie osoby przy skrzyni z jabłkami" },
  },
  {
    title: "Selekcja i mycie",
    text: "Każdą partię przeglądamy. Do tłoczenia idą owoce zdrowe i dojrzałe, a przed prasą wszystkie są dokładnie myte.",
    photo: skrzynki,
    alt: "Dłoń wybiera czerwone jabłka z drewnianej skrzynki",
    shape: "tall",
  },
  {
    title: "Tłoczenie i pasteryzacja",
    text: "Owoce rozdrabniamy i tłoczymy. Sok pozostaje naturalnie mętny. Krótka pasteryzacja pozwala go przechowywać bez dodatków.",
    photo: sok,
    alt: "Klarowny sok nalewany z karafki do szklanki, obok przekrojone jabłko",
    shape: "wide",
  },
  {
    title: "Pakowanie",
    text: "Gotowy sok nalewamy do worków z kranikiem o pojemności 3 i 5 litrów. Szczelne opakowanie chroni sok przed powietrzem także po otwarciu.",
    photo: flavors.jablko.image,
    alt: flavors.jablko.imageAlt,
    shape: "pack",
  },
];

export default function ProductionPage() {
  return (
    <>
      <PageHeader title="Nasza produkcja" lead="Od drzewa do opakowania z kranikiem jest pięć etapów. Każdego pilnujemy sami." />

      <div className={styles.wide}>
        <Image
          src={ciagnik}
          alt="Niebieski ciągnik sadowniczy stoi w trawiastej alei między rzędami jabłoni"
          fill
          sizes="100vw"
          placeholder="blur"
          preload
          style={{ objectPosition: "50% 62%" }}
        />
      </div>

      <section className={`section ${styles.steps}`} aria-label="Etapy produkcji">
        <ol className="container">
          {steps.map((step, index) => (
            <li key={step.title} className={`${styles.stepRow} ${styles[`step_${step.shape}`]}`}>
              <div className={styles.stepText}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
              <div className={styles.stepMedia}>
                <figure className={styles.stepPhoto}>
                  <Image
                    src={step.photo}
                    alt={step.alt}
                    sizes={step.shape === "wide" ? "(min-width: 60rem) 46vw, 92vw" : "(min-width: 60rem) 30vw, 70vw"}
                    placeholder={step.shape === "pack" ? "empty" : "blur"}
                    quality={step.shape === "pack" ? 90 : 75}
                  />
                </figure>
                {step.extra ? (
                  <figure className={styles.stepExtra}>
                    <Image src={step.extra.photo} alt={step.extra.alt} sizes="(min-width: 60rem) 16vw, 36vw" placeholder="blur" />
                  </figure>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${styles.cta} on-dark`} aria-labelledby="produkcja-cta">
        <div className={`container ${styles.ctaInner}`}>
          <h2 id="produkcja-cta">Efekt tej pracy możesz mieć u&nbsp;siebie.</h2>
          <Link href="/sklep" className="btn btn--light">
            Przejdź do sklepu
          </Link>
          <p className={styles.ctaNote}>Opis procesu jest przykładowy i służy prezentacji projektu.</p>
        </div>
      </section>
    </>
  );
}

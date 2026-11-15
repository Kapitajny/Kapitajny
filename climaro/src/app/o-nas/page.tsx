import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "O nas – firma instalacyjna z Grodziska Mazowieckiego",
  description:
    "CLIMARO działa od 2010 roku na terenie województwa mazowieckiego. Montaż i serwis klimatyzacji, pomp ciepła i rekuperacji z certyfikatami F-gazowymi i protokołem z każdego uruchomienia.",
  alternates: { canonical: "/o-nas" },
};

const history = [
  { year: "2010", title: "Początek w Grodzisku Mazowieckim", text: "Montaż klimatyzacji w domach jednorodzinnych i małych biurach." },
  { year: "2014", title: "Serwis dla firm", text: "Stała obsługa serwisowa biur, sklepów i lokali usługowych." },
  { year: "2018", title: "Pompy ciepła", text: "Powietrzne pompy ciepła w nowych domach i przy wymianie starych kotłów." },
  { year: "2021", title: "Rekuperacja", text: "Wentylacja z odzyskiem ciepła, projektowana razem z ogrzewaniem budynku." },
  { year: "Dziś", title: "Całe Mazowsze", text: "Cztery obszary usług na terenie całego województwa mazowieckiego." },
];

const principles = [
  {
    title: "Podejście do klienta",
    text: "Zaczynamy od rozmowy o tym, jak korzystasz z budynku. Przed rozpoczęciem prac dostajesz pisemną ofertę z ceną, terminem i zakresem. Jeśli na miejscu okaże się, że trzeba coś zmienić, uzgadniamy to z Tobą przed wykonaniem.",
  },
  {
    title: "Standard usług",
    text: "Montujemy urządzenia zgodnie z instrukcjami producentów, bo od tego zależy gwarancja. Każde uruchomienie kończy się protokołem z pomiarami i instruktażem obsługi, a po pracy sprzątamy miejsce montażu.",
  },
  {
    title: "Profesjonalizm i bezpieczeństwo",
    text: "Instalatorzy mają certyfikaty F-gazowe wymagane do pracy z czynnikami chłodniczymi, a firma – certyfikat dla przedsiębiorstwa. Prace przy instalacji elektrycznej wykonują osoby z uprawnieniami, a działalność jest objęta ubezpieczeniem OC.",
  },
  {
    title: "Dbałość o jakość instalacji",
    text: "Rury chłodnicze lutujemy w osłonie azotu, a instalację sprawdzamy próbą ciśnieniową i próżniowaniem. Przepusty w ścianach uszczelniamy, trasy prowadzimy estetycznie i dokumentujemy je zdjęciami.",
  },
];

const clients = ["Domy jednorodzinne", "Mieszkania", "Biura", "Sklepy i lokale usługowe", "Wspólnoty mieszkaniowe", "Hale i obiekty lekkiego przemysłu"];

const steps = [
  { title: "Zapytanie", text: "Opisujesz budynek i potrzebę. Odpowiadamy z wstępną wyceną." },
  { title: "Wizja lokalna i oferta", text: "Mierzymy, sprawdzamy instalację i przygotowujemy pisemną ofertę." },
  { title: "Montaż", text: "Pracujemy w uzgodnionym terminie, z zabezpieczeniem pomieszczeń." },
  { title: "Uruchomienie i serwis", text: "Protokół z pomiarami, instruktaż i przypomnienie o przeglądzie." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="CLIMARO – Twój partner w nowoczesnym klimacie"
        lead={`Od ${site.foundedYear} roku montujemy i serwisujemy instalacje klimatyzacji, pomp ciepła i wentylacji w domach, biurach i obiektach usługowych na terenie województwa mazowieckiego.`}
        image={{ src: "/images/rekuperacja-maszynownia.jpg", alt: "Pomieszczenie techniczne z jednostką wewnętrzną pompy ciepła i izolowanymi zasobnikami" }}
      />

      <section className="theme-graphite section" aria-labelledby="historia-tytul">
        <div className="container">
          <div className={styles.head}>
            <h2 id="historia-tytul" className={styles.display}>
              Historia firmy
            </h2>
            <p className="lead">
              Powstaliśmy w Grodzisku Mazowieckim jako niewielka firma montażowa. Zakres usług poszerzaliśmy stopniowo – dopiero wtedy, gdy mieliśmy
              ludzi i doświadczenie, by robić to dobrze.
            </p>
          </div>

          {/* Oś czasu jako linia wymiarowa z rysunku technicznego. */}
          <ol className={styles.dimension}>
            {history.map((item) => (
              <li key={item.year}>
                <span className={`num ${styles.year}`}>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`theme-dark ${styles.scope}`} aria-labelledby="zakres-tytul">
        <div className={styles.scopeImage}>
          <Image
            src="/images/detal-pomiar.jpg"
            alt="Instalator z miernikiem cęgowym sprawdza przewody jednostki zewnętrznej klimatyzacji"
            fill
            sizes="(min-width: 64rem) 50vw, 100vw"
          />
        </div>
        <div className={styles.scopeText}>
          <h2 id="zakres-tytul" className={styles.display}>
            Zakres działalności
          </h2>
          <p className={styles.scopeLead}>
            Projektujemy, montujemy i serwisujemy klimatyzację, powietrzne pompy ciepła oraz wentylację mechaniczną z odzyskiem ciepła. Obsługujemy też
            instalacje wykonane przez inne firmy – zaczynając od przeglądu i diagnozy.
          </p>
          <h3 className={styles.smallHead}>Dla kogo pracujemy</h3>
          <ul className={styles.clients}>
            {clients.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="zasady-tytul">
        <div className="container">
          <div className={styles.head}>
            <h2 id="zasady-tytul" className={styles.display}>
              Jakość i bezpieczeństwo
            </h2>
            <p className="lead">Standardy, które obowiązują przy każdym zleceniu – niezależnie od wielkości instalacji.</p>
          </div>
          <div className={styles.principles}>
            {principles.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-paper section" aria-labelledby="proces-tytul">
        <div className="container">
          <h2 id="proces-tytul" className={`${styles.display} ${styles.stepsTitle}`}>
            Jak wygląda współpraca
          </h2>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className={`num ${styles.stepNo}`} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { HowWeWork } from "@/components/HowWeWork";
import { CheckIcon } from "@/components/Icons";
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
  { year: "2010", title: "Start w Grodzisku", text: "Montaż klimatyzacji w domach jednorodzinnych i małych biurach." },
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

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="CLIMARO – Twój partner w nowoczesnym klimacie"
        lead={`Od ${site.foundedYear} roku montujemy i serwisujemy instalacje klimatyzacji, pomp ciepła i wentylacji w domach, biurach i obiektach usługowych na terenie województwa mazowieckiego.`}
        image={{ src: "/images/dach-jednostki.jpg", alt: "Jednostki klimatyzacji i wentylacji na dachu nowoczesnego budynku z płytową elewacją" }}
      />

      <section className="theme-white section" aria-labelledby="historia-tytul">
        <div className="container">
          <div className="section-head">
            <h2 id="historia-tytul" className="h-section">
              Historia firmy
            </h2>
            <p className="lead">
              Powstaliśmy w Grodzisku Mazowieckim jako niewielka firma montażowa. Zakres usług poszerzaliśmy stopniowo – dopiero wtedy, gdy mieliśmy
              ludzi i doświadczenie, by robić to dobrze.
            </p>
          </div>
          <ol className={styles.timeline}>
            {history.map((item) => (
              <li key={item.year}>
                <span className={`num ${styles.year}`}>{item.year}</span>
                <h3 className="h-card">{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="theme-light section" aria-labelledby="zakres-tytul">
        <div className={`container ${styles.split}`}>
          <div className={styles.photo}>
            <Image
              src="/images/detal-pomiar.jpg"
              alt="Instalator z miernikiem cęgowym sprawdza przewody jednostki zewnętrznej klimatyzacji"
              fill
              sizes="(min-width: 64rem) 45vw, 100vw"
            />
          </div>
          <div className={styles.splitText}>
            <h2 id="zakres-tytul" className="h-section">
              Zakres działalności
            </h2>
            <p className="lead">
              Projektujemy, montujemy i serwisujemy klimatyzację, powietrzne pompy ciepła oraz wentylację mechaniczną z odzyskiem ciepła. Obsługujemy
              też instalacje wykonane przez inne firmy – zaczynając od przeglądu i diagnozy.
            </p>
            <h3 className="h-card">Dla kogo pracujemy</h3>
            <ul className={styles.clients}>
              {clients.map((client) => (
                <li key={client}>
                  <CheckIcon />
                  {client}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="theme-white section" aria-labelledby="zasady-tytul">
        <div className="container">
          <div className="section-head">
            <h2 id="zasady-tytul" className="h-section">
              Nasze standardy
            </h2>
            <p className="lead">Zasady, które obowiązują przy każdym zleceniu – niezależnie od wielkości instalacji.</p>
          </div>
          <div className={styles.principles}>
            {principles.map((item) => (
              <article key={item.title}>
                <h3 className="h-card">{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HowWeWork title="Jak wygląda współpraca" />

      <CtaBand image={{ src: "/images/pompa-ciepla-ogrod.jpg", position: "55% 50%" }} />
    </>
  );
}

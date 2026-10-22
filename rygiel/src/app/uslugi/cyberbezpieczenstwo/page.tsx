import type { Metadata } from "next";
import Link from "next/link";
import { BenefitList, DeliverySteps, ProblemList, ServiceCta } from "@/components/services/ServiceBlocks";
import { Accordion } from "@/components/ui/Accordion";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { LinkButton } from "@/components/ui/LinkButton";
import { Illustration } from "@/components/ui/Illustration";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { typesetDeep } from "@/lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Cyberbezpieczeństwo dla firm – audyt, analiza ryzyka, hardening",
  description:
    "Audyt bezpieczeństwa, analiza ryzyka, utwardzanie konfiguracji i testy bezpieczeństwa wykonywane wyłącznie za pisemną zgodą właściciela systemu. Raport dla zarządu i załącznik techniczny.",
  path: "/uslugi/cyberbezpieczenstwo",
});

const auditAreas = typesetDeep([
  { area: "Tożsamość i dostęp", checks: ["Konta z uprawnieniami administratora", "Drugi składnik logowania", "Konta nieaktywne i współdzielone"] },
  { area: "Poczta", checks: ["SPF, DKIM i DMARC domeny", "Reguły przekierowań w skrzynkach", "Ochrona przed złośliwymi załącznikami"] },
  { area: "Urządzenia", checks: ["Aktualność systemów", "Szyfrowanie dysków", "Uprawnienia lokalnego administratora"] },
  { area: "Sieć i dostęp zdalny", checks: ["Usługi widoczne z internetu", "Konfiguracja VPN i Wi-Fi", "Podział sieci na strefy"] },
  { area: "Usługi chmurowe", checks: ["Domyślne ustawienia udostępniania", "Dzienniki zdarzeń i ich przechowywanie", "Aplikacje z dostępem do danych"] },
  { area: "Kopie i procedury", checks: ["Odporność kopii na usunięcie", "Wynik ostatniego testu odtworzenia", "Procedura reagowania na incydent"] },
]);

const rulesOfEngagement = typesetDeep([
  { title: "Zakres", text: "Lista systemów, adresów i kont objętych testem. Wszystko, czego nie ma na liście, jest poza zakresem." },
  { title: "Termin i okno czasowe", text: "Daty i godziny, w których wykonujemy testy aktywne, uzgodnione tak, by nie zakłócić kluczowych procesów." },
  { title: "Osoby kontaktowe", text: "Po obu stronach – na wypadek, gdyby test wywołał nieoczekiwane skutki lub trzeba go było przerwać." },
  { title: "Metody wyłączone", text: "Na przykład testy przeciążeniowe czy socjotechnika wobec wskazanych osób – jeśli nie zostały wprost uzgodnione." },
  { title: "Krytyczne ustalenia", text: "Jeśli znajdziemy podatność, która grozi natychmiastowym incydentem, zgłaszamy ją od razu, nie czekając na raport." },
  { title: "Poufność i dane", text: "Sposób przechowywania wyników i dowodów, a także termin ich usunięcia po zakończeniu projektu." },
  { title: "Zgoda", text: "Podpis osoby uprawnionej do dysponowania systemem. Systemy dostawców zewnętrznych wymagają także ich zgody." },
]);

const reportOutline = typesetDeep([
  { title: "Podsumowanie dla zarządu", text: "Najważniejsze ryzyka i rekomendacje na dwóch stronach, bez żargonu." },
  { title: "Zakres i metodyka", text: "Co sprawdziliśmy, kiedy, jakimi metodami i czego nie obejmował przegląd." },
  { title: "Ustalenia", text: "Każde z oceną ryzyka, opisem skutków, dowodem i rekomendacją." },
  { title: "Plan naprawczy", text: "Zadania z priorytetem, szacowanym nakładem pracy i proponowanym właścicielem." },
  { title: "Załącznik techniczny", text: "Szczegóły konfiguracji, polecenia i odwołania do wytycznych dla osoby odpowiedzialnej za IT." },
]);

/** Przykładowe ustalenia na matrycy ryzyka – wyłącznie ilustracja metody. */
const sampleFindings = typesetDeep([
  { label: "A", name: "Brak drugiego składnika logowania do poczty", likelihood: 3, impact: 3 },
  { label: "B", name: "Domena bez rekordu DMARC", likelihood: 3, impact: 2 },
  { label: "C", name: "Nieużywane konto administratora", likelihood: 2, impact: 3 },
  { label: "D", name: "Drukarka z domyślnym hasłem panelu", likelihood: 2, impact: 1 },
]);

const levels = ["niskie", "średnie", "wysokie"];

export default function CybersecurityPage() {
  const service = getService("cyberbezpieczenstwo");

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/uslugi", label: "Usługi" },
          { href: service.href, label: service.name },
        ]}
        title="Audyt bezpieczeństwa i ochrona systemów"
        lede="Sprawdzamy, jak naprawdę skonfigurowane są Twoje systemy, oceniamy ryzyko i wdrażamy poprawki. Testy bezpieczeństwa wykonujemy wyłącznie w uzgodnionym zakresie i za pisemną zgodą właściciela systemu."
        aside={<Illustration priority caption="Audyt zaczyna się od mapy urządzeń, kont, usług i połączeń między nimi." />}
      >
        <div className={styles.headerActions}>
          <LinkButton href={`/kontakt?usluga=${service.slug}`} withArrow>
            Zapytaj o&nbsp;audyt
          </LinkButton>
          <LinkButton href="#zasady" variant="secondary">
            Zasady testów
          </LinkButton>
        </div>
      </PageHeader>

      <section className={styles.section} aria-labelledby="problemy">
        <div className={`container ${styles.split}`}>
          <h2 id="problemy" className={styles.h2}>
            Kiedy warto zrobić audyt
          </h2>
          <ProblemList items={service.problems} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="obszary-title">
        <div className="container">
          <SectionHeading
            id="obszary-title"
              title="Co sprawdzamy podczas audytu"
            intro={<p>Zakres dopasowujemy do firmy. Poniżej obszary, które przeglądamy najczęściej, i&nbsp;przykładowe punkty kontrolne.</p>}
          />
          <ul role="list" className={styles.areas}>
            {auditAreas.map((item) => (
              <li key={item.area} className={styles.area}>
                <h3 className={styles.areaTitle}>{item.area}</h3>
                <ul role="list" className={styles.checks}>
                  {item.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="ryzyko-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="ryzyko-title" className={styles.h2}>
              Jak oceniamy ryzyko
            </h2>
            <p className={styles.note}>
              Każde ustalenie oceniamy według prawdopodobieństwa i&nbsp;wpływu na firmę. Dzięki temu plan naprawczy zaczyna się od rzeczy, które naprawdę
              mogą zaszkodzić, a&nbsp;nie od tych, które najłatwiej poprawić.
            </p>
            <p className={styles.demoNote}>Ustalenia na matrycy to przykład ilustrujący metodę, a&nbsp;nie wynik rzeczywistego audytu.</p>
          </div>
          <figure className={styles.matrixFigure}>
            <div className={styles.matrix} role="img" aria-labelledby="matryca-opis">
              <span className={styles.axisY} aria-hidden="true">
                Wpływ na firmę
              </span>
              <div className={styles.cells} aria-hidden="true">
                {[3, 2, 1].map((impact) =>
                  [1, 2, 3].map((likelihood) => {
                    const score = impact * likelihood;
                    const found = sampleFindings.filter((item) => item.impact === impact && item.likelihood === likelihood);
                    return (
                      <div key={`${impact}-${likelihood}`} className={styles.cell} data-score={score >= 6 ? "high" : score >= 3 ? "medium" : "low"}>
                        {found.map((item) => (
                          <span key={item.label} className={styles.marker}>
                            {item.label}
                          </span>
                        ))}
                      </div>
                    );
                  }),
                )}
              </div>
              <div className={styles.axisX} aria-hidden="true">
                {levels.map((level) => (
                  <span key={level}>{level}</span>
                ))}
              </div>
              <span className={styles.axisXLabel} aria-hidden="true">
                Prawdopodobieństwo
              </span>
            </div>
            <figcaption id="matryca-opis" className={styles.legend}>
              <span className={styles.legendTitle}>Przykładowa matryca ryzyka</span>
              <ol role="list">
                {sampleFindings.map((item) => (
                  <li key={item.label}>
                    <span className={styles.legendLabel} aria-hidden="true">
                      {item.label}
                    </span>
                    <span>
                      {item.name}
                      <span className="visually-hidden">
                        {" "}
                        – prawdopodobieństwo {levels[item.likelihood - 1]}, wpływ {levels[item.impact - 1]}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="zasady" className={`${styles.section} ${styles.tinted}`} aria-labelledby="zasady-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="zasady-title" className={styles.h2}>
              Zasady testów bezpieczeństwa
            </h2>
            <p className={styles.note}>
              Zanim wykonamy jakikolwiek test aktywny, spisujemy z&nbsp;Tobą dokument zasad. Bez podpisanej zgody osoby uprawnionej do dysponowania
              systemem nie zaczynamy pracy.
            </p>
          </div>
          <ol className={styles.clauses}>
            {rulesOfEngagement.map((rule, index) => (
              <li key={rule.title} className={styles.clause}>
                <span className={styles.clauseNumber} aria-hidden="true">
                  {index + 1}.
                </span>
                <div>
                  <h3 className={styles.clauseTitle}>{rule.title}</h3>
                  <p className={styles.clauseText}>{rule.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="raport-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="raport-title" className={styles.h2}>
              Co zawiera raport
            </h2>
            <p className={styles.note}>
              Jeden dokument dla dwóch odbiorców: zarząd czyta podsumowanie i&nbsp;plan, osoba odpowiedzialna za IT – ustalenia i&nbsp;załącznik techniczny.
            </p>
          </div>
          <div className={styles.document}>
            <p className={styles.documentTitle}>Spis treści raportu</p>
            <ol className={styles.toc}>
              {reportOutline.map((item, index) => (
                <li key={item.title}>
                  <span className={styles.tocNumber} aria-hidden="true">
                    {index + 1}.
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <span className={styles.tocText}>{item.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="etapy-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="etapy-title" className={styles.h2}>
              Etapy współpracy
            </h2>
            <DeliverySteps items={service.delivery} />
          </div>
          <div className={styles.stack}>
            <h2 className={styles.h2}>Co zyskujesz</h2>
            <BenefitList items={service.benefits} />
            <p className={styles.note}>
              Chcesz zacząć od podstaw? Przeczytaj w bazie wiedzy, jak{" "}
              <Link href="/baza-wiedzy/spf-dkim-dmarc-bezpieczenstwo-poczty" className="text-link">
                zabezpieczyć pocztę firmową
              </Link>{" "}
              i{" "}
              <Link href="/baza-wiedzy/phishing-w-malej-firmie" className="text-link">
                przygotować zespół na phishing
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={`container ${styles.split}`}>
          <h2 id="faq-title" className={styles.h2}>
            Pytania o&nbsp;bezpieczeństwo
          </h2>
          <div className={styles.stack}>
            <Accordion items={service.faq} />
            <ServiceCta service={service} />
          </div>
        </div>
      </section>

      <ClosingCta
        headingId="bezpieczenstwo-cta"
        title="Zamów audyt bezpieczeństwa"
        text="Na tej podstawie zaproponujemy zakres audytu i powiemy, czego będziemy potrzebować od Twojej firmy."
        secondary={{ href: "/realizacje/dostepy-i-poczta-biura-rachunkowego", label: "Zobacz przykładową realizację" }}
      />
    </>
  );
}

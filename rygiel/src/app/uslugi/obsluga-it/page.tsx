import type { Metadata } from "next";
import { BenefitList, DeliverySteps, ProblemList, ScopeList, ServiceCta } from "@/components/services/ServiceBlocks";
import { Accordion } from "@/components/ui/Accordion";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { LinkButton } from "@/components/ui/LinkButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { typesetDeep } from "@/lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Obsługa IT dla firm – administracja, monitoring, wsparcie",
  description:
    "Stała obsługa IT dla małych i średnich firm: administracja komputerów i serwerów, monitoring, wsparcie użytkowników, zarządzanie kontami i dokumentacja środowiska.",
  path: "/uslugi/obsluga-it",
});

const rhythm = typesetDeep([
  {
    period: "Codziennie",
    tasks: ["Obsługa zgłoszeń według priorytetów", "Przegląd alertów monitoringu", "Kontrola wyników nocnych kopii zapasowych"],
  },
  {
    period: "Co tydzień",
    tasks: ["Instalacja aktualizacji w grupie testowej, potem na pozostałych urządzeniach", "Przegląd miejsca na dyskach i stanu urządzeń"],
  },
  {
    period: "Co miesiąc",
    tasks: ["Raport: zgłoszenia, zmiany, problemy powtarzające się", "Przegląd wygasających licencji, certyfikatów i domen"],
  },
  {
    period: "Co kwartał",
    tasks: ["Przegląd dostępów i kont nieaktywnych", "Test odtworzenia wybranych danych", "Spotkanie i plan na kolejny kwartał"],
  },
]);

type Party = "realizuje" | "decyduje" | "wnioskuje" | "konsultuje" | "—";

const responsibilities: { task: string; rygiel: Party; client: Party }[] = typesetDeep([
  { task: "Aktualizacje systemów i aplikacji", rygiel: "realizuje", client: "—" },
  { task: "Zakup nowego sprzętu i licencji", rygiel: "konsultuje", client: "decyduje" },
  { task: "Konto i dostępy dla nowej osoby", rygiel: "realizuje", client: "wnioskuje" },
  { task: "Wyłączenie dostępów po odejściu pracownika", rygiel: "realizuje", client: "wnioskuje" },
  { task: "Zmiana dostawcy internetu lub telefonii", rygiel: "konsultuje", client: "decyduje" },
  { task: "Konfiguracja i monitoring kopii zapasowych", rygiel: "realizuje", client: "—" },
  { task: "Zasady korzystania ze sprzętu przez pracowników", rygiel: "konsultuje", client: "decyduje" },
]);

const priorities = typesetDeep([
  { name: "Krytyczny", text: "Firma lub jej kluczowy dział nie może pracować, na przykład nie działa poczta albo system sprzedaży." },
  { name: "Wysoki", text: "Problem dotyczy jednej osoby, która nie może wykonywać swojej pracy." },
  { name: "Normalny", text: "Usterka utrudnia pracę, ale da się ją obejść." },
  { name: "Planowy", text: "Prośby i zmiany, które można zaplanować: nowe stanowisko, instalacja programu, konfiguracja drukarki." },
]);

export default function ManagedItPage() {
  const service = getService("obsluga-it");

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/uslugi", label: "Usługi" },
          { href: service.href, label: service.name },
        ]}
        kicker={service.englishName}
        title="Obsługa IT, w której wiesz, kto i kiedy zajmie się problemem"
        lede="Przejmujemy codzienne utrzymanie komputerów, serwerów i kont. Pracujemy według stałego rytmu, a każdą zmianę zapisujemy, więc wiedza o Twoim środowisku nie znika razem z jedną osobą."
      >
        <div className={styles.headerActions}>
          <LinkButton href={`/kontakt?usluga=${service.slug}`} withArrow>
            Zapytaj o obsługę IT
          </LinkButton>
          <LinkButton href="#rytm" variant="secondary">
            Zobacz, jak wygląda miesiąc współpracy
          </LinkButton>
        </div>
      </PageHeader>

      <section className={styles.section} aria-labelledby="problemy">
        <div className={`container ${styles.split}`}>
          <h2 id="problemy" className={styles.h2}>
            Kiedy firmy szukają stałej obsługi IT
          </h2>
          <ProblemList items={service.problems} />
        </div>
      </section>

      <section id="rytm" className={`${styles.section} ${styles.tinted}`} aria-labelledby="rytm-title">
        <div className="container">
          <SectionHeading
            id="rytm-title"
            layout="split"
            title="Rytm pracy"
            intro={<p>Utrzymanie to powtarzalne czynności, a nie tylko gaszenie pożarów. Tak wygląda plan, który dopasowujemy do Twojej firmy.</p>}
          />
          <ol role="list" className={styles.rhythm}>
            {rhythm.map((column) => (
              <li key={column.period} className={styles.rhythmColumn}>
                <h3 className={styles.rhythmTitle}>{column.period}</h3>
                <ul role="list">
                  {column.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="zakres-title">
        <div className={`container ${styles.split}`}>
          <div>
            <h2 id="zakres-title" className={styles.h2}>
              Zakres usługi
            </h2>
            <p className={styles.note}>Dokładny zakres zapisujemy w umowie po przeglądzie środowiska.</p>
          </div>
          <ScopeList items={service.scope} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="podzial-title">
        <div className="container">
          <SectionHeading
            id="podzial-title"
            layout="split"
            title="Kto za co odpowiada"
            intro={
              <p>
                Najwięcej nieporozumień bierze się z niejasnego podziału obowiązków. Przykładowy podział ustalamy na starcie i zapisujemy w umowie.
              </p>
            }
          />
                      <table className={styles.table}>
              <caption className="visually-hidden">Przykładowy podział odpowiedzialności między Rygiel a firmę klienta</caption>
              <thead>
                <tr>
                  <th scope="col">Zadanie</th>
                  <th scope="col">Rygiel</th>
                  <th scope="col">Twoja firma</th>
                </tr>
              </thead>
              <tbody>
                {responsibilities.map((row) => (
                  <tr key={row.task}>
                    <th scope="row">{row.task}</th>
                    <td data-party={row.rygiel} data-label="Rygiel">{row.rygiel}</td>
                    <td data-party={row.client} data-label="Twoja firma">{row.client === "—" ? <><span aria-hidden="true">—</span><span className="visually-hidden">brak udziału</span></> : row.client}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="zgloszenia-title">
        <div className={`container ${styles.split}`}>
          <div>
            <h2 id="zgloszenia-title" className={styles.h2}>
              Jak obsługujemy zgłoszenia
            </h2>
            <p className={styles.note}>
              Każde zgłoszenie dostaje numer i priorytet. Czasy reakcji dla poszczególnych priorytetów zapisujemy w umowie, dopasowując je do godzin
              pracy Twojej firmy.
            </p>
          </div>
          <dl className={styles.priorities}>
            {priorities.map((item, index) => (
              <div key={item.name} className={styles.priority} data-level={index}>
                <dt>{item.name}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="start-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="start-title" className={styles.h2}>
              Jak zaczynamy
            </h2>
            <DeliverySteps items={service.delivery} />
          </div>
          <div className={styles.stack}>
            <h2 className={styles.h2}>Co zyskujesz</h2>
            <BenefitList items={service.benefits} />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={`container ${styles.split}`}>
          <h2 id="faq-title" className={styles.h2}>
            Pytania o obsługę IT
          </h2>
          <div className={styles.stack}>
            <Accordion items={service.faq} />
            <ServiceCta service={service} />
          </div>
        </div>
      </section>

      <ClosingCta
        headingId="obsluga-cta"
        title="Sprawdźmy, w jakim stanie jest Twoje środowisko."
        text="Przegląd środowiska to dobry pierwszy krok, nawet jeśli nie zdecydujesz się na stałą współpracę. Dostajesz inwentaryzację i listę rzeczy do poprawy."
        secondary={{ href: "/uslugi/cyberbezpieczenstwo", label: "Zobacz usługi bezpieczeństwa" }}
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";
import { BenefitList, ProblemList, ScopeList, ServiceCta } from "@/components/services/ServiceBlocks";
import { Accordion } from "@/components/ui/Accordion";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { LinkButton } from "@/components/ui/LinkButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FlowDiagram as FlowDiagramData } from "@/content/cases";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { typesetDeep } from "@/lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Chmura i infrastruktura – kopie zapasowe, ciągłość działania, migracje",
  description:
    "Kopie zapasowe w modelu 3-2-1 sprawdzane testem odtworzenia, plan ciągłości działania, migracje do chmury etapami z planem wycofania i porządkowanie kosztów infrastruktury.",
  path: "/uslugi/chmura-i-infrastruktura",
});

const backupDiagram: FlowDiagramData = typesetDeep({
  title: "Kopie zapasowe w modelu 3-2-1",
  description:
    "Dane produkcyjne to pierwsza kopia. Druga powstaje lokalnie, na innym urządzeniu, i pozwala szybko odtworzyć pliki. Trzecia trafia poza firmę, do magazynu z blokadą usunięcia, który chroni ją przed ransomware i utratą biura.",
  columns: [
    { label: "Kopia 1: dane produkcyjne", nodes: [{ name: "Serwery i usługi", detail: "pliki, bazy, poczta" }] },
    { label: "Kopia 2: lokalnie", nodes: [{ name: "Inny nośnik", detail: "szybkie odtworzenie plików", emphasis: true }] },
    { label: "Kopia 3: poza firmą", nodes: [{ name: "Magazyn z blokadą usunięcia", detail: "osobne konto i poświadczenia", emphasis: true }] },
    { label: "Dowód", nodes: [{ name: "Test odtworzenia", detail: "protokół z wynikiem i czasem" }] },
  ],
  links: ["kopia", "replikacja szyfrowana", "regularnie"],
});

const migrationStages = typesetDeep([
  { title: "Inwentaryzacja", text: "Systemy, zależności między nimi, dane i osoby, które z nich korzystają." },
  { title: "Środowisko docelowe", text: "Budujemy je obok obecnego, opisane jako kod, z kopiami i monitoringiem od pierwszego dnia." },
  { title: "Migracja pilotażowa", text: "Przenosimy mniej krytyczną usługę i sprawdzamy procedurę na małej skali." },
  { title: "Migracja właściwa", text: "Usługi przenosimy partiami, w uzgodnionych oknach. Stare środowisko działa do czasu odbioru." },
  { title: "Odbiór i wyłączenie", text: "Test odtworzenia w nowym środowisku, przekazanie dokumentacji, dopiero potem wyłączenie starego." },
]);

export default function CloudPage() {
  const service = getService("chmura-i-infrastruktura");

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/uslugi", label: "Usługi" },
          { href: service.href, label: service.name },
        ]}
        title="Chmura, kopie zapasowe i ciągłość działania"
        lede="Projektujemy i utrzymujemy środowiska chmurowe i hybrydowe, kopie zapasowe oraz plany ciągłości działania. O tym, czy kopia działa, decyduje test odtworzenia, a nie zielona ikonka w panelu."
      >
        <div className={styles.headerActions}>
          <LinkButton href={`/kontakt?usluga=${service.slug}`} withArrow>
            Zapytaj o&nbsp;kopie lub migrację
          </LinkButton>
          <LinkButton href="#kopie" variant="secondary">
            Jak projektujemy kopie
          </LinkButton>
        </div>
      </PageHeader>

      <section className={styles.section} aria-labelledby="problemy">
        <div className={`container ${styles.split}`}>
          <h2 id="problemy" className={styles.h2}>
            Typowe sytuacje
          </h2>
          <ProblemList items={service.problems} />
        </div>
      </section>

      <section id="kopie" className={`${styles.section} ${styles.tinted}`} aria-labelledby="kopie-title">
        <div className="container">
          <SectionHeading
            id="kopie-title"
              title="Kopie zapasowe w modelu 3-2-1"
            intro={
              <p>
                Zasada 3-2-1: trzy kopie danych, na dwóch różnych nośnikach, z&nbsp;czego jedna poza firmą. Dokładamy do niej czwarty element – regularny
                test, czy da się z&nbsp;nich odtworzyć pracę firmy.
              </p>
            }
          />
          <FlowDiagram diagram={backupDiagram} />
          <p className={styles.more}>
            Więcej o planowaniu kopii przeczytasz w artykule{" "}
            <Link href="/baza-wiedzy/kopie-zapasowe-3-2-1-w-praktyce" className="text-link">
              Kopie zapasowe 3-2-1 w&nbsp;praktyce
            </Link>
            .
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="rpo-title">
        <div className="container">
          <SectionHeading
            id="rpo-title"
              title="Cele odtwarzania: RPO i RTO"
            intro={
              <p>
                Ile danych możesz stracić i&nbsp;jak długo możesz czekać na powrót do pracy. Wartości ustalamy z&nbsp;Tobą osobno dla każdego systemu – od nich
                zależy architektura i&nbsp;koszt kopii.
              </p>
            }
          />
          <figure className={styles.timeline}>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.event} style={{ left: "18%" }}>
                Ostatnia kopia
              </span>
              <span className={`${styles.event} ${styles.eventAlert}`} style={{ left: "48%" }}>
                Awaria
              </span>
              <span className={styles.event} style={{ left: "82%" }}>
                Praca przywrócona
              </span>
            </div>
            <dl className={styles.spans}>
              <div className={styles.rpo}>
                <dt>RPO – akceptowalna utrata danych</dt>
                <dd>Czas między ostatnią kopią a&nbsp;awarią. Wszystko, co powstało w&nbsp;tym okresie, trzeba odtworzyć ręcznie albo przepadnie.</dd>
              </div>
              <div className={styles.rto}>
                <dt>RTO – czas przywrócenia</dt>
                <dd>Czas od awarii do powrotu do pracy. Obejmuje wykrycie problemu, decyzję, odtworzenie danych i&nbsp;sprawdzenie, że wszystko działa.</dd>
              </div>
            </dl>
            <figcaption className={styles.caption}>
              RPO i&nbsp;RTO na osi czasu: ostatnia kopia, awaria i&nbsp;przywrócenie pracy.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="migracja-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="migracja-title" className={styles.h2}>
              Migracja etapami
            </h2>
            <p className={styles.note}>
              Unikamy przełączania wszystkiego jednej nocy. Po każdym etapie sprawdzamy wynik, a&nbsp;do czasu odbioru stare środowisko pozostaje gotowe do
              powrotu.
            </p>
          </div>
          <ol className={styles.migration}>
            {migrationStages.map((stage, index) => (
              <li key={stage.title} className={styles.stage}>
                <span className={styles.stageNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                  <p className={styles.stageText}>{stage.text}</p>
                  {index > 1 && index < migrationStages.length - 1 ? <p className={styles.rollback}>Punkt powrotu: stare środowisko nadal działa</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="zakres-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.stack}>
            <h2 id="zakres-title" className={styles.h2}>
              Zakres usługi
            </h2>
            <BenefitList items={service.benefits} />
          </div>
          <ScopeList items={service.scope} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="faq-title">
        <div className={`container ${styles.split}`}>
          <h2 id="faq-title" className={styles.h2}>
            Pytania o&nbsp;chmurę i&nbsp;kopie
          </h2>
          <div className={styles.stack}>
            <Accordion items={service.faq} />
            <ServiceCta service={service} />
          </div>
        </div>
      </section>

      <ClosingCta
        headingId="chmura-cta"
        title="Sprawdźmy Twoje kopie zapasowe"
        text="Zacznijmy od testu odtworzenia wybranych danych. To najszybszy sposób, żeby sprawdzić, czy kopie działają."
        secondary={{ href: "/realizacje/kopie-zapasowe-pracowni-projektowej", label: "Zobacz przykładową realizację" }}
      />
    </>
  );
}

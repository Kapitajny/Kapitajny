import { CheckIcon } from "./Icons";
import styles from "./CommissioningReport.module.css";

// Przykładowy protokół uruchomienia klimatyzacji. Wszystkie wartości są demonstracyjne
// i tak są opisane na stronie – pokazują, jakie pomiary trafiają do protokołu.
const reasons = [
  { title: "Dobór na podstawie pomiarów", text: "Moc urządzenia liczymy dla konkretnego pomieszczenia, a nie „na oko”." },
  { title: "Montaż zgodny z wymaganiami producenta", text: "Próba szczelności i próżniowanie to warunki gwarancji urządzenia." },
  { title: "Działanie sprawdzone pomiarem", text: "Po uruchomieniu mierzymy parametry pracy i zapisujemy wyniki." },
  { title: "Jeden zespół od montażu po serwis", text: "Termin przeglądu wpisujemy od razu – serwisujemy własne instalacje." },
];

const groups: { marker: number; rows: [string, string][] }[] = [
  { marker: 1, rows: [["Dobór mocy", "pomieszczenie 32 m², ekspozycja południowa – 3,5 kW"]] },
  {
    marker: 2,
    rows: [
      ["Próba szczelności azotem", "40 bar przez 24 h, bez spadku ciśnienia"],
      ["Próżniowanie instalacji", "65 Pa, utrzymane przez 15 min"],
    ],
  },
  {
    marker: 3,
    rows: [
      ["Temperatura nawiewu", "11,8 °C"],
      ["Temperatura w pomieszczeniu", "24,6 °C"],
      ["Pobór prądu", "4,1 A"],
    ],
  },
  { marker: 4, rows: [["Następny przegląd", "czerwiec 2027"]] },
];

export function CommissioningReport() {
  return (
    <section className={`theme-paper section ${styles.section}`} aria-labelledby="protokol-tytul">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <h2 id="protokol-tytul" className={styles.title}>
            Każde uruchomienie kończy się protokołem
          </h2>
          <p className="lead">
            Cenę znasz przed pierwszą rozmową, a po montażu dostajesz dokument z wynikami pomiarów. Tak wygląda przykładowy protokół.
          </p>
          <ol className={styles.legend}>
            {reasons.map((reason, index) => (
              <li key={reason.title}>
                <span className={`num ${styles.legendNo}`} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className={styles.sheet} aria-labelledby="protokol-dokument">
          <figcaption className={styles.sheetHead}>
            <p id="protokol-dokument" className={styles.sheetTitle}>
              Protokół uruchomienia
            </p>
            <p className={styles.sample}>Przykład – dane demonstracyjne</p>
          </figcaption>

          <dl className={styles.meta}>
            <div>
              <dt>Obiekt</dt>
              <dd>Dom jednorodzinny, Grodzisk Mazowiecki</dd>
            </div>
            <div>
              <dt>Urządzenie</dt>
              <dd>Klimatyzator typu split</dd>
            </div>
          </dl>

          <div className={styles.groups}>
            {groups.map((group) => (
              <div key={group.marker} className={styles.group}>
                <span className={`num ${styles.marker}`} aria-hidden="true">
                  {group.marker}
                </span>
                <dl className={styles.rows}>
                  {group.rows.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd className="num">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <ul className={styles.checks}>
            <li>
              <CheckIcon />
              Instruktaż obsługi przeprowadzony
            </li>
            <li>
              <CheckIcon />
              Karta gwarancyjna uzupełniona
            </li>
          </ul>

          <div className={styles.signatures} aria-hidden="true">
            <span>Podpis instalatora</span>
            <span>Podpis klienta</span>
          </div>
        </figure>
      </div>
    </section>
  );
}

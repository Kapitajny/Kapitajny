import type { Metadata } from "next";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { typesetDeep } from "@/lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "O nas – jak pracujemy",
  description:
    "Misja, zasady współpracy, priorytety bezpieczeństwa i sposób komunikacji Rygiel: jawna praca, dokumentacja należąca do klienta i decyzje oparte na sprawdzonych faktach.",
  path: "/o-nas",
});

const beliefs = typesetDeep([
  {
    title: "Technologia dopasowana do skali",
    text: "Dwudziestoosobowa firma nie potrzebuje architektury korporacji. Proponujemy rozwiązania, które Twój zespół zrozumie i utrzyma, także bez nas.",
  },
  {
    title: "Najpierw pomiar, potem zmiana",
    text: "Decyzje opieramy na tym, co sprawdziliśmy w Twoim środowisku, a nie na ogólnych listach zakupowych.",
  },
  {
    title: "Bez przywiązania do jednego dostawcy",
    text: "Dobieramy narzędzia do potrzeb. Jeśli to, co już masz, wystarczy po zmianie konfiguracji, powiemy to.",
  },
]);

const rules = typesetDeep([
  { title: "Mówimy wprost", text: "Jeśli coś jest poza naszym zakresem albo nie ma sensu ekonomicznego, mówimy to na początku, a nie po wystawieniu faktury." },
  { title: "Dokumentacja należy do Ciebie", text: "Hasła, schematy i opisy konfiguracji przechowujemy w miejscu, do którego masz dostęp – przez cały czas, nie tylko na koniec." },
  { title: "Zmiany po akceptacji", text: "Zmiany, które mogą wpłynąć na pracę firmy, zapowiadamy z wyprzedzeniem i wprowadzamy w uzgodnionym oknie." },
  { title: "Imienne dostępy", text: "Każda osoba z naszej strony ma własne konto, które możesz w każdej chwili przejrzeć i wyłączyć." },
  { title: "Łatwe zakończenie współpracy", text: "Procedura przekazania środowiska jest częścią umowy od pierwszego dnia. Nikt nie powinien zostawać z nami z przymusu." },
]);

const priorities = typesetDeep([
  { title: "Tożsamość i dostęp", text: "Przejęte konto to najczęstszy początek incydentu. Drugi składnik logowania i porządek w uprawnieniach są na początku listy." },
  { title: "Kopie zapasowe", text: "Gdy wszystko inne zawiedzie, kopia odporna na usunięcie i sprawdzona testem pozwala wrócić do pracy." },
  { title: "Aktualizacje", text: "Znane podatności w nieaktualnym oprogramowaniu to najprostsza droga do środka." },
  { title: "Poczta", text: "Zabezpieczenie domeny i skrzynek ogranicza phishing i podszywanie się pod firmę." },
  { title: "Ludzie i procedury", text: "Zespół, który wie, jak rozpoznać atak i komu go zgłosić, zatrzymuje to, czego nie zatrzymały narzędzia." },
]);

const communication = typesetDeep([
  { channel: "Zgłoszenia", how: "Jeden kanał ustalony na starcie, każde zgłoszenie z numerem i statusem." },
  { channel: "Raport miesięczny", how: "Co zrobiliśmy, co się powtarza, co planujemy. Bez żargonu na pierwszej stronie." },
  { channel: "Przegląd kwartalny", how: "Spotkanie z osobą decyzyjną: ryzyka, plan, budżet." },
  { channel: "Zmiany ryzykowne", how: "Zapowiedź z wyprzedzeniem, termin i plan wycofania." },
  { channel: "Incydent", how: "Natychmiastowa informacja, regularne aktualizacje i podsumowanie po zakończeniu." },
]);

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/o-nas", label: "O nas" }]}
        title="Pracujemy jak inżynierowie: najpierw sprawdzamy, potem zmieniamy, na końcu dokumentujemy"
        lede="Naszą misją jest, żeby małe i średnie firmy miały IT, które działa przewidywalnie, jest zabezpieczone adekwatnie do ryzyka i nie zależy od wiedzy jednej osoby."
        aside={
          <p className={styles.note}>
            <strong>O tej stronie.</strong> {siteConfig.portfolio.note} Dlatego nie przedstawiamy zespołu, historii firmy ani biografii – opisujemy model
            działania, który stoi za usługami.
          </p>
        }
      />

      <section className={styles.section} aria-labelledby="podejscie">
        <div className="container">
          <SectionHeading id="podejscie" layout="split" title="Podejście do technologii" intro={<p>Trzy przekonania, którymi kierujemy się przy każdej rekomendacji.</p>} />
          <dl className={styles.beliefs}>
            {beliefs.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="zasady">
        <div className={`container ${styles.split}`}>
          <h2 id="zasady" className={styles.h2}>
            Zasady współpracy
          </h2>
          <dl className={styles.rules}>
            {rules.map((rule) => (
              <div key={rule.title} className={styles.rule}>
                <dt>{rule.title}</dt>
                <dd>{rule.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProcessSection headingId="proces-o-nas" />

      <section className={styles.section} aria-labelledby="priorytety">
        <div className={`container ${styles.split}`}>
          <div>
            <h2 id="priorytety" className={styles.h2}>
              Priorytety bezpieczeństwa
            </h2>
            <p className={styles.intro}>Gdy wszystko wydaje się pilne, kolejność prac ustalamy według tego, co najczęściej prowadzi do poważnych incydentów.</p>
          </div>
          <ol className={styles.priorities}>
            {priorities.map((item, index) => (
              <li key={item.title} className={styles.priority}>
                <span className={styles.priorityIndex} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className={styles.priorityTitle}>{item.title}</h3>
                  <p className={styles.priorityText}>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="komunikacja">
        <div className="container">
          <SectionHeading
            id="komunikacja"
            layout="split"
            title="Jak się komunikujemy"
            intro={<p>Każda informacja ma swoje miejsce i rytm. Dzięki temu wiesz, czego i kiedy się spodziewać, a pilne sprawy nie giną w zwykłej korespondencji.</p>}
          />
          <dl className={styles.channels}>
            {communication.map((item) => (
              <div key={item.channel} className={styles.channel}>
                <dt>{item.channel}</dt>
                <dd>{item.how}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ClosingCta headingId="o-nas-cta" title="Sprawdźmy, czy pasujemy do siebie." secondary={{ href: "/realizacje", label: "Zobacz realizacje" }} />
    </>
  );
}

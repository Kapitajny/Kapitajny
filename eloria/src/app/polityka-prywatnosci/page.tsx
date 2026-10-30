import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { DemoNote } from "@/components/ui/DemoNote";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych przez ÉLORIA Aesthetic Medical Clinic – formularze, kontakt, prawa osób, których dane dotyczą.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

function Fill({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <span className="bg-blush px-1.5 text-espresso">[{label} – do uzupełnienia]</span>;
}

const sections = [
  { id: "administrator", title: "Administrator danych" },
  { id: "zakres", title: "Jakie dane przetwarzamy i w jakim celu" },
  { id: "zdrowie", title: "Dane o zdrowiu" },
  { id: "odbiorcy", title: "Odbiorcy danych" },
  { id: "okres", title: "Jak długo przechowujemy dane" },
  { id: "prawa", title: "Twoje prawa" },
  { id: "cookies", title: "Pliki cookies i zasoby zewnętrzne" },
  { id: "zmiany", title: "Zmiany polityki" },
];

export default function PrivacyPage() {
  const { controller, contact } = siteConfig;
  return (
    <>
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
        ]}
        title="Polityka prywatności"
        lede="Wyjaśniamy, jakie dane zbieramy przez tę stronę, w jakim celu i jakie prawa Ci przysługują."
      >
        <DemoNote className="mt-10 max-w-2xl">
          Wersja robocza przygotowana na potrzeby projektu demonstracyjnego. Przed publikacją musi zostać uzupełniona o dane administratora i
          zweryfikowana przez prawnika lub inspektora ochrony danych.
        </DemoNote>
      </PageIntro>

      <div className="frame grid gap-y-12 pb-24 lg:grid-cols-12 lg:gap-x-8 lg:pb-32">
        <nav aria-label="Spis treści" className="lg:col-span-3">
          <ol className="space-y-2 border-l border-line pl-5 text-sm lg:sticky lg:top-28">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-taupe hover:text-espresso">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose-body max-w-2xl space-y-14 text-base lg:col-span-7 lg:col-start-5 [&_h2]:mb-5 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-espresso [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          <section id={sections[0].id}>
            <h2>1. {sections[0].title}</h2>
            <p>
              Administratorem danych osobowych jest <Fill value={controller.companyName} label="nazwa podmiotu" />, prowadzący(-a) {siteConfig.fullName}{" "}
              pod adresem {contact.street}, {contact.postalCode} {contact.city}, NIP <Fill value={controller.nip} label="NIP" />, REGON{" "}
              <Fill value={controller.regon} label="REGON" />.
            </p>
            <p>
              W sprawach dotyczących danych osobowych możesz skontaktować się z nami pod adresem{" "}
              <a href={`mailto:${contact.email}`} className="link-quiet text-espresso">
                {contact.email}
              </a>{" "}
              lub telefonicznie: {contact.phoneDisplay}.
            </p>
          </section>

          <section id={sections[1].id}>
            <h2>2. {sections[1].title}</h2>
            <ul>
              <li>
                <strong className="font-medium text-espresso">Formularz kontaktowy</strong> – imię i nazwisko, adres e-mail, opcjonalnie numer telefonu
                oraz treść wiadomości. Cel: odpowiedź na wiadomość (art. 6 ust. 1 lit. a i f RODO).
              </li>
              <li>
                <strong className="font-medium text-espresso">Zapytanie o konsultację</strong> – imię i nazwisko, telefon, e-mail, wybrany obszar lub
                zabieg oraz preferowane terminy. Cel: kontakt w sprawie umówienia wizyty (art. 6 ust. 1 lit. a i b RODO).
              </li>
              <li>
                <strong className="font-medium text-espresso">Kontakt telefoniczny i e-mailowy</strong> – dane, które przekażesz. Cel: obsługa zapytania
                (art. 6 ust. 1 lit. f RODO).
              </li>
            </ul>
            <p>Podanie danych jest dobrowolne, ale niezbędne, abyśmy mogli odpowiedzieć na zapytanie.</p>
          </section>

          <section id={sections[2].id}>
            <h2>3. {sections[2].title}</h2>
            <p>
              Formularze na stronie nie służą do przekazywania informacji o stanie zdrowia – prosimy ich nie wpisywać. Dane o zdrowiu zbieramy wyłącznie
              podczas wizyty, w dokumentacji medycznej, na podstawie art. 9 ust. 2 lit. h RODO i przepisów o prawach pacjenta.
            </p>
          </section>

          <section id={sections[3].id}>
            <h2>4. {sections[3].title}</h2>
            <p>
              Dane mogą być przekazywane podmiotom, które świadczą dla nas usługi: dostawcy hostingu strony, poczty elektronicznej oraz systemu do obsługi
              zgłoszeń i rezerwacji – <Fill value={null} label="lista dostawców" />. Podmioty te przetwarzają dane wyłącznie na nasze polecenie.
            </p>
          </section>

          <section id={sections[4].id}>
            <h2>5. {sections[4].title}</h2>
            <p>
              Dane z formularzy przechowujemy przez czas potrzebny do obsługi zapytania, a następnie przez okres przedawnienia ewentualnych roszczeń.
              Dokumentację medyczną przechowujemy przez okres wymagany przepisami prawa.
            </p>
          </section>

          <section id={sections[5].id}>
            <h2>6. {sections[5].title}</h2>
            <p>Masz prawo do:</p>
            <ul>
              <li>dostępu do swoich danych i otrzymania ich kopii,</li>
              <li>sprostowania danych,</li>
              <li>usunięcia danych lub ograniczenia ich przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
              <li>cofnięcia zgody w dowolnym momencie – bez wpływu na zgodność z prawem przetwarzania przed jej cofnięciem,</li>
              <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
            </ul>
          </section>

          <section id={sections[6].id}>
            <h2>7. {sections[6].title}</h2>
            <p>
              Strona nie używa plików cookies analitycznych ani marketingowych. Kroje pisma są serwowane z naszego serwera, a mapa otwiera się w Google
              Maps dopiero po kliknięciu odnośnika „Wyznacz trasę”. Jeśli w przyszłości dodamy narzędzia analityczne, poprosimy o zgodę.
            </p>
          </section>

          <section id={sections[7].id}>
            <h2>8. {sections[7].title}</h2>
            <p>O istotnych zmianach polityki prywatności poinformujemy na tej stronie. Wersja z dnia: <Fill value={null} label="data" />.</p>
          </section>
        </div>
      </div>
    </>
  );
}

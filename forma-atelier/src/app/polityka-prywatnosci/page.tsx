import type { Metadata } from "next";

import { PageIntro } from "@/components/ui/PageIntro";
import { PageTransition } from "@/components/ui/PageTransition";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych w serwisie FORMA ATELIER (wersja demonstracyjna).",
  alternates: { canonical: "/polityka-prywatnosci" },
  robots: { index: false },
};

const sections = [
  {
    h: "Administrator danych",
    p: `Administratorem danych jest FORMA ATELIER, ${site.contact.street}, ${site.contact.city}, e-mail: ${site.contact.email}. To dane przykładowe — przed publikacją strony należy wpisać pełne dane firmy (nazwa, NIP, adres).`,
  },
  {
    h: "Jakie dane zbieramy",
    p: "Dane podane w formularzu kontaktowym: imię i nazwisko, adres e-mail, opcjonalnie numer telefonu, rodzaj i metraż nieruchomości, zakres współpracy oraz opis projektu.",
  },
  {
    h: "Cel i podstawa przetwarzania",
    p: "Dane przetwarzamy, aby odpowiedzieć na zapytanie i przygotować ofertę (art. 6 ust. 1 lit. a i b RODO). Podanie danych jest dobrowolne, ale niezbędne do udzielenia odpowiedzi.",
  },
  {
    h: "Okres przechowywania",
    p: "Dane przechowujemy przez czas prowadzenia korespondencji, a jeśli nie dojdzie do współpracy — nie dłużej niż 12 miesięcy od ostatniego kontaktu.",
  },
  {
    h: "Twoje prawa",
    p: "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, wycofania zgody w dowolnym momencie oraz wniesienia skargi do Prezesa UODO.",
  },
  {
    h: "Pliki cookies",
    p: "Serwis nie używa plików cookies analitycznych ani marketingowych. Jeśli zostaną dodane, polityka zostanie uzupełniona, a zgoda będzie zbierana przed ich użyciem.",
  },
];

export default function PrivacyPage() {
  return (
    <PageTransition>
      <PageIntro title="Polityka prywatności">
        <p>Wersja robocza przygotowana na potrzeby projektu demonstracyjnego. Przed publikacją wymaga weryfikacji prawnej.</p>
      </PageIntro>
      <div className="shell grid grid-cols-12 gap-x-6 pb-[var(--section)]">
        <div className="col-span-12 space-y-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-5">
          {sections.map((s) => (
            <section key={s.h} className="border-t border-line pt-6">
              <h2 className="t-h3">{s.h}</h2>
              <p className="t-body mt-4">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

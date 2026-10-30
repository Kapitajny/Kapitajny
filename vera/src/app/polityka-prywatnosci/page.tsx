import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Jak VÉRA Aesthetic Studio przetwarza dane osobowe przesłane przez stronę internetową.",
  alternates: { canonical: "/polityka-prywatnosci" },
  openGraph: { title: "Polityka prywatności | VÉRA Aesthetic Studio", url: "/polityka-prywatnosci" },
};

const toc = [
  { id: "administrator", label: "Kto odpowiada za Twoje dane" },
  { id: "dane", label: "Jakie dane przetwarzamy i po co" },
  { id: "odbiorcy", label: "Kto otrzymuje dane" },
  { id: "okres", label: "Jak długo je przechowujemy" },
  { id: "prawa", label: "Twoje prawa" },
  { id: "cookies", label: "Pliki cookies i analityka" },
  { id: "zmiany", label: "Zmiany polityki" },
];

export default function PrivacyPolicyPage() {
  const { contact, address } = siteConfig;
  return (
    <div className="shell grid gap-14 pb-28 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pt-[calc(var(--header-h)+5rem)]">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <Breadcrumbs
            items={[
              { href: "/", label: "Strona główna" },
              { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
            ]}
          />
          <h1 className="display mt-10 text-[clamp(3rem,6vw,5.5rem)] text-burgundy">Polityka prywatności</h1>
          <p className="mt-6 text-sm text-stone">Wersja robocza, ostatnia aktualizacja: 30 października 2026 r.</p>
          <nav aria-label="Sekcje" className="mt-10 hidden lg:block">
            <ol className="space-y-2.5 border-l border-line pl-5 text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-stone hover:text-burgundy">
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="lg:col-span-7 lg:col-start-6">
        <DemoNote className="mb-12">
          To wersja robocza przygotowana dla strony demonstracyjnej. Dane rejestrowe studia, podmioty przetwarzające i okresy przechowywania trzeba uzupełnić, a
          cały tekst powinien sprawdzić prawnik przed publikacją.
        </DemoNote>

        <div className="prose-vera">
          <h2 id="administrator" className="!mt-0">
            Kto odpowiada za Twoje dane
          </h2>
          <p>
            Administratorem danych osobowych przesłanych przez tę stronę jest {siteConfig.fullName}, {address.street}, {address.postalCode} {address.city} (dane
            rejestrowe do uzupełnienia). W sprawach dotyczących danych możesz pisać na <a href={`mailto:${contact.email}`}>{contact.email}</a> lub dzwonić pod
            numer <a href={contact.phoneHref}>{contact.phone}</a>.
          </p>

          <h2 id="dane">Jakie dane przetwarzamy i po co</h2>
          <h3>Formularz kontaktowy</h3>
          <p>
            Imię i nazwisko, adres e-mail, opcjonalnie numer telefonu oraz treść wiadomości – w celu udzielenia odpowiedzi. Podstawą prawną jest Twoja zgoda (art.
            6 ust. 1 lit. a RODO) oraz nasz prawnie uzasadniony interes polegający na odpowiadaniu na zapytania (art. 6 ust. 1 lit. f RODO).
          </p>
          <h3>Zapytanie o konsultację</h3>
          <p>
            Imię i nazwisko, numer telefonu, adres e-mail, interesujący Cię obszar lub zabieg, preferowane dni i godziny oraz opcjonalna wiadomość. Wykorzystujemy je,
            aby się z Tobą skontaktować i umówić konsultację (art. 6 ust. 1 lit. b RODO – działania na Twoje żądanie przed zawarciem umowy).
          </p>
          <p>
            Prosimy nie przesyłać przez stronę informacji o stanie zdrowia. Wywiad medyczny zbieramy osobiście, podczas konsultacji, i dokumentujemy zgodnie z
            przepisami o dokumentacji medycznej.
          </p>

          <h2 id="odbiorcy">Kto otrzymuje dane</h2>
          <p>
            Zgłoszenia z formularzy trafiają do recepcji studia za pośrednictwem dostawcy integracji technicznej oraz naszego dostawcy poczty e-mail (do wskazania).
            Podmioty te przetwarzają dane wyłącznie na nasze polecenie. Nie sprzedajemy danych i nie wykorzystujemy ich do celów reklamowych.
          </p>

          <h2 id="okres">Jak długo je przechowujemy</h2>
          <ul>
            <li>Wiadomości z formularza kontaktowego – przez czas potrzebny do załatwienia sprawy, nie dłużej niż 12 miesięcy.</li>
            <li>Zapytania o konsultację, które nie zakończyły się wizytą – do 6 miesięcy.</li>
            <li>Dane osób, które odwiedziły studio – zgodnie z przepisami o dokumentacji medycznej.</li>
          </ul>

          <h2 id="prawa">Twoje prawa</h2>
          <p>
            Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu. Jeśli przetwarzamy dane
            na podstawie zgody, możesz ją w każdej chwili wycofać – bez wpływu na wcześniejsze przetwarzanie. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych
            Osobowych (PUODO).
          </p>

          <h2 id="cookies">Pliki cookies i analityka</h2>
          <p>
            Strona korzysta wyłącznie z technicznych mechanizmów niezbędnych do jej działania. Nie używa plików cookies analitycznych ani reklamowych. Jeśli to się
            zmieni, zaktualizujemy tę politykę i wcześniej poprosimy Cię o zgodę.
          </p>

          <h2 id="zmiany">Zmiany polityki</h2>
          <p>Po każdej zmianie publikujemy na tej stronie nową wersję polityki wraz z datą.</p>
        </div>
      </div>
    </div>
  );
}

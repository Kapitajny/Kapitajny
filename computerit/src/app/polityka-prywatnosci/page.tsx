import type { Metadata } from "next";
import { Fill, LegalDocument, Section } from "@/components/legal/LegalDocument";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych przekazanych przez formularz kontaktowy ComputerIT.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PrivacyPolicyPage() {
  const email = siteConfig.contact.email;

  return (
    <LegalDocument
      title="Polityka prywatności"
      draftNote={
        <>
          Projekt dokumentu. Fragmenty oznaczone jako <Fill>do uzupełnienia</Fill> wymagają wpisania danych administratora i dostawców usług przed publikacją
          strony. Zalecamy konsultację treści z prawnikiem.
        </>
      }
    >
      <Section title="Administrator danych">
        <p>
          Administratorem danych osobowych jest <Fill>do uzupełnienia: imię i nazwisko lub nazwa firmy, adres, NIP</Fill> prowadzący działalność pod marką{" "}
          {siteConfig.name}.
        </p>
        <p>
          Kontakt w sprawach danych osobowych:{" "}
          {email ? (
            <a href={`mailto:${email}`} className="underline underline-offset-2">
              {email}
            </a>
          ) : (
            <Fill>do uzupełnienia: adres e-mail</Fill>
          )}
          .
        </p>
      </Section>

      <Section title="Jakie dane przetwarzamy">
        <p>
          Przez formularz kontaktowy przekazujesz: imię, adres e-mail, nazwę firmy (opcjonalnie), rodzaj projektu, przybliżony budżet oraz treść wiadomości.
          Podanie danych jest dobrowolne, ale bez nich nie można odpowiedzieć na zapytanie.
        </p>
        <p>
          Serwer strony może tymczasowo przetwarzać adres IP – w pamięci, wyłącznie po to, aby ograniczyć liczbę wiadomości wysyłanych z jednego adresu i
          chronić formularz przed spamem.
        </p>
      </Section>

      <Section title="Cel i podstawa przetwarzania">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            odpowiedź na zapytanie i przygotowanie oferty – na podstawie zgody (art. 6 ust. 1 lit. a RODO) oraz działań przed zawarciem umowy na Twoje żądanie
            (art. 6 ust. 1 lit. b RODO),
          </li>
          <li>ochrona strony i formularza przed nadużyciami – na podstawie prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO).</li>
        </ul>
      </Section>

      <Section title="Odbiorcy danych">
        <p>
          Dane mogą być przekazywane dostawcom usług technicznych, z których korzysta strona: firmie hostingowej oraz dostawcy poczty e-mail lub usługi
          przekazującej wiadomości z formularza – <Fill>do uzupełnienia: nazwy dostawców</Fill>. Dostawcy przetwarzają dane wyłącznie na polecenie
          administratora.
        </p>
      </Section>

      <Section title="Okres przechowywania">
        <p>
          Dane z formularza przechowujemy przez czas prowadzenia korespondencji, a następnie <Fill>do uzupełnienia: okres, np. 12 miesięcy</Fill>, chyba że
          dojdzie do zawarcia umowy – wtedy przez okres wynikający z przepisów prawa.
        </p>
      </Section>

      <Section title="Twoje prawa">
        <p>
          Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz wniesienia sprzeciwu. Zgodę możesz
          wycofać w dowolnym momencie – nie wpływa to na zgodność z prawem przetwarzania, które nastąpiło wcześniej. Przysługuje Ci także prawo wniesienia
          skargi do Prezesa Urzędu Ochrony Danych Osobowych.
        </p>
      </Section>

      <Section title="Pliki cookies i pamięć przeglądarki">
        <p>
          Strona nie używa plików cookies analitycznych ani marketingowych. Fonty są serwowane z tego samego serwera co strona, bez łączenia się z usługami
          zewnętrznymi.
        </p>
        <p>
          W pamięci Twojej przeglądarki (localStorage) zapisywana jest jedynie informacja, że animacja wejścia została już wyświetlona – dzięki temu przy
          kolejnych odwiedzinach jest krótsza. Możesz ją usunąć, czyszcząc dane witryny w przeglądarce.
        </p>
      </Section>
    </LegalDocument>
  );
}

import type { Metadata } from "next";
import { contactForm, site } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: `Zasady przetwarzania danych osobowych przez ${site.fullName}.`,
};

const fill = (v: string | null, placeholder: string) => v ?? `[${placeholder}]`;

export default function PrivacyPolicy() {
  const c = site.company;
  return (
    <LegalPage title="Polityka prywatności" updated="Wersja robocza">
      <h2>1. Administrator danych</h2>
      <p>
        Administratorem danych osobowych jest {fill(c.legalName, "pełna nazwa firmy")}, {fill(c.address, "adres siedziby")},
        NIP {fill(c.nip, "NIP")} (dalej: „{site.name}”). Kontakt w sprawach danych osobowych:{" "}
        {fill(site.contact.email, "adres e-mail do spraw danych osobowych")}.
      </p>

      <h2>2. Jakie dane zbieramy przez formularz</h2>
      <p>
        Formularz kontaktowy zbiera: wybrane usługi i pakiet, cel reklamy, orientacyjny budżet reklamowy, nazwę firmy, branżę,
        adres strony internetowej (opcjonalnie), imię, adres e-mail, numer telefonu i treść wiadomości (opcjonalnie).
      </p>

      <h2>3. Cel i podstawa przetwarzania</h2>
      <ul>
        <li>
          Odpowiedź na zgłoszenie, umówienie konsultacji i przygotowanie oferty: zgoda (art. 6 ust. 1 lit. a RODO) oraz
          działania przed zawarciem umowy na Twoje żądanie (art. 6 ust. 1 lit. b RODO).
        </li>
        <li>Ustalenie, dochodzenie lub obrona roszczeń: prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).</li>
      </ul>

      <h2>4. Odbiorcy danych</h2>
      <p>
        Dane z formularza są przesyłane przez usługę obsługi formularzy: {contactForm.endpoint ? "[nazwa dostawcy usługi formularzy]" : "[nazwa dostawcy usługi formularzy, po jej skonfigurowaniu]"}.
        Dane mogą być powierzane dostawcom hostingu i poczty elektronicznej na podstawie umów powierzenia. [Uzupełnij listę
        odbiorców i informację o ewentualnym przekazywaniu danych poza EOG.]
      </p>

      <h2>5. Okres przechowywania</h2>
      <p>
        Dane przechowujemy do czasu zakończenia rozmów o współpracy, a następnie przez [okres] na potrzeby ewentualnych
        roszczeń, lub do wycofania zgody, jeśli nastąpi wcześniej.
      </p>

      <h2>6. Twoje prawa</h2>
      <p>
        Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, wniesienia
        sprzeciwu oraz cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed jej
        cofnięciem). Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
      </p>

      <h2>7. Dobrowolność</h2>
      <p>Podanie danych jest dobrowolne, ale niezbędne, żebyśmy mogli odpowiedzieć na zgłoszenie.</p>

      <h2>8. Pliki cookies i statystyki</h2>
      <p>
        Strona w obecnej wersji nie używa plików cookies analitycznych ani marketingowych. [Zaktualizuj ten punkt, jeśli
        dodasz narzędzia analityczne, piksele reklamowe lub czat.]
      </p>
    </LegalPage>
  );
}

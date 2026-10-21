import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Informacja o przetwarzaniu danych osobowych i plikach cookies na stronie studia tańca Swoboda (wersja robocza).",
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Polityka prywatności" updated="21 października 2026 r.">
      <LegalSection title="1. Administrator danych">
        <p>
          Administratorem danych będzie podmiot prowadzący studio tańca {siteConfig.fullName}. <strong>[Do uzupełnienia: pełna nazwa, adres siedziby,
          NIP/REGON, dane kontaktowe.]</strong> W wersji demonstracyjnej kontakt w sprawach danych osobowych: {siteConfig.contact.email} (adres
          przykładowy).
        </p>
      </LegalSection>

      <LegalSection title="2. Jak działają formularze na tej stronie">
        <p>
          Formularz zapisu na lekcję próbną oraz formularz newslettera działają w <strong>trybie demonstracyjnym</strong>. Wpisane dane są
          sprawdzane wyłącznie w Twojej przeglądarce i nie są wysyłane na serwer, zapisywane w bazie danych ani przekazywane innym podmiotom. Po
          odświeżeniu strony znikają.
        </p>
      </LegalSection>

      <LegalSection title="3. Zakres i cele przetwarzania po uruchomieniu formularzy">
        <p>Po podłączeniu formularzy do systemu zapisów i newslettera studio będzie przetwarzać:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            dane z formularza zapisu (imię, e-mail, preferowany styl, poziom, dzień i treść wiadomości) – w celu odpowiedzi na zgłoszenie i
            umówienia zajęć (art. 6 ust. 1 lit. b RODO – działania przed zawarciem umowy);
          </li>
          <li>adres e-mail z formularza newslettera – w celu wysyłki informacji o zajęciach i wydarzeniach, na podstawie zgody (art. 6 ust. 1 lit. a RODO);</li>
          <li>dane z korespondencji e-mail i rozmów telefonicznych – w celu obsługi zapytań (art. 6 ust. 1 lit. f RODO).</li>
        </ul>
        <p>
          <strong>[Do uzupełnienia: okresy przechowywania danych, odbiorcy danych (np. dostawca poczty, systemu rezerwacji, narzędzia do
          newslettera).]</strong>
        </p>
      </LegalSection>

      <LegalSection title="4. Twoje prawa">
        <p>
          Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, prawo do przenoszenia danych, prawo
          sprzeciwu oraz prawo do cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem wcześniejszego przetwarzania). Przysługuje Ci
          także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.
        </p>
      </LegalSection>

      <LegalSection title="5. Pliki cookies i usługi zewnętrzne">
        <p>
          Strona w obecnej wersji nie używa plików cookies, narzędzi analitycznych ani pikseli reklamowych. Czcionki są serwowane z tego samego
          serwera co strona, a mapa w sekcji kontaktowej jest grafiką – nie łączy się z zewnętrznymi usługami mapowymi. Jeśli w przyszłości pojawią
          się takie narzędzia, ta sekcja zostanie zaktualizowana, a tam, gdzie wymaga tego prawo, poprosimy o zgodę.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

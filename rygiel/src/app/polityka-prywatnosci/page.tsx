import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/ui/Pending";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych w serwisie Rygiel: administrator, cele i podstawy prawne, okres przechowywania, odbiorcy danych i Twoje prawa.",
  path: "/polityka-prywatnosci",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Polityka prywatności"
      path="/polityka-prywatnosci"
      updated="2026-10-22"
      lede="Wyjaśniamy, jakie dane zbieramy przez serwis, w jakim celu i jak długo je przechowujemy. Zbieramy tylko to, co potrzebne do odpowiedzi na zapytanie."
    >
      <section aria-labelledby="administrator">
        <h2 id="administrator">1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest <Pending>pełna nazwa firmy</Pending> z&nbsp;siedzibą w&nbsp;<Pending>adres siedziby</Pending>, NIP{" "}
          <Pending>NIP</Pending>, REGON <Pending>REGON</Pending>.
        </p>
        <p>
          W sprawach dotyczących danych osobowych można się kontaktować pod adresem <Pending>adres e-mail do spraw danych osobowych</Pending>.
        </p>
      </section>

      <section aria-labelledby="zakres">
        <h2 id="zakres">2. Jakie dane przetwarzamy</h2>
        <p>Przez formularz kontaktowy zbieramy:</p>
        <ul>
          <li>imię,</li>
          <li>służbowy adres e-mail,</li>
          <li>nazwę firmy – jeśli zdecydujesz się ją podać,</li>
          <li>informację o&nbsp;interesującej Cię usłudze i&nbsp;orientacyjnym zakresie,</li>
          <li>treść wiadomości.</li>
        </ul>
        <p>
          Prosimy, aby w&nbsp;treści wiadomości nie przekazywać haseł, danych dostępowych ani danych szczególnych kategorii (np. o&nbsp;stanie zdrowia). Do ochrony
          formularza przed nadużyciami serwer przez krótki czas przechowuje w&nbsp;pamięci adres IP, z&nbsp;którego wysłano zapytanie – nie jest on zapisywany na
          stałe ani łączony z&nbsp;treścią wiadomości.
        </p>
      </section>

      <section aria-labelledby="cele">
        <h2 id="cele">3. Cele i&nbsp;podstawy prawne</h2>
        <ul>
          <li>
            Odpowiedź na zapytanie i&nbsp;przygotowanie oferty – działania na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO) lub nasz prawnie
            uzasadniony interes polegający na prowadzeniu korespondencji z&nbsp;osobami kontaktującymi się w&nbsp;imieniu firm (art. 6 ust. 1 lit. f RODO).
          </li>
          <li>Ochrona serwisu przed spamem i&nbsp;nadużyciami – nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).</li>
          <li>Ustalenie, dochodzenie lub obrona roszczeń – nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).</li>
        </ul>
      </section>

      <section aria-labelledby="okres">
        <h2 id="okres">4. Jak długo przechowujemy dane</h2>
        <p>
          Dane z&nbsp;formularza przechowujemy przez czas prowadzenia korespondencji, a&nbsp;następnie przez <Pending>okres przechowywania, np. 12 miesięcy</Pending>,
          chyba że dojdzie do zawarcia umowy – wtedy przez okres wynikający z&nbsp;umowy i&nbsp;przepisów prawa.
        </p>
      </section>

      <section aria-labelledby="odbiorcy">
        <h2 id="odbiorcy">5. Odbiorcy danych</h2>
        <p>Dane mogą być przekazywane podmiotom, które przetwarzają je na nasze zlecenie, wyłącznie w&nbsp;zakresie niezbędnym do świadczenia usług:</p>
        <ul>
          <li>
            dostawcy hostingu serwisu – <Pending>nazwa dostawcy i&nbsp;lokalizacja serwerów</Pending>,
          </li>
          <li>
            dostawcy usługi poczty elektronicznej, przez którą przekazywane są wiadomości z&nbsp;formularza – <Pending>nazwa dostawcy</Pending>.
          </li>
        </ul>
        <p>
          Jeśli którykolwiek z dostawców przetwarza dane poza Europejskim Obszarem Gospodarczym, odbywa się to na podstawie <Pending>podstawa transferu, np.
          decyzja stwierdzająca odpowiedni stopień ochrony lub standardowe klauzule umowne</Pending>.
        </p>
      </section>

      <section aria-labelledby="prawa">
        <h2 id="prawa">6. Twoje prawa</h2>
        <p>Masz prawo do:</p>
        <ul>
          <li>dostępu do swoich danych i&nbsp;otrzymania ich kopii,</li>
          <li>sprostowania danych,</li>
          <li>usunięcia danych,</li>
          <li>ograniczenia przetwarzania,</li>
          <li>przenoszenia danych – w&nbsp;zakresie, w&nbsp;jakim przetwarzanie odbywa się na podstawie umowy,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
          <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
        </ul>
        <p>Podanie danych jest dobrowolne, ale bez imienia, adresu e-mail i&nbsp;opisu sprawy nie możemy odpowiedzieć na zapytanie.</p>
      </section>

      <section aria-labelledby="automatyzacja">
        <h2 id="automatyzacja">7. Zautomatyzowane decyzje</h2>
        <p>
          Nie podejmujemy decyzji w&nbsp;sposób zautomatyzowany i&nbsp;nie profilujemy osób korzystających z&nbsp;serwisu. Automatyczne mechanizmy antyspamowe mogą odrzucić
          formularz wysłany w&nbsp;sposób typowy dla programów automatycznych – wtedy wyświetlamy komunikat i&nbsp;możesz wysłać go ponownie.
        </p>
      </section>

      <section aria-labelledby="cookies">
        <h2 id="cookies">8. Pliki cookies</h2>
        <p>
          Informacje o&nbsp;plikach cookies znajdziesz w&nbsp;<Link href="/polityka-cookies">polityce cookies</Link>.
        </p>
      </section>
    </LegalPage>
  );
}

import { company, fullAddress } from "@/content/company";
import { mailHref } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata = pageMetadata({
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych w serwisie Zakładu Mięsnego Wierzejki: formularz kontaktowy, rekrutacja, mapy Google.",
  path: "/polityka-prywatnosci",
});

const sections = [
  { id: "administrator", title: "Administrator danych" },
  { id: "cele", title: "Cele i podstawy przetwarzania" },
  { id: "odbiorcy", title: "Odbiorcy danych" },
  { id: "okres", title: "Jak długo przechowujemy dane" },
  { id: "prawa", title: "Twoje prawa" },
  { id: "mapy", title: "Mapy Google i pamięć przeglądarki" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/polityka-prywatnosci", label: "Polityka prywatności" }]}
        title="Polityka prywatności"
        lead={<p>Jak przetwarzamy dane osób, które kontaktują się z nami przez stronę.</p>}
      />

      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <nav aria-labelledby="spis" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <h2 id="spis" className="label text-muted">
              Spis treści
            </h2>
            <ol className="ui mt-3 space-y-2 text-[0.9375rem]">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="link">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="prose-doc max-w-[44rem] lg:col-span-8 lg:col-start-5">
          <DemoNote className="mb-10">
            Projekt dokumentu przygotowany w ramach koncepcji. Przed publikacją musi go zweryfikować prawnik lub inspektor ochrony danych
            firmy – w szczególności okresy przechowywania danych i listę dostawców usług.
          </DemoNote>

          <h2 id="administrator">Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest {company.legalName}, {fullAddress}, KRS {company.registry.krs}, NIP {company.registry.nip}.
            W sprawach ochrony danych napisz na adres <a href={mailHref(company.email, "Ochrona danych osobowych")}>{company.email}</a>.
          </p>

          <h2 id="cele">Cele i podstawy przetwarzania</h2>
          <h3>Formularz kontaktowy i zapytania handlowe</h3>
          <p>
            Dane z formularza (imię i nazwisko, e-mail, telefon, treść wiadomości, a w zapytaniach handlowych także nazwa firmy, NIP i region
            dostaw) przetwarzamy, aby odpowiedzieć na wiadomość i – w przypadku zapytań handlowych – przygotować ofertę. Podstawą jest Twoja
            zgoda (art. 6 ust. 1 lit. a RODO) oraz prawnie uzasadniony interes administratora polegający na prowadzeniu korespondencji (art. 6
            ust. 1 lit. f RODO), a przy zapytaniach handlowych – działania przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).
          </p>
          <h3>Rekrutacja</h3>
          <p>
            Zgłoszenia w sprawie pracy przetwarzamy w celu przeprowadzenia rekrutacji – w zakresie wskazanym w Kodeksie pracy (art. 6 ust. 1
            lit. c RODO), a w zakresie szerszym na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO).
          </p>
          <h3>Bezpieczeństwo serwisu</h3>
          <p>
            Serwer zapisuje techniczne dane o połączeniach (m.in. adres IP), aby chronić serwis przed nadużyciami, np. masową wysyłką
            formularza (art. 6 ust. 1 lit. f RODO).
          </p>

          <h2 id="odbiorcy">Odbiorcy danych</h2>
          <p>
            Dane mogą otrzymać dostawcy usług, z których korzystamy przy prowadzeniu serwisu: firma hostingowa oraz dostawca poczty
            elektronicznej lub systemu obsługi zgłoszeń, do którego trafiają wiadomości z formularza. Przetwarzają je wyłącznie na nasze
            polecenie.
          </p>

          <h2 id="okres">Jak długo przechowujemy dane</h2>
          <p>
            Korespondencję przechowujemy przez czas potrzebny do obsługi sprawy, a następnie przez okres przedawnienia ewentualnych roszczeń.
            Dane z rekrutacji przechowujemy do jej zakończenia, a za Twoją zgodą – także na potrzeby przyszłych rekrutacji.
          </p>

          <h2 id="prawa">Twoje prawa</h2>
          <ul>
            <li>dostęp do danych i otrzymanie ich kopii,</li>
            <li>sprostowanie, usunięcie lub ograniczenie przetwarzania,</li>
            <li>sprzeciw wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
            <li>przenoszenie danych,</li>
            <li>cofnięcie zgody w dowolnym momencie – bez wpływu na zgodność z prawem wcześniejszego przetwarzania,</li>
            <li>skarga do Prezesa Urzędu Ochrony Danych Osobowych.</li>
          </ul>

          <h2 id="mapy">Mapy Google i pamięć przeglądarki</h2>
          <p>
            Serwis sam nie zapisuje plików cookie. Mapy Google wczytujemy dopiero po kliknięciu przycisku „Wczytaj mapę Google” – wtedy Google
            Ireland Ltd. otrzymuje Twój adres IP i może zapisywać własne pliki cookie zgodnie ze swoją polityką prywatności. Twój wybór
            zapamiętujemy w pamięci przeglądarki (localStorage); możesz go cofnąć przyciskiem „Wyłącz mapę” pod mapą albo czyszcząc dane
            witryny w przeglądarce.
          </p>
        </div>
      </div>
    </>
  );
}

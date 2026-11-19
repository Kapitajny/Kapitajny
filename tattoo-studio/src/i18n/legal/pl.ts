import type { LegalContent } from "./types";

export const legalPl: LegalContent = {
  tokenLabels: { companyName: "nazwa firmy", companyAddress: "adres siedziby", nip: "NIP", regon: "REGON", email: "adres e-mail", phone: "telefon" },
  terms: {
    sections: [
      {
        heading: "1. Postanowienia ogólne",
        blocks: [
          {
            p: "Regulamin określa zasady korzystania ze strony internetowej studia {{studio}} oraz z formularza konsultacji „Zaprojektuj swój tatuaż”. Usługodawcą jest {{companyName}}, {{companyAddress}}, NIP: {{nip}}. Kontakt: {{email}}, {{phone}}.",
          },
        ],
      },
      {
        heading: "2. Wymagania techniczne",
        blocks: [{ p: "Do korzystania ze strony potrzebne jest urządzenie z dostępem do internetu i aktualną przeglądarką z włączoną obsługą JavaScript." }],
      },
      {
        heading: "3. Formularz konsultacji",
        blocks: [
          {
            ol: [
              "Formularz służy do przekazania studiu informacji o pomyśle na tatuaż w celu przygotowania konsultacji.",
              "Wysłanie formularza nie jest rezerwacją terminu ani zawarciem umowy. Termin i warunki wykonania tatuażu ustalane są indywidualnie ze studiem.",
              "Podany w formularzu budżet i preferowany termin mają charakter orientacyjny.",
              "Użytkownik odpowiada za prawdziwość podanych danych i za prawa do przesyłanych zdjęć.",
              "Zabronione jest przesyłanie treści bezprawnych, obraźliwych lub naruszających prawa osób trzecich.",
            ],
          },
        ],
      },
      {
        heading: "4. Kalkulator ceny",
        blocks: [
          {
            p: "Kalkulator w sekcji „Cennik” pokazuje szacunkowy przedział ceny. Nie stanowi oferty w rozumieniu Kodeksu cywilnego. Ostateczną cenę ustala tatuator po indywidualnej wycenie projektu.",
          },
        ],
      },
      {
        heading: "5. Zasady współpracy",
        blocks: [{ p: "[[zasady studia: zadatki, odwoływanie i przekładanie wizyt, poprawki, wiek klientów, prawa autorskie do projektów]]" }],
      },
      {
        heading: "6. Reklamacje dotyczące strony",
        blocks: [{ p: "Uwagi i reklamacje dotyczące działania strony można zgłaszać na adres {{email}}. Odpowiadamy w terminie [[termin odpowiedzi, np. 14 dni]]." }],
      },
      { heading: "7. Dane osobowe", blocks: [{ p: "Zasady przetwarzania danych osobowych opisuje {{link:privacy}}." }] },
      { heading: "8. Postanowienia końcowe", blocks: [{ p: "[[zasady zmiany regulaminu i data wejścia w życie]]" }] },
    ],
  },
  privacy: {
    sections: [
      {
        heading: "1. Administrator danych",
        blocks: [
          {
            p: "Administratorem Twoich danych osobowych jest {{companyName}}, {{companyAddress}}, NIP: {{nip}}, REGON: {{regon}}. Kontakt w sprawach danych osobowych: {{email}}.",
          },
        ],
      },
      {
        heading: "2. Jakie dane przetwarzamy",
        blocks: [
          { p: "Przez formularz „Zaprojektuj swój tatuaż” przekazujesz nam:" },
          {
            ul: [
              "dane kontaktowe: imię i nazwisko, adres e-mail, opcjonalnie numer telefonu,",
              "opis pomysłu na tatuaż, jego znaczenia i preferencji (styl, miejsce na ciele, rozmiar, budżet, preferowany termin),",
              "dołączone zdjęcia i szkice inspiracji.",
            ],
          },
          {
            p: "Prosimy, aby nie umieszczać w formularzu informacji o zdrowiu ani innych szczególnie wrażliwych danych, jeśli nie są niezbędne. Jeżeli przesyłasz zdjęcia ciała lub innych osób, upewnij się, że masz do tego prawo. Zdjęcia są przed wysłaniem zmniejszane w przeglądarce, a metadane (w tym lokalizacja GPS) są usuwane.",
          },
        ],
      },
      {
        heading: "3. Cele i podstawy prawne",
        blocks: [
          {
            ul: [
              "odpowiedź na zapytanie i przygotowanie konsultacji, czyli działania na Twoje żądanie przed zawarciem umowy — art. 6 ust. 1 lit. b RODO,",
              "ochrona formularza przed nadużyciami i spamem (np. ograniczenie liczby zgłoszeń z jednego adresu IP) — prawnie uzasadniony interes administratora, art. 6 ust. 1 lit. f RODO,",
              "ewentualne ustalenie, dochodzenie lub obrona roszczeń — art. 6 ust. 1 lit. f RODO.",
            ],
          },
          { p: "Nie wykorzystujemy danych z formularza do marketingu i nie zbieramy w nim zgód marketingowych." },
        ],
      },
      {
        heading: "4. Odbiorcy danych",
        blocks: [
          {
            p: "Dane mogą być powierzane podmiotom, które świadczą dla nas usługi techniczne: [[dostawca hostingu strony, dostawca poczty e-mail, ewentualnie system obsługi zgłoszeń i Cloudflare Turnstile (ochrona przed spamem)]]. Podmioty te przetwarzają dane wyłącznie na nasze polecenie. [[informacja, czy dane są przekazywane poza Europejski Obszar Gospodarczy, i na jakiej podstawie]]",
          },
        ],
      },
      { heading: "5. Okres przechowywania", blocks: [{ p: "[[jak długo studio przechowuje zgłoszenia i załączniki, jeśli nie dojdzie do wizyty, oraz po jej realizacji]]" }] },
      {
        heading: "6. Twoje prawa",
        blocks: [
          { p: "Masz prawo do:" },
          {
            ul: [
              "dostępu do swoich danych i otrzymania ich kopii,",
              "sprostowania danych,",
              "usunięcia danych,",
              "ograniczenia przetwarzania,",
              "przenoszenia danych,",
              "sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,",
              "wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).",
            ],
          },
          {
            p: "Podanie danych jest dobrowolne, ale bez imienia i nazwiska, adresu e-mail oraz opisu pomysłu nie będziemy mogli odpowiedzieć na zapytanie.",
          },
        ],
      },
      {
        heading: "7. Pliki cookies i pamięć przeglądarki",
        blocks: [
          {
            p: "Strona nie używa plików cookies analitycznych ani marketingowych. Jeśli samodzielnie wybierzesz język strony, zapamiętujemy ten wybór w pliku cookie „lang” i w pamięci przeglądarki (localStorage) przez rok — wyłącznie po to, aby przy kolejnej wizycie wyświetlić stronę w wybranym języku.",
          },
          {
            p: "Formularz zapisuje wpisane odpowiedzi w pamięci sesji przeglądarki (sessionStorage), aby nie zniknęły przy odświeżeniu strony. Dane te pozostają na Twoim urządzeniu i są usuwane po wysłaniu formularza lub zamknięciu karty. [[aktualizacja tej części, jeśli studio doda analitykę lub inne narzędzia]]",
          },
        ],
      },
      { heading: "8. Kontakt", blocks: [{ p: "W sprawach dotyczących danych osobowych napisz na {{email}}. Zasady korzystania ze strony opisuje {{link:terms}}." }] },
    ],
  },
};

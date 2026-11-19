import type { Locale } from "@/i18n/config";
import type { LegalDoc } from "@/i18n/routes";
import { BOOKING_RULES } from "@/lib/booking/rules";

/**
 * ★ PROJEKTY dokumentów prawnych. Przed publikacją: uzupełnij dane w [nawiasach kwadratowych]
 * i zleć weryfikację prawnikowi. Strona wyświetla przy nich ostrzeżenie „projekt dokumentu”.
 */
export interface LegalContent {
  title: string;
  updated: string;
  sections: { h: string; p?: string[]; list?: string[] }[];
}

const controllerPl = "[Nazwa firmy / imię i nazwisko właściciela], [adres siedziby], NIP [__________]";
const controllerEn = "[Company name / owner's full name], [registered address], tax ID (NIP) [__________]";
const cutoff = BOOKING_RULES.selfServiceCutoffHours;

export const legal: Record<Locale, Record<LegalDoc, LegalContent>> = {
  pl: {
    privacy: {
      title: "Polityka prywatności",
      updated: "2026-11-19",
      sections: [
        { h: "Administrator danych", p: [`Administratorem danych osobowych jest ${controllerPl} („RIFT Studio”). Kontakt w sprawach danych: studio@riftstudio.pl.`] },
        {
          h: "Jakie dane zbieramy",
          list: [
            "Formularz rezerwacji: imię lub pseudonim, adres e-mail, opcjonalnie telefon, wybrany termin, usługa i treść wiadomości.",
            "Panel zarządzania rezerwacją: identyfikator rezerwacji powiązany z linkiem wysłanym e-mailem (w bazie przechowujemy wyłącznie skrót kryptograficzny linku).",
            "Dane techniczne: adres IP w logach serwera i do ochrony przed nadużyciami (limit żądań).",
          ],
        },
        {
          h: "Cele i podstawy prawne",
          list: [
            "Obsługa rezerwacji i kontakt w jej sprawie – art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy i jej wykonanie).",
            "Bezpieczeństwo strony i ochrona przed nadużyciami – art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes).",
            "Rozliczenia i obowiązki księgowe – art. 6 ust. 1 lit. c RODO.",
          ],
        },
        {
          h: "Odbiorcy danych",
          p: [
            "Dane mogą być powierzone dostawcom usług niezbędnych do działania strony: hostingu [nazwa dostawcy], bazy danych [np. Supabase Inc.] oraz wysyłki e-maili [np. Resend]. Z każdym podmiotem zawierana jest umowa powierzenia przetwarzania danych.",
          ],
        },
        { h: "Okres przechowywania", p: ["Dane rezerwacji przechowujemy przez 12 miesięcy od daty sesji, a dane rozliczeniowe – przez okres wymagany przepisami podatkowymi."] },
        {
          h: "Twoje prawa",
          p: ["Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz sprzeciwu. Przysługuje Ci także skarga do Prezesa Urzędu Ochrony Danych Osobowych."],
        },
        { h: "Mapa", p: ["Mapa dojazdu jest ładowana z serwisu OpenStreetMap wyłącznie po kliknięciu „Pokaż mapę”. Wtedy OpenStreetMap Foundation otrzymuje Twój adres IP."] },
      ],
    },
    cookies: {
      title: "Polityka cookies",
      updated: "2026-11-19",
      sections: [
        { h: "Czy strona używa cookies?", p: ["Strona nie używa cookies analitycznych ani reklamowych i nie łączy się z sieciami reklamowymi."] },
        {
          h: "Co zapisujemy w przeglądarce",
          list: [
            "rift_admin – ciasteczko sesji panelu administracyjnego (tylko dla pracowników studia, ważne 12 godzin, niezbędne).",
            "rift-map-consent – zapis w pamięci przeglądarki (localStorage), że zgodziłeś się na wyświetlenie mapy OpenStreetMap.",
          ],
        },
        { h: "Jak usunąć dane", p: ["Możesz w każdej chwili usunąć ciasteczka i dane witryny w ustawieniach przeglądarki. Mapa ponownie poprosi wtedy o zgodę."] },
      ],
    },
    terms: {
      title: "Regulamin",
      updated: "2026-11-19",
      sections: [
        { h: "Usługodawca", p: [`Usługi świadczy ${controllerPl}, prowadzący studio nagrań RIFT Studio w Pruszkowie.`] },
        { h: "Zakres usług", p: ["Studio świadczy usługi nagrywania wokalu, produkcji muzycznej, miksu i masteringu oraz nagrań podcastów i voice-over. Zakres i ceny są opisane w cenniku na stronie."] },
        { h: "Ceny i płatności", p: ["Ceny są cenami brutto w złotych. Płatność następuje w studiu po zakończeniu sesji, chyba że strony ustalą inaczej. Wycena prac miksu i produkcji może zostać doprecyzowana po zapoznaniu się z materiałem."] },
        {
          h: "Prawa do nagrań",
          p: [
            "Prawa do tekstów i wykonań należą do artysty. Prawa do bitów wyprodukowanych przez studio określa odrębna umowa licencyjna. Studio może wykorzystać fragment realizacji w portfolio wyłącznie za pisemną zgodą artysty.",
          ],
        },
        { h: "Reklamacje", p: ["Reklamacje można zgłaszać e-mailem w ciągu 14 dni od wydania plików. Odpowiadamy w ciągu 14 dni."] },
      ],
    },
    booking: {
      title: "Regulamin rezerwacji",
      updated: "2026-11-19",
      sections: [
        {
          h: "Składanie rezerwacji",
          list: [
            "Rezerwację składasz przez formularz na stronie, wybierając usługę, długość sesji, dzień i godzinę.",
            "Wybrany termin jest blokowany od razu po wysłaniu formularza. Studio potwierdza rezerwację e-mailem w ciągu 24 godzin.",
            "Studio może odmówić potwierdzenia (np. z przyczyn technicznych) – otrzymasz wtedy wiadomość z informacją i propozycją innego terminu.",
          ],
        },
        {
          h: "Zmiana terminu i anulowanie",
          list: [
            `Zmiana terminu i anulowanie są bezpłatne do ${cutoff} godzin przed sesją – przez link z e-maila potwierdzającego.`,
            `Później zmiany są możliwe wyłącznie telefonicznie. Przy nieobecności bez uprzedzenia studio może pobrać opłatę za pierwszą godzinę sesji [do decyzji właściciela].`,
            "Nowy termin po zmianie ponownie czeka na potwierdzenie studia.",
          ],
        },
        { h: "Spóźnienia", p: ["Sesja kończy się o zarezerwowanej godzinie – spóźnienie skraca czas nagrania. Przedłużenie sesji jest możliwe, jeśli kolejny termin jest wolny."] },
        { h: "Zasady w studiu", p: ["W studiu obowiązuje zakaz palenia. Za szkody w sprzęcie wyrządzone umyślnie odpowiada osoba, która je spowodowała."] },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy policy",
      updated: "2026-11-19",
      sections: [
        { h: "Data controller", p: [`The data controller is ${controllerEn} ("RIFT Studio"). Contact for data matters: studio@riftstudio.pl.`] },
        {
          h: "What we collect",
          list: [
            "Booking form: name or artist name, email address, optional phone number, chosen time, service and message.",
            "Booking management: a booking identifier linked to the link we email you (the database stores only a cryptographic hash of the link).",
            "Technical data: IP address in server logs and for abuse protection (rate limiting).",
          ],
        },
        {
          h: "Purposes and legal bases",
          list: [
            "Handling your booking and contacting you about it – Art. 6(1)(b) GDPR (steps before entering into a contract and its performance).",
            "Website security and abuse protection – Art. 6(1)(f) GDPR (legitimate interest).",
            "Invoicing and accounting obligations – Art. 6(1)(c) GDPR.",
          ],
        },
        {
          h: "Recipients",
          p: ["Data may be entrusted to providers needed to run the website: hosting [provider name], database [e.g. Supabase Inc.] and email delivery [e.g. Resend]. A data processing agreement is signed with each provider."],
        },
        { h: "Retention", p: ["We keep booking data for 12 months after the session date and billing data for the period required by tax law."] },
        { h: "Your rights", p: ["You have the right to access, rectify, erase, restrict and port your data and to object to processing. You may also lodge a complaint with the Polish data protection authority (UODO)."] },
        { h: "Map", p: ["The map is loaded from OpenStreetMap only after you click “Show map”. OpenStreetMap Foundation then receives your IP address."] },
      ],
    },
    cookies: {
      title: "Cookie policy",
      updated: "2026-11-19",
      sections: [
        { h: "Does the site use cookies?", p: ["The site uses no analytics or advertising cookies and does not connect to ad networks."] },
        {
          h: "What we store in your browser",
          list: [
            "rift_admin – session cookie for the admin panel (studio staff only, valid for 12 hours, strictly necessary).",
            "rift-map-consent – a localStorage entry recording that you agreed to show the OpenStreetMap map.",
          ],
        },
        { h: "How to remove it", p: ["You can delete cookies and site data in your browser settings at any time. The map will then ask for consent again."] },
      ],
    },
    terms: {
      title: "Terms of service",
      updated: "2026-11-19",
      sections: [
        { h: "Provider", p: [`Services are provided by ${controllerEn}, operating the RIFT Studio recording studio in Pruszków, Poland.`] },
        { h: "Services", p: ["The studio provides vocal recording, music production, mixing and mastering, and podcast and voice-over recording. Scope and prices are described in the pricing section."] },
        { h: "Prices and payment", p: ["Prices are gross amounts in PLN. Payment is made at the studio after the session unless agreed otherwise. Quotes for mixing and production may be refined after reviewing the material."] },
        { h: "Rights to recordings", p: ["Rights to lyrics and performances belong to the artist. Rights to beats produced by the studio are set out in a separate licence agreement. The studio may use excerpts in its portfolio only with the artist's written consent."] },
        { h: "Complaints", p: ["Complaints can be sent by email within 14 days of receiving the files. We reply within 14 days."] },
      ],
    },
    booking: {
      title: "Booking terms",
      updated: "2026-11-19",
      sections: [
        {
          h: "Making a booking",
          list: [
            "You book through the form on the website by choosing a service, session length, day and time.",
            "The chosen slot is held as soon as you send the form. The studio confirms the booking by email within 24 hours.",
            "The studio may decline to confirm (e.g. for technical reasons); you will then receive a message with an explanation and an alternative time.",
          ],
        },
        {
          h: "Changes and cancellations",
          list: [
            `Changing or cancelling is free up to ${cutoff} hours before the session, using the link in your confirmation email.`,
            "After that, changes are possible by phone only. For a no-show without notice, the studio may charge for the first hour of the session [owner to decide].",
            "A changed booking waits for the studio's confirmation again.",
          ],
        },
        { h: "Late arrival", p: ["The session ends at the booked time, so arriving late shortens your recording time. Extending a session is possible if the next slot is free."] },
        { h: "Studio rules", p: ["Smoking is not allowed in the studio. Anyone who intentionally damages equipment is liable for the damage."] },
      ],
    },
  },
};

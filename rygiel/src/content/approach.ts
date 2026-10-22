import { typesetDeep } from "@/lib/typography";
import type { Faq } from "./services";

export const processSteps: { title: string; text: string; deliverable: string }[] = typesetDeep([
  {
    title: "Rozmowa wstępna",
    text: "Opowiadasz, co nie działa albo co Cię niepokoi. Ustalamy, czy jesteśmy właściwym partnerem i od czego zacząć.",
    deliverable: "notatkę z ustaleniami i propozycję pierwszego kroku",
  },
  {
    title: "Przegląd środowiska",
    text: "Spisujemy urządzenia, konta, usługi, kopie i dostawców. Na tym etapie niczego nie zmieniamy w systemach.",
    deliverable: "inwentaryzację i listę ryzyk z priorytetami",
  },
  {
    title: "Plan i wycena",
    text: "Każde zadanie ma zakres, uzasadnienie i koszt. Decydujesz, co realizujemy teraz, a co później.",
    deliverable: "plan prac z harmonogramem",
  },
  {
    title: "Wdrożenie",
    text: "Wprowadzamy zmiany etapami, w uzgodnionych oknach czasowych, z planem wycofania dla zmian ryzykownych.",
    deliverable: "dziennik zmian i zaktualizowaną dokumentację",
  },
  {
    title: "Utrzymanie i przeglądy",
    text: "Monitorujemy środowisko, obsługujemy zgłoszenia i regularnie sprawdzamy, czy zabezpieczenia nadal działają.",
    deliverable: "raport miesięczny i przegląd kwartalny",
  },
]);

export const securityPrinciples: { title: string; text: string; practice: string }[] = typesetDeep([
  {
    title: "Najpierw wiedza, potem narzędzia",
    text: "Nie da się chronić czegoś, o czym nie wiadomo. Zanim zaproponujemy jakiekolwiek oprogramowanie, spisujemy konta, urządzenia, dane i dostawców.",
    practice: "Inwentaryzacja jest pierwszym produktem każdej współpracy.",
  },
  {
    title: "Tylko potrzebne uprawnienia",
    text: "Każde konto ma dostęp wyłącznie do tego, czego potrzebuje do pracy. Uprawnienia administracyjne są oddzielone od kont używanych na co dzień.",
    practice: "Osobne konta administracyjne zabezpieczone kluczem sprzętowym.",
  },
  {
    title: "Testy wyłącznie za pisemną zgodą",
    text: "Testy bezpieczeństwa wykonujemy tylko w uzgodnionym zakresie i terminie, za pisemną zgodą osoby uprawnionej do dysponowania systemem.",
    practice: "Dokument zasad testu podpisany przed jego rozpoczęciem.",
  },
  {
    title: "Kopia istnieje dopiero po teście odtworzenia",
    text: "Zadanie kopii zakończone sukcesem nie oznacza jeszcze, że dane da się odzyskać. Sprawdzamy to, odtwarzając je.",
    practice: "Protokół testu z zakresem, datą i czasem odtworzenia.",
  },
  {
    title: "Każda zmiana zostawia ślad",
    text: "Pracujemy na imiennych kontach, a każdą zmianę zapisujemy w dzienniku. Wiesz, kto, kiedy i dlaczego zmienił konfigurację.",
    practice: "Nasze dostępy możesz w każdej chwili przejrzeć i wyłączyć.",
  },
]);

export const acceptanceProtocol: { result: string; check: string }[] = typesetDeep([
  { result: "Pełna lista urządzeń, kont, licencji i dostawców", check: "Dostajesz dokument i możesz porównać go ze stanem faktycznym." },
  { result: "Lista ryzyk z priorytetami i planem działań", check: "Każde ryzyko ma uzasadnienie, właściciela i termin." },
  { result: "Drugi składnik logowania na kontach firmowych", check: "Raport metod logowania z panelu administracyjnego." },
  { result: "Kopia zapasowa sprawdzona odtworzeniem", check: "Protokół testu: co odtworzono, kiedy i ile to trwało." },
  { result: "Jeden kanał zgłoszeń z historią", check: "Rejestr zgłoszeń z numerem, statusem i osobą odpowiedzialną." },
  { result: "Dziennik zmian w środowisku", check: "Każda zmiana ma datę, autora i powód." },
]);

export const generalFaq: Faq[] = typesetDeep([
  {
    question: "Dla jakich firm pracujecie?",
    answer:
      "Dla małych i średnich firm, od kilku do około 150 stanowisk: biur rachunkowych, kancelarii, firm usługowych, sklepów internetowych i placówek, które przetwarzają dane klientów lub pacjentów.",
  },
  {
    question: "Czy można zacząć od jednej usługi?",
    answer:
      "Tak. Najczęściej zaczynamy od przeglądu środowiska albo audytu bezpieczeństwa. Jego wynik pokazuje, czy i w jakim zakresie warto rozmawiać o stałej współpracy.",
  },
  {
    question: "Jak wyceniacie współpracę?",
    answer:
      "Stałe utrzymanie rozliczamy miesięczną opłatą zależną od liczby stanowisk, serwerów i zakresu odpowiedzialności. Projekty, takie jak audyt czy migracja, wyceniamy osobno po przeglądzie środowiska.",
  },
  {
    question: "Pracujecie zdalnie czy na miejscu?",
    answer:
      "Większość zadań wykonujemy zdalnie, przez bezpieczne narzędzia zarządzania. Na miejscu pracujemy przy sprzęcie, sieci i wdrożeniach, które tego wymagają.",
  },
  {
    question: "Co stanie się z dostępami, gdy zakończymy współpracę?",
    answer:
      "Przekazujemy aktualną dokumentację i hasła w uzgodniony, bezpieczny sposób, a następnie wyłączamy nasze konta. Procedurę zakończenia współpracy zapisujemy w umowie już na początku.",
  },
  {
    question: "Co zrobić, jeśli właśnie trwa incydent?",
    answer:
      "Formularz kontaktowy nie jest kanałem alarmowym. Odłącz podejrzane urządzenie od sieci, ale go nie wyłączaj, zmień hasła z innego, zaufanego urządzenia i zgłoś incydent do CERT Polska przez stronę incydent.cert.pl. Potem skontaktuj się z nami.",
  },
]);

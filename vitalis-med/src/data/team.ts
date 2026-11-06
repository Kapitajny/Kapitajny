import type { IconName } from "@/components/ui/Icons";

/** ★ Stanowiska w zespole – bez nazwisk i kwalifikacji konkretnych osób. */
export const teamRoles: { title: string; text: string; icon: IconName }[] = [
  { title: "Ratownicy medyczni", text: "Trzon naszych zespołów. Wykonują medyczne czynności ratunkowe i opiekują się pacjentem w czasie transportu.", icon: "pulse" },
  { title: "Lekarze systemu", text: "Kierują zespołami specjalistycznymi i podejmują decyzje medyczne przy transporcie pacjentów w ciężkim stanie.", icon: "stethoscope" },
  { title: "Pielęgniarki", text: "Zapewniają opiekę pielęgniarską w czasie przewozu, także pacjentom wymagającym stałego monitorowania.", icon: "cross" },
  { title: "Kierowcy i pracownicy transportu", text: "Prowadzą ambulanse i dbają o bezpieczeństwo przejazdu, sprawność pojazdów oraz pomoc przy przenoszeniu pacjenta.", icon: "steering" },
  { title: "Dyspozytorzy", text: "Przyjmują zgłoszenia, planują przejazdy i są w stałym kontakcie z zespołami – całą dobę.", icon: "headset" },
  { title: "Koordynatorzy medyczni", text: "Organizują przewozy z placówkami medycznymi, kwalifikują zlecenia i czuwają nad jakością świadczeń.", icon: "clipboard" },
];

/** ★ Sekcja „Dlaczego my?”. */
export const reasons: { title: string; text: string }[] = [
  { title: "Rozbudowana flota 20 ambulansów", text: "Pojazdy typu T, S i P pozwalają dobrać ambulans do stanu pacjenta i charakteru przewozu." },
  { title: "Wykwalifikowany personel", text: "Ratownicy medyczni, lekarze, pielęgniarki i kierowcy, którzy regularnie podnoszą swoje kwalifikacje." },
  { title: "Nowoczesne wyposażenie medyczne", text: "Sprzęt do monitorowania, wentylacji i defibrylacji utrzymywany w pełnej sprawności i regularnie serwisowany." },
  { title: "Profesjonalna organizacja transportu", text: "Całodobowa dyspozytornia, jasne zasady zamawiania i potwierdzanie każdego zlecenia." },
  { title: "Indywidualne podejście do pacjenta", text: "Każdy przejazd planujemy z myślą o komforcie, godności i bezpieczeństwie pacjenta oraz jego bliskich." },
  { title: "Świadczenia w ramach NFZ", text: "Realizujemy świadczenia finansowane przez NFZ w zakresie zawartego kontraktu." },
];

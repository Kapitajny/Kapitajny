/**
 * ★ Cennik usług komercyjnych (prywatnych). Ceny są PRZYKŁADOWE i wymagają weryfikacji.
 * Świadczenia finansowane przez NFZ celowo nie występują w tym cenniku.
 */

export interface PriceItem {
  service: string;
  scope: string;
  /** Cena w złotych („od”), albo `null` = wycena indywidualna. */
  priceFrom: number | null;
  serviceSlug: string;
}

export const priceList: PriceItem[] = [
  { service: "Transport sanitarny", scope: "Przejazd ambulansem typu T w obrębie miasta", priceFrom: 350, serviceSlug: "transport-sanitarny" },
  { service: "Transport medyczny", scope: "Przejazd z opieką personelu medycznego", priceFrom: 500, serviceSlug: "prywatny-transport-medyczny" },
  { service: "Transport pacjenta leżącego", scope: "Nosze, zniesienie i wniesienie pacjenta", priceFrom: 450, serviceSlug: "transport-pacjentow-lezacych" },
  { service: "Transport międzymiastowy", scope: "Przejazdy poza miejscowość odbioru", priceFrom: null, serviceSlug: "prywatny-transport-medyczny" },
  { service: "Zabezpieczenie imprez", scope: "Zespół medyczny z ambulansem, do 4 godzin", priceFrom: 900, serviceSlug: "zabezpieczenie-imprez" },
  { service: "Obsługa medyczna wydarzeń", scope: "Wydarzenia wielodniowe i imprezy masowe", priceFrom: null, serviceSlug: "zabezpieczenie-imprez" },
  { service: "Transport międzynarodowy", scope: "Po kwalifikacji pacjenta i analizie trasy", priceFrom: null, serviceSlug: "transport-miedzynarodowy" },
];

export const priceFactors = [
  { title: "Odległość i czas", text: "Długość trasy, czas oczekiwania zespołu oraz pora realizacji (noc, święta)." },
  { title: "Rodzaj ambulansu", text: "Pojazd typu T, P lub S – dobierany do stanu pacjenta i charakteru przewozu." },
  { title: "Skład zespołu", text: "Liczba osób w zespole i ich kwalifikacje, np. udział lekarza lub pielęgniarki." },
  { title: "Potrzeby pacjenta", text: "Konieczność zniesienia lub wniesienia pacjenta, dodatkowy sprzęt, przejazd opiekuna." },
];

export function formatPrice(item: PriceItem): string {
  return item.priceFrom === null ? "wycena indywidualna" : `od ${item.priceFrom.toLocaleString("pl-PL")} zł`;
}

/**
 * ★ CENNIK
 *
 * Ceny i czas trwania wpisz jako tekst, np. price: "180 zł", duration: "50 min".
 * `null` = „do uzupełnienia”. Nie wpisujemy cen, których gabinet nie potwierdził.
 * Pozycję pakietów usuń, jeśli gabinet ich nie oferuje.
 */

export interface PriceItem {
  title: string;
  note?: string;
  duration: string | null;
  price: string | null;
}

export const PRICE_LIST: PriceItem[] = [
  { title: "Konsultacja fizjoterapeutyczna", note: "Pierwsza wizyta: rozmowa, ocena funkcjonalna i omówienie planu", duration: null, price: null },
  { title: "Fizjoterapia indywidualna", note: "Kolejne wizyty w ramach ustalonego planu terapii", duration: null, price: null },
  { title: "Masaż leczniczy", duration: null, price: null },
  { title: "Rehabilitacja pooperacyjna", note: "Wizyta zgodna z zaleceniami lekarza prowadzącego", duration: null, price: null },
  { title: "Pakiet kilku wizyt", note: "Jeśli gabinet oferuje pakiety – liczba wizyt i zasady do uzupełnienia", duration: null, price: null },
];

/** Akceptowane formy płatności, np. ["gotówka", "karta płatnicza", "BLIK"]. `null` = do uzupełnienia. */
export const PAYMENT_METHODS: string[] | null = null;

import { siGoogleads, siMeta, siTiktok, siYoutube } from "simple-icons";

export type ServiceId = "meta" | "google" | "youtube" | "tiktok";

export type Service = {
  id: ServiceId;
  name: string;
  /** Krótka nazwa kanału w siatce planu. */
  channel: string;
  where: string;
  description: string;
  useCases: string[];
  benefits: string[];
  /** Kiedy ten kanał zwykle NIE jest dobrym pierwszym wyborem. */
  notFor: string;
  /** Oficjalny znak platformy (ścieżka SVG z Simple Icons, viewBox 0 0 24 24). */
  logo: { path: string; title: string };
};

export const services: Service[] = [
  {
    id: "meta",
    name: "Meta Ads",
    channel: "Meta",
    where: "Facebook i Instagram: aktualności, Stories, Reels",
    description:
      "Reklamy, które docierają do ludzi według zainteresowań, zachowań i podobieństwa do Twoich klientów, zanim zaczną czegoś szukać.",
    useCases: [
      "Sklep internetowy, który chce sprzedawać produkty z wyraźnym zdjęciem lub wideo",
      "Usługi lokalne docierające do mieszkańców konkretnej okolicy",
      "Pozyskiwanie zapytań przez formularze kontaktowe w aplikacji",
    ],
    benefits: [
      "Precyzyjne grupy odbiorców i remarketing osób, które już Cię znają",
      "Wiele formatów: zdjęcie, karuzela, wideo, katalog produktów",
      "Szybkie testy kreacji i komunikatów przy niewielkim budżecie",
    ],
    notFor:
      "Gdy klienci szukają Twojej usługi w pilnej potrzebie (np. awaria, pomoc drogowa), wyszukiwarka zwykle zadziała lepiej.",
    logo: { path: siMeta.path, title: siMeta.title },
  },
  {
    id: "google",
    name: "Google Ads",
    channel: "Google",
    where: "Wyszukiwarka Google, sieć reklamowa, Mapy, Zakupy",
    description:
      "Reklamy wyświetlane osobom, które w tej chwili wpisują w Google, czego potrzebują. Płacisz za kliknięcie, a nie za samo wyświetlenie.",
    useCases: [
      "Usługi, których klienci aktywnie szukają: „księgowa Kraków”, „serwis klimatyzacji”",
      "Sklepy z produktami, które ludzie porównują cenowo (kampanie produktowe)",
      "Firmy B2B, w których jedno zapytanie ma wysoką wartość",
    ],
    benefits: [
      "Docierasz do ludzi w momencie decyzji, a nie przypadkiem",
      "Pełna kontrola nad słowami kluczowymi i kosztem kliknięcia",
      "Mierzalne konwersje: telefony, formularze, zakupy",
    ],
    notFor:
      "Gdy produkt jest zupełnie nowy i nikt jeszcze go nie szuka, najpierw trzeba zbudować popyt, np. w social media.",
    logo: { path: siGoogleads.path, title: siGoogleads.title },
  },
  {
    id: "youtube",
    name: "YouTube Ads",
    channel: "YouTube",
    where: "Reklamy wideo przed, w trakcie i obok filmów",
    description:
      "Kampanie wideo, które budują rozpoznawalność i tłumaczą ofertę w kilkanaście sekund, z rozliczeniem za obejrzenie.",
    useCases: [
      "Marki, które potrzebują pokazać produkt w działaniu",
      "Usługi wymagające wyjaśnienia, zanim klient zapyta o cenę",
      "Remarketing wideo dla osób, które odwiedziły stronę",
    ],
    benefits: [
      "Płacisz zwykle dopiero, gdy ktoś obejrzy reklamę lub w nią kliknie",
      "Kierowanie według tematów, kanałów i intencji z wyszukiwarki Google",
      "Wideo pracuje długo: jedna dobra kreacja wystarcza na wiele tygodni",
    ],
    notFor:
      "Bez materiału wideo albo budżetu na jego przygotowanie ten kanał trudno dobrze wykorzystać.",
    logo: { path: siYoutube.path, title: siYoutube.title },
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    channel: "TikTok",
    where: "Pionowe wideo w kanale „Dla Ciebie”",
    description:
      "Krótkie, pionowe wideo w tonie platformy. Dobry kanał, gdy Twoi klienci spędzają tam czas, a Ty możesz regularnie dostarczać nowe materiały.",
    useCases: [
      "Produkty kierowane do osób w wieku ok. 18–35 lat",
      "Marki, które potrafią pokazać się naturalnie, bez studyjnego połysku",
      "Premiery produktów i akcje, które mają szybko zyskać zasięg",
    ],
    benefits: [
      "Duży zasięg przy relatywnie niskim koszcie dotarcia",
      "Formaty natywne, które wyglądają jak zwykłe treści twórców",
      "Szybka informacja zwrotna, które komunikaty działają",
    ],
    notFor:
      "Gdy Twoi klienci to głównie osoby decyzyjne w dużych firmach, a oferta wymaga długiego procesu zakupu.",
    logo: { path: siTiktok.path, title: siTiktok.title },
  },
];

export function serviceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

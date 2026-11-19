import type { Localized } from "@/i18n/config";
import type { ServiceId } from "./services";

/** ★ Cennik przykładowy. `PRICING_IS_DEMO = false` ukrywa oznaczenie „ceny przykładowe” po wpisaniu prawdziwych cen. */
export const PRICING_IS_DEMO = true;

export interface Plan {
  id: string;
  service: ServiceId;
  name: Localized;
  price: number;
  /** Cena „od” (np. produkcja zależna od zakresu). */
  priceFrom?: boolean;
  unit: Localized;
  duration: Localized;
  includes: Localized<string[]>;
  extras: Localized<string[]>;
  featured?: boolean;
  /** Pozycja do rezerwacji terminu (true) albo wyceny mailowej (false). */
  bookable: boolean;
  /** Domyślna długość sesji przy przejściu do rezerwacji. */
  bookDuration?: number;
}

export const plans: Plan[] = [
  {
    id: "vocal-1h",
    service: "vocal",
    name: { pl: "Sesja wokalna", en: "Vocal session" },
    price: 120,
    unit: { pl: "za godzinę", en: "per hour" },
    duration: { pl: "od 1 h", en: "from 1 h" },
    includes: {
      pl: ["Realizator przez całą sesję", "Nagranie i comping podejść", "Ślady WAV tego samego dnia"],
      en: ["Engineer for the whole session", "Recording and comping takes", "WAV stems the same day"],
    },
    extras: { pl: ["Sobota: +20 zł / h", "Dokładne strojenie wokalu: +50 zł / utwór"], en: ["Saturday: +20 PLN / h", "Detailed vocal tuning: +50 PLN / track"] },
    bookable: true,
    bookDuration: 60,
  },
  {
    id: "vocal-4h",
    service: "vocal",
    name: { pl: "Blok 4 h", en: "4-hour block" },
    price: 420,
    unit: { pl: "za blok", en: "per block" },
    duration: { pl: "4 h", en: "4 h" },
    includes: {
      pl: ["Wszystko z sesji wokalnej", "Szybki mix roboczy na koniec", "Oszczędzasz 60 zł"],
      en: ["Everything in the vocal session", "A quick rough mix at the end", "You save 60 PLN"],
    },
    extras: { pl: ["Sobota: +60 zł za blok"], en: ["Saturday: +60 PLN per block"] },
    featured: true,
    bookable: true,
    bookDuration: 240,
  },
  {
    id: "production",
    service: "production",
    name: { pl: "Produkcja bitu", en: "Beat production" },
    price: 600,
    priceFrom: true,
    unit: { pl: "za utwór", en: "per track" },
    duration: { pl: "1–2 sesje", en: "1–2 sessions" },
    includes: {
      pl: ["Bit od zera z aranżacją", "Ślady i wersja instrumentalna", "Licencja niewyłączna na piśmie"],
      en: ["A beat from scratch with arrangement", "Stems and instrumental", "Written non-exclusive licence"],
    },
    extras: { pl: ["Wyłączność na bit: +400 zł", "Dodatkowa wersja aranżu: +100 zł"], en: ["Exclusive rights: +400 PLN", "Extra arrangement version: +100 PLN"] },
    bookable: true,
    bookDuration: 180,
  },
  {
    id: "mix-master",
    service: "mix",
    name: { pl: "Mix i mastering", en: "Mix & master" },
    price: 350,
    unit: { pl: "za utwór", en: "per track" },
    duration: { pl: "3–5 dni roboczych", en: "3–5 working days" },
    includes: {
      pl: ["Mix do 40 śladów", "Mastering pod streaming", "2 rundy poprawek, 4 wersje pliku"],
      en: ["Mix of up to 40 tracks", "Streaming-ready master", "2 revision rounds, 4 file versions"],
    },
    extras: { pl: ["Tryb ekspres 48 h: +100 zł", "Kolejna runda poprawek: +50 zł"], en: ["48-hour express: +100 PLN", "Extra revision round: +50 PLN"] },
    bookable: false,
  },
  {
    id: "master",
    service: "mix",
    name: { pl: "Mastering", en: "Mastering" },
    price: 100,
    unit: { pl: "za utwór", en: "per track" },
    duration: { pl: "2 dni robocze", en: "2 working days" },
    includes: {
      pl: ["Master pod streaming i klub", "Wersje clean i explicit", "1 runda poprawek"],
      en: ["Master for streaming and clubs", "Clean and explicit versions", "1 revision round"],
    },
    extras: { pl: ["Wersja instrumentalna: +30 zł", "Master z podziałem na stemy: +80 zł"], en: ["Instrumental version: +30 PLN", "Stem mastering: +80 PLN"] },
    bookable: false,
  },
  {
    id: "podcast",
    service: "podcast",
    name: { pl: "Podcast i voice-over", en: "Podcast & voice-over" },
    price: 140,
    unit: { pl: "za godzinę", en: "per hour" },
    duration: { pl: "od 1 h", en: "from 1 h" },
    includes: {
      pl: ["Do 3 mikrofonów naraz", "Plik WAV + MP3 −16 LUFS", "Czyszczenie szumów"],
      en: ["Up to 3 microphones at once", "WAV + MP3 file at −16 LUFS", "Noise cleanup"],
    },
    extras: { pl: ["Montaż odcinka: +80 zł / h", "Intro i outro: +150 zł jednorazowo"], en: ["Episode editing: +80 PLN / h", "Intro and outro: +150 PLN one-off"] },
    bookable: true,
    bookDuration: 60,
  },
];

import type { Localized } from "@/i18n/config";

export const serviceIds = ["vocal", "production", "mix", "podcast"] as const;
export type ServiceId = (typeof serviceIds)[number];

export const isServiceId = (v: unknown): v is ServiceId => typeof v === "string" && (serviceIds as readonly string[]).includes(v);

export interface Service {
  id: ServiceId;
  name: Localized;
  /** Długości sesji możliwe do zarezerwowania (minuty). */
  durations: number[];
  defaultDuration: number;
  /** ★ Stawka godzinowa sesji w PLN – wartość demonstracyjna. */
  hourlyRate: number;
  /** ★ Cena bloku 4 h (jeśli usługa ma pakiet) – wartość demonstracyjna. */
  blockRate4h?: number;
  /** Parametry techniczne pokazywane w module usługi. */
  params: { label: Localized; value: Localized }[];
  scope: Localized<string[]>;
  forWhom: Localized;
  description: Localized;
}

export const services: Service[] = [
  {
    id: "vocal",
    name: { pl: "Nagrywanie wokalu", en: "Vocal recording" },
    durations: [60, 120, 180, 240],
    defaultDuration: 120,
    hourlyRate: 120,
    blockRate4h: 420,
    params: [
      { label: { pl: "Format", en: "Format" }, value: { pl: "WAV 24 bit / 48 kHz", en: "WAV 24-bit / 48 kHz" } },
      { label: { pl: "Kabina", en: "Booth" }, value: { pl: "wygłuszona, z odsłuchem", en: "treated, with monitoring" } },
      { label: { pl: "Realizator", en: "Engineer" }, value: { pl: "przez całą sesję", en: "for the whole session" } },
    ],
    scope: {
      pl: ["Nagranie zwrotek, refrenów i dogrywek", "Comping najlepszych podejść", "Wstępne strojenie i timing", "Ślady wysłane tego samego dnia"],
      en: ["Verses, hooks and ad-libs", "Comping the best takes", "Basic tuning and timing", "Stems sent the same day"],
    },
    forWhom: {
      pl: "Dla raperów i wokalistów: od pierwszego numeru po album.",
      en: "For rappers and singers: from a first track to a full album.",
    },
    description: {
      pl: "Nagrywamy w kabinie zaprojektowanej pod rap: suchy, bliski dźwięk i szybka praca na podejściach. Realizator prowadzi sesję, pilnuje dykcji i energii, a Ty skupiasz się na tekście.",
      en: "We record in a booth built for rap: dry, close sound and fast work on takes. The engineer runs the session and keeps an ear on delivery and energy, so you can focus on the lyrics.",
    },
  },
  {
    id: "production",
    name: { pl: "Produkcja i beatmaking", en: "Production & beatmaking" },
    durations: [120, 180, 240],
    defaultDuration: 180,
    hourlyRate: 150,
    params: [
      { label: { pl: "Tempo", en: "Tempo" }, value: { pl: "60–180 BPM", en: "60–180 BPM" } },
      { label: { pl: "Pliki", en: "Files" }, value: { pl: "ślady + wersja instrumentalna", en: "stems + instrumental" } },
      { label: { pl: "Prawa", en: "Rights" }, value: { pl: "licencja lub wyłączność", en: "lease or exclusive" } },
    ],
    scope: {
      pl: ["Bit od zera albo rozwinięcie Twojego szkicu", "Aranżacja pod zwrotki i refreny", "Sample clearance – doradztwo", "Umowa licencyjna na piśmie"],
      en: ["A beat from scratch or built on your sketch", "Arrangement for verses and hooks", "Advice on sample clearance", "Written licence agreement"],
    },
    forWhom: {
      pl: "Dla artystów, którzy szukają własnego brzmienia, a nie kolejnego bitu z sieci.",
      en: "For artists who want their own sound, not another beat from the internet.",
    },
    description: {
      pl: "Siadamy razem przy bicie: od wyboru kierunku, przez bębny i bas, po aranżację gotową pod wokal. Możesz przynieść referencje, sample albo nucony pomysł.",
      en: "We build the beat together: from the direction, through drums and bass, to an arrangement ready for vocals. Bring references, samples or a hummed idea.",
    },
  },
  {
    id: "mix",
    name: { pl: "Mix i mastering", en: "Mixing & mastering" },
    durations: [60, 120, 240],
    defaultDuration: 120,
    hourlyRate: 120,
    params: [
      { label: { pl: "Głośność", en: "Loudness" }, value: { pl: "pod streaming, ok. −14 LUFS", en: "streaming-ready, about −14 LUFS" } },
      { label: { pl: "Poprawki", en: "Revisions" }, value: { pl: "2 rundy w cenie", en: "2 rounds included" } },
      { label: { pl: "Termin", en: "Turnaround" }, value: { pl: "3–5 dni roboczych", en: "3–5 working days" } },
    ],
    scope: {
      pl: ["Mix wokalu z bitem lub pełnej sesji", "Mastering pod streaming i klub", "Wersje: clean, explicit, instrumental, a cappella", "Sesja odsłuchowa w studiu"],
      en: ["Mixing vocals with the beat or a full session", "Mastering for streaming and clubs", "Clean, explicit, instrumental and a cappella versions", "Listening session in the studio"],
    },
    forWhom: {
      pl: "Dla numerów nagranych u nas lub gdzie indziej – przyślij ślady albo przyjdź na odsłuch.",
      en: "For tracks recorded with us or elsewhere: send stems or come in for a listening session.",
    },
    description: {
      pl: "Mix to miejsce, gdzie numer zaczyna brzmieć jak z playlisty. Ustawiamy wokal na froncie, porządkujemy dół i przygotowujemy master, który nie traci energii po kompresji serwisów.",
      en: "Mixing is where a track starts to sound like it belongs on a playlist. We put the vocal up front, tidy up the low end and deliver a master that keeps its energy after streaming normalisation.",
    },
  },
  {
    id: "podcast",
    name: { pl: "Podcasty i voice-over", en: "Podcasts & voice-over" },
    durations: [60, 120, 180],
    defaultDuration: 60,
    hourlyRate: 140,
    params: [
      { label: { pl: "Mikrofony", en: "Microphones" }, value: { pl: "do 3 osób jednocześnie", en: "up to 3 people at once" } },
      { label: { pl: "Plik", en: "File" }, value: { pl: "WAV + MP3 −16 LUFS", en: "WAV + MP3 −16 LUFS" } },
      { label: { pl: "Montaż", en: "Editing" }, value: { pl: "opcjonalnie", en: "optional" } },
    ],
    scope: {
      pl: ["Nagranie rozmowy lub lektora", "Czyszczenie szumów i oddechów", "Montaż i wyrównanie głośności", "Intro i outro z naszym podkładem"],
      en: ["Recording conversations or narration", "Noise and breath cleanup", "Editing and loudness matching", "Intro and outro on our music bed"],
    },
    forWhom: {
      pl: "Dla twórców podcastów, lektorów, marek i wywiadów z artystami.",
      en: "For podcasters, voice artists, brands and artist interviews.",
    },
    description: {
      pl: "Ta sama kabina, która słyszała setki zwrotek, świetnie sprawdza się w rozmowie. Zapewniamy ciszę, czysty sygnał i plik gotowy do publikacji.",
      en: "The booth that has heard hundreds of verses works just as well for conversation. You get silence, a clean signal and a file ready to publish.",
    },
  },
];

export const getService = (id: ServiceId): Service => services.find((s) => s.id === id)!;

/** Szacunkowa cena sesji w PLN (bez usług dodatkowych). */
export function estimatePrice(id: ServiceId, durationMin: number): number {
  const s = getService(id);
  if (durationMin === 240 && s.blockRate4h) return s.blockRate4h;
  return Math.round((s.hourlyRate * durationMin) / 60);
}

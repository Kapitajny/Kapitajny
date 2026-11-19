import type { Localized } from "@/i18n/config";
import type { SoundId } from "./sounds";
import peaks from "./track-peaks.json";

/**
 * ★ Utwory w odtwarzaczu. Obecnie WYŁĄCZNIE materiały demonstracyjne wygenerowane
 * skryptem `scripts/generate-demo-audio.mjs` (synteza, bez udziału zewnętrznych artystów).
 * Prawdziwe realizacje dodawaj tylko po uzyskaniu zgody artystów.
 */
export interface Track {
  id: keyof typeof peaks;
  title: string;
  src: string;
  sound: SoundId;
  type: Localized;
  bpm: number;
  key: Localized;
  duration: number;
  peaks: number[];
  demo: boolean;
}

const keyNames: Record<string, Localized> = {
  "F minor": { pl: "f-moll", en: "F minor" },
  "A minor": { pl: "a-moll", en: "A minor" },
  "Db major": { pl: "Des-dur", en: "D♭ major" },
  "D minor": { pl: "d-moll", en: "D minor" },
  "E minor": { pl: "e-moll", en: "E minor" },
  "C minor": { pl: "c-moll", en: "C minor" },
};

const make = (id: Track["id"], title: string, sound: SoundId, type: Localized): Track => ({
  id,
  title,
  src: `/audio/${id}.mp3`,
  sound,
  type,
  bpm: peaks[id].bpm,
  key: keyNames[peaks[id].key],
  duration: peaks[id].duration,
  peaks: peaks[id].peaks,
  demo: true,
});

export const tracks: Track[] = [
  make("neon-drift", "Neon Drift", "futuristic", { pl: "Produkcja bitu i mix", en: "Beat production & mix" }),
  make("beton", "Beton", "underground", { pl: "Bit boom-bap i mastering", en: "Boom-bap beat & mastering" }),
  make("velvet", "Velvet", "luxury", { pl: "Produkcja R&B i mix", en: "R&B production & mix" }),
  make("tasma-13", "Taśma 13", "analog", { pl: "Lo-fi, mix z emulacją taśmy", en: "Lo-fi, mix with tape emulation" }),
  make("pusty-pokoj", "Pusty pokój", "minimal", { pl: "Aranżacja minimal i mastering", en: "Minimal arrangement & mastering" }),
  make("horyzont", "Horyzont", "cinematic", { pl: "Intro kinowe: produkcja i mix", en: "Cinematic intro: production & mix" }),
];

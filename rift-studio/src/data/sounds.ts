import type { Localized } from "@/i18n/config";

export const soundIds = ["futuristic", "underground", "luxury", "analog", "minimal", "cinematic"] as const;
export type SoundId = (typeof soundIds)[number];
export const isSoundId = (v: unknown): v is SoundId => typeof v === "string" && (soundIds as readonly string[]).includes(v);

export interface Sound {
  id: SoundId;
  name: string;
  /** Demo w odtwarzaczu Realizacji, które pokazuje ten kierunek. */
  trackId: string;
  image: string;
  imageAlt: Localized;
  tagline: Localized;
  description: Localized;
  tempo: string;
  traits: Localized<string[]>;
  chain: Localized;
}

export const sounds: Sound[] = [
  {
    id: "futuristic",
    name: "Futuristic",
    trackId: "neon-drift",
    image: "/images/sound-futuristic.jpg",
    imageAlt: { pl: "Kontroler z padami podświetlonymi na niebiesko i fioletowo", en: "Pad controller lit in blue and violet" },
    tagline: { pl: "Sub, który czujesz w klatce.", en: "Sub you feel in your chest." },
    description: {
      pl: "Szerokie syntezatory, ślizgające się 808 i hi-hat w trioli. Wokal czysty, blisko, z dużą ilością przestrzeni za nim.",
      en: "Wide synths, sliding 808s and triplet hi-hats. The vocal stays clean and close, with plenty of space behind it.",
    },
    tempo: "130–150 BPM",
    traits: { pl: ["808 z glide", "arpeggio", "czysty wokal"], en: ["gliding 808", "arpeggios", "clean vocal"] },
    chain: { pl: "Syntezator → saturacja → sidechain → szeroki pogłos", en: "Synth → saturation → sidechain → wide reverb" },
  },
  {
    id: "underground",
    name: "Underground",
    trackId: "beton",
    image: "/images/sound-underground.jpg",
    imageAlt: { pl: "Czarno-białe zdjęcie trzech mężczyzn na tle graffiti", en: "Black-and-white photo of three men in front of graffiti" },
    tagline: { pl: "Bęben, sampel, prawda.", en: "Drums, a sample and the truth." },
    description: {
      pl: "Brudne bębny z kompresją, pocięty sampel i bas, który siedzi pod stopą. Wokal na pierwszym planie – bez wygładzania.",
      en: "Dirty, compressed drums, a chopped sample and bass sitting under the kick. The vocal stays up front, with nothing smoothed over.",
    },
    tempo: "85–95 BPM",
    traits: { pl: ["boom-bap", "swing", "trzaski winylu"], en: ["boom bap", "swing", "vinyl crackle"] },
    chain: { pl: "Sampler → kompresja równoległa → taśma → mono bas", en: "Sampler → parallel compression → tape → mono bass" },
  },
  {
    id: "luxury",
    name: "Luxury",
    trackId: "velvet",
    image: "/images/sound-luxury.jpg",
    imageAlt: { pl: "Złoty mikrofon pojemnościowy z filtrem pop", en: "Gold condenser microphone with a pop filter" },
    tagline: { pl: "Gładko, ciepło, drogo.", en: "Smooth, warm, expensive." },
    description: {
      pl: "Akordy elektrycznego pianina, miękka stopa, rimshot i dużo powietrza. Wokal z warstwami harmonii i delikatnym pogłosem.",
      en: "Electric piano chords, a soft kick, rimshots and lots of air. Vocals with layered harmonies and a gentle reverb.",
    },
    tempo: "70–80 BPM",
    traits: { pl: ["R&B", "harmonie", "pogłos płytowy"], en: ["R&B", "harmonies", "plate reverb"] },
    chain: { pl: "Pianino FM → chorus → kompresor optyczny → plate", en: "FM piano → chorus → optical compressor → plate" },
  },
  {
    id: "analog",
    name: "Analog",
    trackId: "tasma-13",
    image: "/images/sound-analog.jpg",
    imageAlt: { pl: "Ramię gramofonu nad wirującą płytą winylową w ciepłym świetle", en: "Turntable tonearm over a spinning vinyl record in warm light" },
    tagline: { pl: "Taśma, która lekko pływa.", en: "Tape that drifts a little." },
    description: {
      pl: "Wow & flutter, nasycenie i przycięta góra. Akordy jazzowe, leniwy swing – brzmienie jak z kasety znalezionej w szufladzie.",
      en: "Wow and flutter, saturation and a rolled-off top end. Jazz chords and a lazy swing, like a tape found in a drawer.",
    },
    tempo: "80–88 BPM",
    traits: { pl: ["lo-fi", "nasycenie", "jazzowe akordy"], en: ["lo-fi", "saturation", "jazz chords"] },
    chain: { pl: "Klawisze → emulacja taśmy → filtr dolnoprzepustowy", en: "Keys → tape emulation → low-pass filter" },
  },
  {
    id: "minimal",
    name: "Minimal",
    trackId: "pusty-pokoj",
    image: "/images/sound-minimal.jpg",
    imageAlt: { pl: "Srebrny mikrofon na jasnym tle", en: "Silver microphone on a light background" },
    tagline: { pl: "Mniej dźwięków, więcej słów.", en: "Fewer sounds, more words." },
    description: {
      pl: "Kilka dźwięków, dużo ciszy i bas, który pojawia się wtedy, gdy trzeba. Każde słowo słychać – tekst gra pierwsze skrzypce.",
      en: "A handful of sounds, lots of silence and bass that arrives only when needed. Every word is heard: the lyrics lead.",
    },
    tempo: "110–125 BPM",
    traits: { pl: ["przestrzeń", "sinusy", "precyzja"], en: ["space", "sine waves", "precision"] },
    chain: { pl: "Sinusy → bramka → delay ping-pong", en: "Sines → gate → ping-pong delay" },
  },
  {
    id: "cinematic",
    name: "Cinematic",
    trackId: "horyzont",
    image: "/images/sound-cinematic.jpg",
    imageAlt: { pl: "Ciemne studio z konsolą i sylwetką realizatora", en: "Dark studio with a console and the silhouette of an engineer" },
    tagline: { pl: "Numer jak napisy końcowe.", en: "A track that rolls like end credits." },
    description: {
      pl: "Pady, dęciaki i wielkie uderzenia. Narracja, która narasta – na intro albumu, outro albo numer o czymś ważnym.",
      en: "Pads, brass and huge hits. A story that builds: for an album intro, an outro or a song about something that matters.",
    },
    tempo: "65–75 BPM",
    traits: { pl: ["pady", "dęciaki", "duża dynamika"], en: ["pads", "brass", "wide dynamics"] },
    chain: { pl: "Pady → automatyka filtra → pogłos hall → bus kompresor", en: "Pads → filter automation → hall reverb → bus compressor" },
  },
];

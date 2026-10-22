import type { LevelId } from "./levels";

export interface Audience {
  id: string;
  title: string;
  description: string;
  /** Filtr grafiku, który pokazuje polecane zajęcia. `null` – brak zajęć w grafiku. */
  filter: { styleId?: string; level?: LevelId } | null;
  recommendation: string;
  /** Informacja niepotwierdzona – oznaczana na stronie jako przykładowa. */
  demoNote?: string;
}

export const AUDIENCES: Audience[] = [
  {
    id: "start",
    title: "Zaczynasz od zera",
    description: "Nigdy nie tańczyłaś ani nie tańczyłeś? Świetnie – grupy „Od zera” są właśnie dla Ciebie. Uczymy podstaw spokojnie i bez porównywania.",
    filter: { level: "start" },
    recommendation: "Pierwsze kroki albo dowolny styl na poziomie „Od zera”",
  },
  {
    id: "powrot",
    title: "Wracasz do tańca",
    description: "Tańczyłaś lub tańczyłeś kiedyś i chcesz wrócić? Zacznij od poziomu podstawowego – ciało szybko sobie przypomni, a my zadbamy o bezpieczne tempo.",
    filter: { level: "basic" },
    recommendation: "Grupy na poziomie podstawowym w wybranym stylu",
  },
  {
    id: "technika",
    title: "Rozwijasz technikę",
    description: "Masz za sobą regularne treningi i chcesz iść dalej? W grupach średniozaawansowanych i zaawansowanych pracujemy nad techniką i dłuższymi choreografiami.",
    filter: { level: "intermediate" },
    recommendation: "Taniec współczesny, hip-hop lub high heels na wyższych poziomach",
  },
  {
    id: "dorosli",
    title: "Szukasz ruchu i hobby",
    description: "Chcesz się poruszać, odstresować i zrobić coś kreatywnego po pracy? Wybierz styl, który najbardziej Cię ciekawi – dobra muzyka i przyjazna grupa zrobią resztę.",
    filter: null,
    recommendation: "Dowolny styl – wieczorne grupy w tygodniu i zajęcia w soboty rano",
  },
  {
    id: "mlodziez",
    title: "Dzieci i młodzież",
    description: "Obecny grafik obejmuje wyłącznie grupy dla dorosłych (16+). Jeśli szukasz zajęć dla młodszej osoby, napisz do nas – damy znać, gdy pojawi się taka grupa.",
    filter: null,
    recommendation: "Zostaw kontakt w formularzu",
    demoNote: "Informacja przykładowa – do potwierdzenia przez studio",
  },
];

/**
 * OPINIE PRZYKŁADOWE – treści demonstracyjne, nie są wypowiedziami prawdziwych osób.
 * Przed publikacją zastąp je autentycznymi opiniami (za zgodą autorów).
 */
export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Bałam się, że będę jedyną osobą, która nic nie umie. Po pierwszych zajęciach okazało się, że połowa grupy też zaczynała od zera.",
    author: "Marta",
    context: "Pierwsze kroki",
  },
  {
    quote: "Wróciłem do tańca po dziesięciu latach przerwy. Nikt mnie nie poganiał – po miesiącu przestałem myśleć o krokach i zacząłem tańczyć.",
    author: "Paweł",
    context: "Hip-hop, poziom podstawowy",
  },
  {
    quote: "Balet dla dorosłych to moja godzina tylko dla siebie. Lepiej się trzymam i pierwszy raz od dawna lubię patrzeć w lustro.",
    author: "Agnieszka",
    context: "Balet dla dorosłych",
  },
  {
    quote: "Na high heels przyszłam w sneakersach. Obcasy założyłam dopiero po kilku tygodniach i nikt nie zrobił z tego problemu.",
    author: "Julia",
    context: "High heels",
  },
];

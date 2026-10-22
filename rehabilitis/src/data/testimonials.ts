/**
 * ★ OPINIE PACJENTÓW
 *
 * Dodawaj wyłącznie prawdziwe opinie, za zgodą autorów (np. przepisane z wizytówki Google
 * lub przekazane bezpośrednio). Nie dodawaj ocen gwiazdkowych ani opinii, których nie możesz potwierdzić.
 * Dopóki lista jest pusta, sekcja pokazuje spokojny „pusty stan”.
 *
 * Przykład:
 *   { quote: "Treść opinii…", author: "Anna", context: "rehabilitacja po urazie kolana", source: "Google" }
 */

export interface Testimonial {
  quote: string;
  /** Imię lub inicjały – tylko w formie, na którą autor wyraził zgodę. */
  author: string;
  context?: string;
  /** Skąd pochodzi opinia, np. "Google" albo "przekazana osobiście". */
  source?: string;
}

export const TESTIMONIALS: Testimonial[] = [];

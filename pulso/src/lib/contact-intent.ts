/**
 * Wspólna nawigacja do formularza kontaktowego.
 *
 * Każdy przycisk kontaktowy na stronie („Kontakt”, „Umów konsultację”, „Rozpocznij współpracę”,
 * „Wybieram pakiet”, „Zapytaj o …”) wywołuje `openContact()`. Funkcja:
 *  1. zapisuje wybór (usługi / pakiet), który formularz odczytuje i wstępnie zaznacza,
 *  2. płynnie przewija do #kontakt (bez przeładowania strony; bez animacji przy ograniczonym ruchu),
 *  3. przenosi fokus na pierwsze pole bieżącego kroku formularza.
 */
import type { PackageId } from "@/config/pricing";
import type { ServiceId } from "@/data/services";

export const CONTACT_ID = "kontakt";
export const CONTACT_FORM_ID = "kontakt-formularz";

export type ContactIntent = {
  services?: ServiceId[];
  package?: PackageId;
  /** Zmienia się przy każdym wywołaniu, żeby formularz mógł zareagować także na ten sam wybór. */
  nonce: number;
};

let current: ContactIntent = { nonce: 0 };
const listeners = new Set<() => void>();

export function subscribeIntent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getIntent(): ContactIntent {
  return current;
}

export function setIntent(intent: Omit<ContactIntent, "nonce">): void {
  current = { ...intent, nonce: current.nonce + 1 };
  listeners.forEach((l) => l());
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function openContact(intent?: Omit<ContactIntent, "nonce">): void {
  if (intent && (intent.services?.length || intent.package)) setIntent(intent);

  const target = document.getElementById(CONTACT_FORM_ID) ?? document.getElementById(CONTACT_ID);
  if (!target) return;

  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${CONTACT_ID}`) {
    window.history.replaceState(null, "", `#${CONTACT_ID}`);
  }

  // Fokus po wyrenderowaniu ewentualnej zmiany kroku; preventScroll, żeby nie przerwać przewijania.
  window.requestAnimationFrame(() => {
    const field = target.querySelector<HTMLElement>("[data-autofocus]");
    field?.focus({ preventScroll: true });
  });
}

/** Obsługa kliknięcia w link `href="#kontakt"`: działa też bez JavaScriptu (zwykła kotwica). */
export function contactClickHandler(intent?: Omit<ContactIntent, "nonce">) {
  return (event: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean }) => {
    if (event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    openContact(intent);
  };
}

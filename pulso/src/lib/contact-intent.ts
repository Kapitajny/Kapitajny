/**
 * Wspólna nawigacja w obrębie strony i do formularza kontaktowego.
 *
 * `installPageNavigation()` obsługuje KAŻDY link prowadzący do miejsca na tej samej stronie (`href="#…"`):
 * menu, „Poznaj naszą ofertę”, stopkę, oś misji, logo i wszystkie przyciski kontaktowe.
 *  - Przewija wyłącznie własny dokument (`window.scrollTo`) z uwzględnieniem pływającego menu.
 *    Nie używa `scrollIntoView`, które w osadzonej ramce (np. podgląd, artefakt) przesuwa też stronę nadrzędną.
 *  - Nie zmienia adresu (`#…`), więc kliknięcia nie tworzą wpisów historii ani nie przeładowują osadzenia.
 *  - Przenosi fokus na cel (dla klawiatury i czytników ekranu), bez dodatkowego przewijania.
 *
 * Przyciski kontaktowe („Kontakt”, „Umów konsultację”, „Rozpocznij współpracę”, „Wybieram pakiet”, „Zapytaj o …”)
 * to linki `href="#kontakt"` z atrybutami `data-services` / `data-package`. Kliknięcie:
 *  1. zapisuje wybór, który formularz odczytuje i wstępnie zaznacza,
 *  2. przewija do formularza,
 *  3. ustawia fokus na pierwszym polu bieżącego kroku.
 * Bez JavaScriptu te same linki działają jak zwykłe kotwice.
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
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Odstęp od górnej krawędzi: dół pływającego menu + oddech, albo scroll-margin-top celu (większa wartość). */
function topOffset(el: Element): number {
  const nav = document.querySelector("header nav");
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return Math.max(navBottom + 16, margin);
}

/** Przewija wyłącznie własny dokument do elementu (bez przesuwania stron nadrzędnych). */
export function scrollToElement(el: Element, behavior?: ScrollBehavior): void {
  const top = el.getBoundingClientRect().top + window.scrollY - topOffset(el);
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: behavior ?? (prefersReducedMotion() ? "auto" : "smooth") });
}

function focusWithoutScroll(el: HTMLElement): void {
  const focusable = el.matches("a[href], button, input, select, textarea, [tabindex]");
  if (!focusable) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function openContact(intent?: Omit<ContactIntent, "nonce">): void {
  if (intent && (intent.services?.length || intent.package)) setIntent(intent);

  const target = document.getElementById(CONTACT_FORM_ID) ?? document.getElementById(CONTACT_ID);
  if (!target) return;
  scrollToElement(target);

  // Fokus po wyrenderowaniu ewentualnej zmiany kroku; preventScroll, żeby nie przerwać przewijania.
  window.requestAnimationFrame(() => {
    const field = target.querySelector<HTMLElement>("[data-autofocus]");
    if (field) field.focus({ preventScroll: true });
  });
}

/** Odczytuje wybór zapisany na linku: data-services="meta,google", data-package="growth". */
export function intentFromLink(a: Element): Omit<ContactIntent, "nonce"> | undefined {
  const services = (a.getAttribute("data-services") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as ServiceId[];
  const pkg = (a.getAttribute("data-package") || undefined) as PackageId | undefined;
  return services.length || pkg ? { ...(services.length ? { services } : {}), ...(pkg ? { package: pkg } : {}) } : undefined;
}

/** Jedna obsługa wszystkich linków `#…` na stronie. Zwraca funkcję wyłączającą obsługę. */
export function installPageNavigation(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest?.("a[href^='#']");
    if (!link) return;
    const id = decodeURIComponent((link.getAttribute("href") ?? "").slice(1));

    if (id === CONTACT_ID) {
      event.preventDefault();
      openContact(intentFromLink(link));
      return;
    }

    if (id === "top" || id === "") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }

    const target = document.getElementById(id);
    if (!target) return; // brak celu na tej stronie: zostawiamy domyślne zachowanie przeglądarki
    event.preventDefault();
    scrollToElement(target);
    focusWithoutScroll(target);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

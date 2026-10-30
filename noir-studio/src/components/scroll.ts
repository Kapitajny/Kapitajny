/**
 * Przewija do sekcji i przenosi do niej fokus (czytniki ekranu i klawiatura
 * kontynuują od właściwego miejsca). Sekcje mają `tabIndex={-1}`.
 */
export function scrollToSection(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
  history.replaceState(null, "", hash === "#top" ? window.location.pathname + window.location.search : hash);
}

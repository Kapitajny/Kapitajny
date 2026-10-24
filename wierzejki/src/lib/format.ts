/** "+48 25 643 75 00" → "tel:+48256437500" */
export function telHref(display: string): string {
  return `tel:${display.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string, subject?: string): string {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}

/** Normalizacja do wyszukiwania: małe litery, bez polskich znaków diakrytycznych. */
export function normalizeForSearch(value: string): string {
  return value
    .toLocaleLowerCase("pl")
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** ["A", "B", "C"] → "A, B i C" */
export function listPl(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} i ${items[items.length - 1]}`;
}

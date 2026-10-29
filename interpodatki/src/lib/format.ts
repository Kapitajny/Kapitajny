const pln = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0, useGrouping: true });

/** Kwota w złotych, np. „1 200 zł”. Polskie formatowanie grupuje cyfry od 10 000 – wymuszamy je także dla tysięcy. */
export function formatPLN(amount: number): string {
  const formatted = pln.format(Math.round(amount));
  const grouped = /^\d{4}$/.test(formatted) ? `${formatted.slice(0, 1)} ${formatted.slice(1)}` : formatted;
  return `${grouped.replace(/\s/g, " ")} zł`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  }).format(new Date(iso));
}

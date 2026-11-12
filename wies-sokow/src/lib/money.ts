const NBSP = " ";

/** 3500 → „35 zł”, 3550 → „35,50 zł”. Bez Intl, żeby serwer i przeglądarka dawały identyczny wynik. */
export function formatPrice(grosze: number): string {
  const zl = Math.trunc(grosze / 100);
  const gr = Math.abs(grosze % 100);
  const whole = String(zl).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return gr === 0 ? `${whole}${NBSP}zł` : `${whole},${String(gr).padStart(2, "0")}${NBSP}zł`;
}

/** Zawsze z groszami – do podsumowań: 3500 → „35,00 zł”. */
export function formatAmount(grosze: number): string {
  const zl = Math.trunc(grosze / 100);
  const gr = Math.abs(grosze % 100);
  const whole = String(zl).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${whole},${String(gr).padStart(2, "0")}${NBSP}zł`;
}

/** Odmiana rzeczownika przez liczebnik: 1 opakowanie, 2 opakowania, 5 opakowań. */
export function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

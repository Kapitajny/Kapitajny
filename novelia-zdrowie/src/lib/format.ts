const formatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", minimumFractionDigits: 2 });

/** 3999 → „39,99 zł” */
export function formatPrice(grosze: number): string {
  return formatter.format(grosze / 100);
}

/** 3999 → „39,99” (bez waluty – do wyróżnionych cen) */
export function formatAmount(grosze: number): string {
  return (grosze / 100).toFixed(2).replace(".", ",");
}

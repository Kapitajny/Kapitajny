// Dane firmy. Wszystkie dane kontaktowe są demonstracyjne (projekt portfolio).
export const site = {
  name: "CLIMARO",
  legalName: "CLIMARO",
  url: "https://climaro.pl",
  tagline: "Klimatyzacja · Pompy ciepła · Rekuperacja",
  description:
    "Montaż i serwis klimatyzacji, pomp ciepła i rekuperacji na terenie województwa mazowieckiego. Jawny cennik usług, bezpłatna wycena. Siedziba: Grodzisk Mazowiecki.",
  phone: "+48 517 734 221",
  phoneHref: "tel:+48517734221",
  email: "biuro@climaro.pl",
  city: "Grodzisk Mazowiecki",
  area: "województwo mazowieckie",
  foundedYear: 2010,
  // Strona ma dane demonstracyjne (numer telefonu może należeć do kogoś innego),
  // więc indeksowanie jest wyłączone. Po podstawieniu prawdziwych danych zmień na true.
  allowIndexing: false,
} as const;

export const mainNav = [
  { href: "/", label: "Strona główna" },
  { href: "/o-nas", label: "O nas" },
  { href: "/uslugi", label: "Usługi" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

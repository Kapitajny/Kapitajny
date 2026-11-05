import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PortfolioGrid } from "@/components/sections/Portfolio";
import { PricingCards, PricingNote } from "@/components/sections/Pricing";
import { ArrowRight } from "@/components/ui/Icons";
import { PageHero, SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, prices } from "@/data/offer";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Sklepy internetowe",
  description: `Sklepy internetowe od ${formatPrice(prices.shop)} zł netto: indywidualny wygląd, kategorie, karty produktów, koszyk i proces zamówienia.`,
  alternates: { canonical: "/sklepy-internetowe" },
};

const features = [
  { title: "Indywidualny wygląd", text: "Sklep zaprojektowany pod Twoją markę i produkty, a nie kolejny identyczny szablon." },
  { title: "Responsywność", text: "Wygodne zakupy na telefonie: duże przyciski, czytelne zdjęcia i prosty koszyk." },
  { title: "Kategorie produktów", text: "Przemyślana struktura kategorii, dzięki której klient szybko trafia do tego, czego szuka." },
  { title: "Karty produktów", text: "Zdjęcia, opis, cena i warianty – wszystko, czego klient potrzebuje do decyzji." },
  { title: "Koszyk", text: "Dodawanie, zmiana ilości i usuwanie produktów z bieżącym podsumowaniem wartości." },
  { title: "Proces zamówienia", text: "Krótka, zrozumiała ścieżka od koszyka do złożenia zamówienia." },
  { title: "Podstawowa konfiguracja", text: "Ustawienie sklepu, kategorii i przykładowych produktów oraz przekazanie wskazówek do dalszej pracy." },
];

const individual = [
  "Integracje płatności online i firm kurierskich",
  "Płatne licencje, wtyczki i usługi zewnętrzne",
  "Domena i hosting",
  "Wprowadzenie pełnego katalogu produktów",
];

export default function ShopsPage() {
  const shops = projects.filter((p) => p.kind === "sklep");
  return (
    <>
      <PageHero
        eyebrow="Sklepy internetowe"
        title="Sklep internetowy, w którym zakupy są proste"
        lead={`Projektujemy sklepy z myślą o tym, jak klienci naprawdę kupują – od kategorii po złożenie zamówienia. Ceny od ${formatPrice(prices.shop)} zł netto.`}
      >
        <Link href="/kontakt?usluga=sklep" className="btn btn-primary">
          Zapytaj o sklep internetowy
          <ArrowRight />
        </Link>
        <Link href="#przyklady" className="btn btn-secondary">
          Zobacz przykładowe sklepy
        </Link>
      </PageHero>

      <section className="section container-x" aria-labelledby="funkcje">
        <SectionHeading
          eyebrow="Co otrzymujesz"
          id="funkcje"
          title="Wszystko, czego potrzebuje dobry sklep na start"
          lead="Zakres i liczbę produktów do wprowadzenia ustalamy w wycenie."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, n) => (
            <li key={feature.title} className="reveal bg-white p-7" style={{ "--delay": `${(n % 4) * 70}ms` } as CSSProperties}>
              <span className="grid size-9 place-items-center rounded-full border border-gold font-mono text-[0.75rem]">{n + 1}</span>
              <h3 className="mt-6 text-[1.15rem] tracking-[-0.02em]">{feature.title}</h3>
              <p className="mt-2 text-[0.95rem] text-steel">{feature.text}</p>
            </li>
          ))}
          <li className="reveal on-dark flex flex-col justify-between bg-ink p-7 text-white">
            <p className="text-[1.15rem] font-semibold tracking-[-0.02em]">Od {formatPrice(prices.shop)} zł netto</p>
            <Link href="/kontakt?usluga=sklep" className="link-arrow mt-6 text-gold-soft">
              Zapytaj o wycenę <ArrowRight />
            </Link>
          </li>
        </ol>
      </section>

      <section className="section border-y border-line bg-white/60" aria-labelledby="indywidualnie">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            eyebrow="Ustalane indywidualnie"
            id="indywidualnie"
            title="Integracje, licencje i hosting – bez obietnic na wyrost"
            lead="Każdy sklep ma inne potrzeby. Poniższe elementy nie są wliczone w cenę – sprawdzamy je i wyceniamy przy rozmowie o projekcie."
          />
          <ul className="ticks reveal grid content-start gap-4 text-[1.025rem] sm:grid-cols-2">
            {individual.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-dark relative overflow-hidden bg-ink text-white" aria-labelledby="cennik">
        <div className="grid-bg-dark fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="section container-x relative grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Cennik"
            id="cennik"
            title="Ile kosztuje sklep internetowy"
            lead={`Sklep internetowy zaczyna się od ${formatPrice(prices.shop)} zł netto. Ostateczna cena zależy od liczby produktów, funkcji i integracji.`}
          />
          <PricingCards show={["sklep"]} />
          <div className="lg:col-span-2">
            <PricingNote />
          </div>
        </div>
      </section>

      <section id="przyklady" className="section container-x scroll-mt-[var(--header-h)]" aria-labelledby="przyklady-title">
        <SectionHeading
          eyebrow="Realizacje"
          id="przyklady-title"
          title="Przykładowe sklepy"
          lead="Koncepcje demonstracyjne: możesz przeglądać produkty, dodawać je do koszyka i przejść zamówienie demo. Żadna płatność nie jest pobierana."
        />
        <div className="mt-12">
          <PortfolioGrid projects={shops} showFilter={false} />
        </div>
      </section>

      <CtaBand
        title="Zapytaj o sklep internetowy"
        lead="Napisz, co sprzedajesz i ilu produktów się spodziewasz. Odpowiemy z propozycją zakresu i wyceną."
        primary={{ href: "/kontakt?usluga=sklep", label: "Zapytaj o sklep internetowy" }}
        secondary={{ href: "/strony-internetowe", label: "Wystarczy Ci strona?" }}
      />
    </>
  );
}

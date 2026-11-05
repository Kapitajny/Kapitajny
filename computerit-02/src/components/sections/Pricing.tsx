import type { CSSProperties } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { ArrowRight } from "@/components/ui/Icons";
import { formatPrice, prices } from "@/data/offer";

type Plan = "promo" | "strona" | "sklep";

const plans: Record<
  Plan,
  { name: string; price: number; netto: boolean; prefix?: string; lead: string; items: string[]; cta: string; href: string; featured?: boolean }
> = {
  promo: {
    name: "Pakiet promocyjny",
    price: prices.promo,
    netto: false,
    lead: `Strona internetowa dla pierwszych ${prices.promoSeats} klientów. Oferta ograniczona – nie jest stałą ceną usługi.`,
    items: ["Strona internetowa", `Tylko ${prices.promoSeats} miejsc`, "Zakres realizacji ustalany indywidualnie"],
    cta: "Zapytaj o pakiet",
    href: "/kontakt?usluga=strona&pakiet=promocja",
    featured: true,
  },
  strona: {
    name: "Strona internetowa",
    price: prices.website,
    netto: true,
    prefix: "od",
    lead: "Strona firmowa, usługowa, wizerunkowa lub landing page – projekt od podstaw.",
    items: ["Indywidualny projekt graficzny", "Wersja na wszystkie urządzenia", "Formularz kontaktowy", "Podstawowe SEO i wdrożenie"],
    cta: "Zamów stronę internetową",
    href: "/kontakt?usluga=strona",
  },
  sklep: {
    name: "Sklep internetowy",
    price: prices.shop,
    netto: true,
    prefix: "od",
    lead: "Sklep z kategoriami, kartami produktów, koszykiem i procesem zamówienia.",
    items: ["Indywidualny wygląd sklepu", "Kategorie i karty produktów", "Koszyk i proces zamówienia", "Podstawowa konfiguracja"],
    cta: "Zapytaj o sklep internetowy",
    href: "/kontakt?usluga=sklep",
  },
};

export function PricingCards({ show = ["promo", "strona", "sklep"] }: { show?: Plan[] }) {
  return (
    <div className={`grid gap-5 ${show.length === 3 ? "lg:grid-cols-3" : show.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-xl"}`}>
      {show.map((id, n) => {
        const plan = plans[id];
        return (
          <article
            key={id}
            className={`reveal relative flex flex-col overflow-hidden rounded-[1.25rem] p-7 sm:p-9 ${
              plan.featured ? "border border-gold/60 bg-graphite" : "border border-white/12 bg-white/[0.03]"
            }`}
            style={{ "--delay": `${n * 90}ms` } as CSSProperties}
          >
            {plan.featured && (
              <LogoMark className="pointer-events-none absolute -right-6 -bottom-8 h-40 w-auto text-white/[0.04]" />
            )}
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[1.15rem] tracking-[-0.02em]">{plan.name}</h3>
              {plan.featured && <span className="rounded-full bg-gold px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.06em] text-ink uppercase">Pierwsze {prices.promoSeats}</span>}
            </div>
            <p className="mt-6 flex items-baseline gap-2">
              {plan.prefix && <span className="text-ash">{plan.prefix}</span>}
              <span className={`text-[clamp(2.6rem,5vw,3.4rem)] leading-none font-semibold tracking-[-0.045em] ${plan.featured ? "text-gold-soft" : ""}`}>
                {formatPrice(plan.price)}&nbsp;zł
              </span>
              {plan.netto && <span className="text-ash">netto</span>}
            </p>
            <p className="mt-5 text-[0.975rem] text-ash">{plan.lead}</p>
            <ul className="ticks mt-6 mb-9 space-y-2.5 text-[0.975rem] text-white/90">
              {plan.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href={plan.href} className={`btn mt-auto w-full ${plan.featured ? "btn-gold" : "btn-ghost-dark"}`}>
              {plan.cta}
              <ArrowRight />
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function PricingNote() {
  return (
    <p className="reveal mt-8 max-w-3xl text-[0.9rem] leading-relaxed text-ash">
      Ceny „od” są cenami minimalnymi – ostateczna cena zależy od zakresu projektu i ustalamy ją przed rozpoczęciem prac. Pakiet promocyjny obowiązuje
      do wyczerpania {prices.promoSeats} miejsc. Informacje o cenach nie stanowią oferty w rozumieniu Kodeksu cywilnego. Płatności przyjmujemy wyłącznie
      przelewem bankowym –{" "}
      <Link href="/regulamin-platnosci" className="link text-white">
        regulamin płatności
      </Link>
      .
    </p>
  );
}

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
  title: "Strony internetowe",
  description: `Strony firmowe, usługowe, landing page i strony wizerunkowe od ${formatPrice(prices.website)} zł netto. Pakiet promocyjny: strona za ${formatPrice(prices.promo)} zł dla pierwszych ${prices.promoSeats} klientów.`,
  alternates: { canonical: "/strony-internetowe" },
};

const types = [
  { title: "Strony firmowe", text: "Wizytówka firmy w sieci: kim jesteś, co oferujesz i jak się z Tobą skontaktować – podane jasno i z charakterem." },
  { title: "Strony usługowe", text: "Oferta rozpisana na usługi, z cennikiem lub zakresem, procesem współpracy i formularzem zapytania." },
  { title: "Landing page", text: "Jedna strona skupiona na jednym celu: kampanii, produkcie, wydarzeniu lub zebraniu zapytań." },
  { title: "Strony wizerunkowe", text: "Strona, która buduje markę: duże zdjęcia lub film, przemyślana typografia i spokojna narracja." },
  { title: "Strony dla lokalnych firm", text: "Dla gabinetów, warsztatów, restauracji i salonów – godziny otwarcia, lokalizacja, oferta i szybki kontakt." },
];

const benefits = [
  { title: "Pierwsze wrażenie", text: "Klient ocenia firmę w kilka sekund. Dopracowany wygląd buduje zaufanie, zanim przeczyta pierwsze zdanie." },
  { title: "Prosta droga do kontaktu", text: "Przyciski, formularz i dane kontaktowe są tam, gdzie klient ich szuka – na każdym urządzeniu." },
  { title: "Widoczność w Google", text: "Poprawna struktura, opisy i szybkość ładowania to podstawa, na której można budować pozycjonowanie." },
  { title: "Własne miejsce w sieci", text: "Strona należy do Ciebie i mówi Twoim językiem – niezależnie od algorytmów mediów społecznościowych." },
];

const scope = [
  "Indywidualny projekt graficzny",
  "Wersja na telefon, tablet i komputer",
  "Przemyślana struktura podstron",
  "Formularz kontaktowy",
  "Podstawowa optymalizacja SEO",
  "Optymalizacja obrazów i szybkości",
  "Czytelny kontrast i obsługa klawiatury",
  "Wdrożenie strony",
];

export default function WebsitesPage() {
  const sites = projects.filter((p) => p.kind === "strona");
  return (
    <>
      <PageHero
        eyebrow="Strony internetowe"
        title="Strona internetowa, która pracuje na Twoją firmę"
        lead={`Projektujemy strony od podstaw – pod Twoją markę, ofertę i klientów. Ceny od ${formatPrice(prices.website)} zł netto.`}
      >
        <Link href="/kontakt?usluga=strona" className="btn btn-primary">
          Zamów stronę internetową
          <ArrowRight />
        </Link>
        <Link href="#cennik" className="btn btn-secondary">
          Zobacz cennik
        </Link>
      </PageHero>

      <section className="section container-x" aria-labelledby="rodzaje">
        <SectionHeading eyebrow="Rodzaje stron" id="rodzaje" title="Jaką stronę możemy dla Ciebie zrobić" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((type, n) => (
            <li key={type.title} className="reveal card p-7" style={{ "--delay": `${(n % 3) * 80}ms` } as CSSProperties}>
              <span className="font-mono text-[0.75rem] tracking-[0.08em] text-steel">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[1.25rem] tracking-[-0.025em]">{type.title}</h3>
              <p className="mt-3 text-[0.975rem] text-steel">{type.text}</p>
            </li>
          ))}
          <li className="reveal flex flex-col justify-between rounded-[1.25rem] bg-ink p-7 text-white on-dark">
            <p className="text-[1.15rem] font-semibold tracking-[-0.02em]">Nie wiesz, której potrzebujesz?</p>
            <p className="mt-3 text-[0.975rem] text-ash">Opisz firmę i cel – zaproponujemy rozwiązanie.</p>
            <Link href="/kontakt?usluga=strona" className="link-arrow mt-6 text-gold-soft">
              Zapytaj nas <ArrowRight />
            </Link>
          </li>
        </ul>
      </section>

      <section className="section border-y border-line bg-white/60" aria-labelledby="korzysci">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Korzyści" id="korzysci" title="Co daje dobra strona internetowa" />
          <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="reveal border-t border-ink pt-5">
                <h3 className="text-[1.15rem] tracking-[-0.02em]">{benefit.title}</h3>
                <p className="mt-2 text-[0.975rem] text-steel">{benefit.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="zakres">
        <SectionHeading
          eyebrow="Zakres"
          id="zakres"
          title="Co obejmuje realizacja"
          lead="Dokładny zakres, liczbę podstron i funkcje ustalamy w wycenie. Domena, hosting i płatne licencje nie są wliczone w cenę."
        />
        <ul className="ticks reveal grid content-start gap-4 text-[1.025rem] sm:grid-cols-2">
          {scope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="cennik" className="on-dark relative scroll-mt-[var(--header-h)] overflow-hidden bg-ink text-white" aria-labelledby="cennik-title">
        <div className="grid-bg-dark fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="section container-x relative">
          <SectionHeading
            eyebrow="Cennik"
            id="cennik-title"
            title="Ile kosztuje strona internetowa"
            lead={`Regularna cena strony internetowej zaczyna się od ${formatPrice(prices.website)} zł netto. Dla pierwszych ${prices.promoSeats} klientów przygotowaliśmy pakiet promocyjny.`}
          />
          <div className="mt-12">
            <PricingCards show={["promo", "strona"]} />
          </div>
          <PricingNote />
        </div>
      </section>

      <section className="section container-x" aria-labelledby="przyklady">
        <SectionHeading
          eyebrow="Realizacje"
          id="przyklady"
          title="Przykładowe strony"
          lead="Koncepcje demonstracyjne dla fikcyjnych marek – każdą możesz otworzyć i przeklikać."
        />
        <div className="mt-12">
          <PortfolioGrid projects={sites} limit={4} showFilter={false} />
        </div>
        <div className="reveal mt-14 flex justify-center">
          <Link href="/realizacje" className="btn btn-secondary">
            Wszystkie realizacje
            <ArrowRight />
          </Link>
        </div>
      </section>

      <CtaBand
        title="Zamów stronę internetową"
        lead="Opisz firmę i to, czego potrzebujesz. Odpowiemy z propozycją zakresu, terminu i ceny."
        primary={{ href: "/kontakt?usluga=strona", label: "Zamów stronę internetową" }}
        secondary={{ href: "/sklepy-internetowe", label: "Potrzebujesz sklepu?" }}
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { PortfolioGrid } from "@/components/sections/Portfolio";
import { PricingCards, PricingNote } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Reasons } from "@/components/sections/Reasons";
import { ServicesOverview } from "@/components/sections/Services";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, prices } from "@/data/offer";
import { interleaved, projects } from "@/data/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
        <div className="grid-bg fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-12 pt-[clamp(3rem,8vw,6rem)] pb-[clamp(3.5rem,8vw,6.5rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div className="hero-in">
            <p className="eyebrow eyebrow-gold">Strony internetowe · Sklepy online</p>
            <h1 id="hero-title" className="display mt-6 text-[clamp(2.45rem,1.2rem+4vw,4.5rem)]">
              Tworzymy cyfrowe doświadczenia, które rozwijają biznes
            </h1>
            <p className="lead mt-7 max-w-xl">
              Projektujemy i budujemy nowoczesne strony internetowe oraz sklepy online – szybkie, dopracowane na każdym ekranie i przygotowane pod
              Twoich klientów.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/uslugi" className="btn btn-primary">
                Poznaj nasze usługi
                <ArrowRight />
              </Link>
              <Link href="/kontakt" className="btn btn-secondary">
                Porozmawiajmy o projekcie
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6 border-t border-line pt-6">
              <div>
                <dt className="text-[0.875rem] text-steel">Strony internetowe</dt>
                <dd className="mt-1 text-[1.2rem] font-semibold tracking-[-0.02em]">od {formatPrice(prices.website)} zł netto</dd>
              </div>
              <div>
                <dt className="text-[0.875rem] text-steel">Sklepy internetowe</dt>
                <dd className="mt-1 text-[1.2rem] font-semibold tracking-[-0.02em]">od {formatPrice(prices.shop)} zł netto</dd>
              </div>
            </dl>
          </div>
          <div className="hero-in mx-auto w-full max-w-[38rem] lg:max-w-none">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Promocja – pasek */}
      <div className="border-b border-line bg-white">
        <div className="container-x flex flex-col gap-3 py-4 text-[0.95rem] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <span className="size-2 shrink-0 rounded-[1px] bg-gold" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Pakiet promocyjny:</strong> strona internetowa za {formatPrice(prices.promo)} zł dla pierwszych {prices.promoSeats}{" "}
              klientów.
            </span>
          </p>
          <Link href="/strony-internetowe#cennik" className="link-arrow -my-2 text-[0.925rem]">
            Szczegóły oferty <ArrowRight />
          </Link>
        </div>
      </div>

      {/* Usługi */}
      <section className="section container-x" aria-labelledby="uslugi-title">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Nasze usługi"
            id="uslugi-title"
            title="Dwie specjalizacje. Jeden standard jakości."
            lead="Skupiamy się na tym, co robimy najlepiej: stronach internetowych dla firm i sklepach online."
          />
          <Link href="/uslugi" className="link-arrow reveal shrink-0">
            Wszystkie usługi <ArrowRight />
          </Link>
        </div>
        <div className="mt-12">
          <ServicesOverview />
        </div>
      </section>

      {/* Dlaczego ComputerIT */}
      <section className="section border-y border-line bg-white/60" aria-labelledby="dlaczego-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Dlaczego ComputerIT"
            id="dlaczego-title"
            title="Strona, która pracuje na Twoją firmę"
            lead="Dobra strona to nie tylko wygląd. To także szybkość, czytelność i prosta droga od pierwszej wizyty do kontaktu lub zakupu."
          />
          <div className="mt-12">
            <Reasons />
          </div>
        </div>
      </section>

      {/* Realizacje */}
      <section className="section container-x" aria-labelledby="realizacje-title">
        <SectionHeading
          eyebrow="Nasze realizacje"
          id="realizacje-title"
          title="Zobacz, jak pracujemy"
          lead={
            <>
              Koncepcje demonstracyjne przygotowane przez ComputerIT dla fikcyjnych marek. Każdą możesz otworzyć i przeklikać – sklepy mają działający koszyk
              w trybie demo.
            </>
          }
        />
        <div className="mt-10">
          <PortfolioGrid projects={interleaved} limit={6} />
        </div>
        <div className="reveal mt-14 flex justify-center">
          <Link href="/realizacje" className="btn btn-secondary">
            Wszystkie realizacje ({projects.length})
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Proces */}
      <section className="section border-y border-line bg-white/60" aria-labelledby="proces-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Proces"
            id="proces-title"
            title="Od rozmowy do publikacji w pięciu krokach"
            lead="Na każdym etapie wiesz, co się dzieje i czego od Ciebie potrzebujemy."
            align="center"
          />
          <div className="mt-14">
            <Process />
          </div>
        </div>
      </section>

      {/* Cennik */}
      <section className="on-dark relative overflow-hidden bg-ink text-white" aria-labelledby="cennik-title">
        <div className="grid-bg-dark fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="section container-x relative">
          <SectionHeading
            eyebrow="Cennik"
            id="cennik-title"
            title="Przejrzyste ceny, bez niespodzianek"
            lead="Wyceniamy każdy projekt indywidualnie, ale od początku wiesz, od jakiej kwoty zaczynamy."
          />
          <div className="mt-12">
            <PricingCards />
          </div>
          <PricingNote />
        </div>
      </section>

      <div className="pt-[clamp(4.5rem,10vw,8rem)]">
        <CtaBand />
      </div>
    </>
  );
}

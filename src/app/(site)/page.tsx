import Link from "next/link";
import { Suspense } from "react";
import { gallery } from "@/config/gallery";
import { getPublicData } from "@/lib/server/public-data";
import { ContactForm } from "@/components/home/ContactForm";
import { Faq } from "@/components/home/Faq";
import { FleetRail } from "@/components/home/FleetRail";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Location } from "@/components/home/Location";
import { MobileBookBar } from "@/components/home/MobileBookBar";
import { NoLicense } from "@/components/home/NoLicense";
import { Pricing } from "@/components/home/Pricing";
import { Process } from "@/components/home/Process";
import { Reviews } from "@/components/home/Reviews";
import { SectionHead } from "@/components/home/SectionHead";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-[60vh] bg-graphite" aria-busy="true" />}>
        <HomeSections />
      </Suspense>
      <MobileBookBar />
    </>
  );
}

async function HomeSections() {
  const data = await getPublicData();

  return (
    <>
      <section id="flota" aria-labelledby="flota-title" className="on-dark bg-graphite py-20 text-white md:py-28">
        <div className="wrap">
          <SectionHead id="flota-title" kicker="Flota" title="Nasza flota">
            Każdy skuter ma własny cennik i opis wymagań. Wybierz model, sprawdź szczegóły i zarezerwuj termin online.
          </SectionHead>
          {data.jetskis.length > 0 ? (
            <FleetRail jetskis={data.jetskis} />
          ) : (
            <p className="text-lg text-white/75">Flota na nowy sezon jest w przygotowaniu. Wróć wkrótce albo napisz do nas.</p>
          )}
        </div>
      </section>

      <NoLicense data={data} />

      <section id="cennik" aria-labelledby="cennik-title" className="on-light bg-white pb-20 md:pb-28">
        <div className="wrap">
          <span className="wake mb-16 mt-4 w-full rotate-[-1.5deg] md:mb-20" aria-hidden="true" />
          <SectionHead id="cennik-title" kicker="Cennik" title="Cennik wynajmu">
            Wybierz skuter i przesuń suwak. Cena, kaucja i godzina zwrotu zmieniają się od razu. Pod spodem wszystkie stawki do porównania.
          </SectionHead>
          {data.jetskis.length > 0 && (
            <Pricing
              jetskis={data.jetskis}
              info={{
                cancelFreeHours: data.rules.cancelFreeHours,
                depositRules: data.settings.deposit_rules,
                extraFees: data.settings.extra_fees,
                rentalRules: data.settings.rental_rules,
              }}
            />
          )}
        </div>
      </section>

      <section id="jak-to-dziala" aria-labelledby="proces-title" className="on-light bg-sand py-20 md:py-28">
        <div className="wrap">
          <SectionHead id="proces-title" kicker="Jak to działa" title="Jak wygląda wynajem">
            Siedem kroków od wyboru skutera do pierwszego zakrętu na Zatoce. Rezerwacja online zajmuje kilka minut.
          </SectionHead>
          <Process />
          <Link href="/rezerwacja" className="btn btn-primary mt-12">
            Zacznij od kroku pierwszego
          </Link>
        </div>
      </section>

      <section id="galeria" aria-labelledby="galeria-title" className="on-dark bg-graphite py-20 text-white md:py-28">
        <div className="wrap">
          <SectionHead id="galeria-title" kicker="Galeria" title="Na wodzie">
            Z góry i z poziomu fali. Kliknij zdjęcie, żeby je powiększyć.
          </SectionHead>
          <Gallery items={gallery} />
        </div>
      </section>

      <section id="lokalizacja" aria-labelledby="lokalizacja-title" className="on-light bg-white py-20 md:py-28">
        <div className="wrap">
          <SectionHead id="lokalizacja-title" kicker="Lokalizacja" title="Gdzie nas znajdziesz">
            Startujemy z przystani w Sopocie, prosto na otwarte wody Zatoki Gdańskiej.
          </SectionHead>
          <Location data={data} />
        </div>
      </section>

      <section id="opinie" aria-labelledby="opinie-title" className="on-light bg-white pb-20 md:pb-28">
        <div className="wrap">
          <SectionHead id="opinie-title" kicker="Opinie" title="Opinie klientów" />
          <Suspense fallback={<p className="text-muted">Ładowanie opinii…</p>}>
            <Reviews />
          </Suspense>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="on-light bg-sand py-20 md:py-28">
        <div className="wrap">
          <Faq data={data} />
        </div>
      </section>

      <section id="kontakt" aria-labelledby="kontakt-title" className="on-dark bg-graphite py-20 text-white md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <span className="kicker mb-3">Kontakt</span>
            <h2 id="kontakt-title" className="display-lg">
              Napisz do nas
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/75">Pytanie o skuter, większą grupę albo voucher na prezent? Odpowiemy e-mailem.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

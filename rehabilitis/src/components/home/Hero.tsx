import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { BookingLink } from "@/components/ui/BookingLink";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

/**
 * Hero: konkretny nagłówek (czym zajmuje się gabinet i komu pomaga), następny krok
 * (umówienie wizyty) i najważniejsza informacja praktyczna – czas i cena pierwszej wizyty.
 * Zdjęcie gabinetu dochodzi do prawej krawędzi ekranu na dużych ekranach.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative border-b border-line">
      <div className="page grid lg:min-h-[38rem] lg:grid-cols-2">
        <div className="py-12 lg:py-20 lg:pr-14">
          <h1 id="hero-title" className="text-h1">
            Fizjoterapia i rehabilitacja po urazach, zabiegach i przy bólu kręgosłupa
          </h1>
          <p className="mt-6 max-w-[34rem] text-lead">
            {siteConfig.name} to gabinet fizjoterapii{siteConfig.city ? ` w ${siteConfig.city}` : ""}. Pracujemy indywidualnie: od oceny i planu
            terapii po ćwiczenia, które wykonujesz samodzielnie w domu.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BookingLink />
            <Link href="/cennik" className="btn btn-outline">
              Zobacz cennik
            </Link>
          </div>
          {FIRST_VISIT?.duration && FIRST_VISIT.price && (
            <p className="mt-6 text-small text-muted">
              Pierwsza wizyta: {FIRST_VISIT.duration}, {FIRST_VISIT.price}
              {PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}. Bez skierowania.
            </p>
          )}
        </div>

        <figure className="-mx-5 pb-8 md:-mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:w-[calc(50vw-1rem)] lg:max-w-[46rem] lg:pb-0">
          <div className="media aspect-[3/2] rounded-none lg:aspect-auto lg:h-full">
            <Photo image="hero" preload sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <PhotoCaption image="hero" className="px-5 md:px-8 lg:absolute lg:bottom-3 lg:left-4 lg:mt-0 lg:rounded-control lg:bg-white/90 lg:px-2 lg:py-0.5" />
        </figure>
      </div>
    </section>
  );
}

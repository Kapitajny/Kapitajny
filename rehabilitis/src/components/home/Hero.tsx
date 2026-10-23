import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { BookingLink } from "@/components/ui/BookingLink";
import { PendingValue } from "@/components/ui/Pending";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

/**
 * Hero: zwężony nagłówek na całą szerokość treści (czym zajmuje się gabinet i komu pomaga),
 * pod nim jedno działanie i fakty o pierwszej wizycie, a niżej mozaika trzech zdjęć z pracy.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pb-section pt-10 lg:pt-16">
      <div className="content">
        <h1 id="hero-title" className="max-w-[16ch] text-display">
          Fizjoterapia po urazach, zabiegach i przy bólu kręgosłupa
        </h1>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12">
          <div>
            <p className="max-w-prose text-lead text-ink">
              {siteConfig.name} to gabinet rehabilitacji{siteConfig.city ? ` w ${siteConfig.city}` : ""}. Pracujemy jeden na jeden: oceniamy, co sprawia
              trudność, układamy plan terapii i uczymy ćwiczeń, które wykonujesz w domu.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <BookingLink />
              <Link href="/o-gabinecie#przebieg" className="link">
                Jak wygląda pierwsza wizyta
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-start rounded-photo bg-mint p-6">
            <div>
              <dt className="text-small text-muted">Pierwsza wizyta</dt>
              <dd className="text-h3 type-condensed">{FIRST_VISIT?.duration ?? <PendingValue />}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">Koszt{PRICES_ARE_EXAMPLES ? " (przykładowy)" : ""}</dt>
              <dd className="text-h3 type-condensed">{FIRST_VISIT?.price ?? <PendingValue />}</dd>
            </div>
            <div className="col-span-2 border-t border-mint-strong pt-4 text-small">
              <dt className="sr-only">Skierowanie</dt>
              <dd>Na wizytę prywatną nie potrzebujesz skierowania.</dd>
            </div>
          </dl>
        </div>

        {/* Mozaika: duże zdjęcie z gabinetu i dwa mniejsze z ćwiczeń – na telefonie duże u góry, dwa mniejsze obok siebie.
            Duże zdjęcie (LCP) jest widoczne od razu; po kolei pojawiają się tylko dwa mniejsze. */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-2 md:gap-5">
          <div className="col-span-2 md:col-span-7 md:row-span-2">
            <div className="photo aspect-[4/3] md:aspect-auto md:h-full md:min-h-[26rem]">
              <Photo image="hero" preload sizes="(min-width: 1024px) 40rem, (min-width: 768px) 58vw, 92vw" />
            </div>
          </div>
          <div className="mosaic-in md:col-span-5">
            <div className="photo aspect-square md:aspect-[3/2]">
              <Photo image="serviceOrthopedic" sizes="(min-width: 1024px) 28rem, (min-width: 768px) 40vw, 46vw" />
            </div>
          </div>
          <div className="mosaic-in md:col-span-5" style={{ ["--delay" as string]: "140ms" }}>
            <div className="photo aspect-square md:aspect-[3/2]">
              <Photo image="serviceMassage" sizes="(min-width: 1024px) 28rem, (min-width: 768px) 40vw, 46vw" />
            </div>
          </div>
        </div>
        <PhotoCaption image="hero" className="mt-3" asParagraph />
      </div>
    </section>
  );
}

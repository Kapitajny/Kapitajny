import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

/** Odliczanie, którym instruktor zaczyna każdy układ. Każda cyfra stoi o stopień wyżej – jak kroki. */
const COUNT = ["5", "6", "7", "8"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="container-x grid items-end gap-10 pb-14 pt-6 md:pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-20">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="display">
            <span className="sr-only">5, 6, 7, 8 </span>
            <span className="flex items-end gap-[0.18em]" aria-hidden="true">
              {COUNT.map((digit, index) => (
                <span
                  key={digit}
                  className="count-beat"
                  style={{ marginBottom: `${index * 0.14}em`, animationDelay: `${400 + index * 500}ms` }}
                >
                  {digit}
                </span>
              ))}
            </span>
            <span className="mt-[0.12em] block">i zaczynasz tańczyć.</span>
          </h1>
          <p className="lead prose-measure mt-8 max-w-[44ch]">
            Tak instruktor odlicza przed każdym układem. U nas odliczamy cierpliwie: w małych grupach, od pierwszego kroku, bez oceniania i we
            własnym tempie każdej osoby.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="#zapis" className="btn btn-primary">
              Umów lekcję próbną
            </Link>
            <Link href="#zajecia" className="btn btn-secondary">
              Poznaj nasze zajęcia
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-blush sm:aspect-[5/4] lg:aspect-[4/5]">
            <Photo
              photo="classJoy"
              sizes="(min-width: 1312px) 30rem, (min-width: 1024px) 38vw, 92vw"
              position="55% 45%"
              preload
            />
          </div>
          <p className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-cocoa px-5 py-4 text-[0.95rem] text-ivory sm:left-auto sm:max-w-xs">
            Pierwsza lekcja próbna kosztuje 25 zł i nie wymaga żadnego doświadczenia. <span className="text-blush">Cena przykładowa.</span>
          </p>
        </div>
      </div>

      <a
        href="#o-nas"
        className="mx-auto mb-4 mt-6 hidden w-fit items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:text-wine lg:flex"
      >
        <span className="relative block h-8 w-5 rounded-full border-[1.5px] border-current" aria-hidden="true">
          <span className="scroll-dot absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current" />
        </span>
        Przewiń, żeby poznać studio
      </a>
    </section>
  );
}

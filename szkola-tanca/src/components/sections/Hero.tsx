import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-16 pt-8 md:pt-12 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-12 lg:gap-8 lg:pb-20">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow">Studio tańca dla dorosłych</p>
          <h1 id="hero-title" className="display mt-6">
            Nie musisz umieć tańczyć, <em className="text-wine">żeby zacząć.</em>
          </h1>
          <p className="lead prose-measure mt-7 max-w-[46ch]">
            Swoboda to miejsce, w którym ruch zaczyna się od oddechu, a nie od oceny. Uczymy w małych grupach, cierpliwie i we własnym tempie każdej
            osoby – od pierwszego kroku po własną choreografię.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="#zapis" className="btn btn-primary">
              Umów lekcję próbną
            </Link>
            <Link href="#zajecia" className="btn btn-secondary">
              Poznaj nasze zajęcia
            </Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t rule pt-6">
            {[
              ["5", "stylów tańca"],
              ["4", "poziomy, od zera"],
              ["25 zł", "lekcja próbna*"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-3xl text-wine sm:text-4xl">{value}</dd>
                <dd className="mt-1 text-sm leading-snug">{label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs">*cena przykładowa</p>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full bg-blush sm:max-w-lg lg:max-w-none">
            <Photo photo="classJoy" sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 46vw, (min-width: 640px) 32rem, 92vw" position="52% 50%" preload />
          </div>
          <p className="relative mx-auto -mt-10 w-[86%] max-w-sm bg-blush px-6 py-5 font-serif text-xl leading-snug text-cocoa sm:text-2xl lg:-ml-10 lg:mr-auto">
            Pierwszy krok jest najtrudniejszy. <span className="text-wine">Zrobimy go razem.</span>
          </p>
        </div>
      </div>

      <a
        href="#o-nas"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] lg:flex"
      >
        <span>Przewiń</span>
        <span className="relative h-10 w-px overflow-hidden bg-cocoa/15" aria-hidden="true">
          <span className="scroll-cue-line absolute inset-0 bg-wine" />
        </span>
      </a>
    </section>
  );
}

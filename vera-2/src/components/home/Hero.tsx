import Link from "next/link";
import { bookingHref } from "@/config/site";
import { Photo } from "@/components/ui/Photo";

/** Napis biegnący po okręgu wokół owalnego portretu. */
function Ring() {
  const text = "twoje piękno · twoja tożsamość · véra aesthetic studio · ";
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className="text-orbit pointer-events-none absolute inset-0 h-full w-full overflow-visible text-rose-deep">
      <defs>
        <path id="ring-path" d="M200,200 m-188,0 a188,188 0 1,1 376,0 a188,188 0 1,1 -376,0" />
      </defs>
      <text className="fill-current font-sans" fontSize="12.5" letterSpacing="4.2">
        <textPath href="#ring-path">{text + text}</textPath>
      </text>
    </svg>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[var(--header-h)]">
      <h1 id="hero-title" className="sr-only">
        Twoje piękno. Twoja tożsamość. VÉRA Aesthetic Studio
      </h1>

      <div className="shell grid items-center gap-y-6 pb-16 pt-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-10 lg:pb-20 lg:pt-4">
        {/* Lewa strona: pierwsza linia hasła i krótki tekst. */}
        <div className="order-1 text-center lg:order-none lg:text-right">
          <p aria-hidden="true" className="script hero-rise text-[clamp(3rem,13vw,5.6rem)] leading-[0.95]" style={{ "--i": 0 } as React.CSSProperties}>
            Twoje
            <br />
            piękno.
          </p>
          <p className="hero-rise mx-auto mt-6 hidden max-w-xs text-base font-light text-stone lg:ml-auto lg:mr-0 lg:block" style={{ "--i": 2 } as React.CSSProperties}>
            Studio medycyny estetycznej i pielęgnacji skóry dla kobiet, które chcą wyglądać jak najlepsza wersja siebie – nie jak ktoś inny.
          </p>
        </div>

        {/* Środek: owalny portret w pierścieniu tekstu. */}
        <div className="relative order-2 mx-auto aspect-square w-[min(88vw,30rem)] lg:order-none lg:w-[min(36vw,34rem)]">
          <Ring />
          <div className="absolute inset-[9%_17%]">
            <Photo image="heroPortrait" priority sizes="(min-width: 1024px) 24vw, 60vw" className="hero-oval oval h-full w-full" focus="68% 18%" />
          </div>
        </div>

        {/* Prawa strona: druga linia hasła i zaproszenie. */}
        <div className="order-3 text-center lg:order-none lg:text-left">
          <p aria-hidden="true" className="script hero-rise text-[clamp(3rem,13vw,5.6rem)] leading-[0.95]" style={{ "--i": 1 } as React.CSSProperties}>
            Twoja
            <br />
            tożsamość.
          </p>
          <p className="hero-rise mx-auto mt-6 max-w-sm text-base font-light text-stone lg:hidden" style={{ "--i": 2 } as React.CSSProperties}>
            Studio medycyny estetycznej i pielęgnacji skóry dla kobiet, które chcą wyglądać jak najlepsza wersja siebie – nie jak ktoś inny.
          </p>
          <div className="hero-rise mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:flex-col lg:items-start" style={{ "--i": 3 } as React.CSSProperties}>
            <Link href={bookingHref} className="pill pill-solid">
              Umów się na konsultację
            </Link>
            <Link href="#dla-ciebie" className="pill pill-line">
              Znajdź zabieg dla siebie
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

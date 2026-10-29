import Image from "next/image";
import { photos } from "@/components/morelowa/images";

const FROM_THE_OVEN = ["Chleb żytni na zakwasie", "Bagietka", "Kajzerka", "Drożdżówka z morelą", "Tarta owocowa", "Sernik"];

/** Okrągła pieczęć piekarni – tekst biegnie po okręgu jak na stemplu. */
function Seal() {
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" className="h-28 w-28 sm:h-36 sm:w-36">
      <defs>
        <path id="pieczec-okrag" d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0" />
      </defs>
      <circle cx="80" cy="80" r="78" fill="var(--color-bordo)" />
      <circle cx="80" cy="80" r="44" fill="none" stroke="var(--color-zloto)" strokeWidth="1" />
      <text fill="var(--color-krem)" fontSize="11.5" letterSpacing="2" fontFamily="var(--font-sans)">
        <textPath href="#pieczec-okrag" textLength="356" lengthAdjust="spacing">
          RODZINNA PIEKARNIA • GRODZISK • WARSZAWA •
        </textPath>
      </text>
      <text x="80" y="76" textAnchor="middle" fill="var(--color-zloto)" fontSize="10" letterSpacing="3" fontFamily="var(--font-sans)">
        OD ROKU
      </text>
      <text x="80" y="102" textAnchor="middle" fill="var(--color-krem)" fontSize="28" fontFamily="var(--font-serif)">
        1991
      </text>
    </svg>
  );
}

export function Hero() {
  return (
    <section id="start" aria-labelledby="hero-tytul">
      <div className="wrap grid items-center gap-10 pt-6 pb-16 sm:pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-10 lg:pb-20">
        {/* GRAFIKA 1 – zdjęcie główne w łuku jak otwór pieca */}
        <div className="relative lg:order-2 lg:col-span-6 lg:col-start-7">
          <div className="arch relative mx-auto aspect-[4/5] max-h-[min(72svh,44rem)] w-full max-w-[36rem] overflow-hidden bg-bez">
            <Image
              src={photos.hero.src}
              alt={photos.hero.alt}
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 1344px) 576px, (min-width: 1024px) 44vw, 92vw"
              quality={85}
              className="object-cover object-[62%_50%]"
            />
          </div>
          <div className="absolute -bottom-6 left-2 sm:left-6 lg:-left-10 lg:bottom-10">
            <Seal />
          </div>
        </div>

        <div className="lg:order-1 lg:col-span-6">
          <p className="kicker">Rodzinna tradycja od 1991 roku</p>
          <h1 id="hero-tytul" className="title-xl mt-7 text-braz">
            Tradycja, którą czuć <em className="text-bordo italic">w każdym kęsie.</em>
          </h1>
          <p className="intro mt-8 max-w-[33rem] text-szary">
            Od ponad trzech dekad tworzymy pieczywo i słodkości, które łączą pokolenia. Każdy dzień zaczynamy od tego samego — dobrych składników,
            rzemieślniczej pracy i szacunku do tradycji.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <a href="#historia" className="pill pill-bordo">
              Poznaj naszą historię
            </a>
            <a href="#pieczywo" className="arrow-link text-braz hover:text-bordo">
              Odkryj nasze wypieki <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pasek z wypiekami */}
      <div className="on-dark bg-bordo text-krem">
        <div className="wrap flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-[0.72rem] font-medium tracking-[0.26em] uppercase">Codziennie z naszego pieca</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 font-serif text-[1.15rem] italic sm:text-[1.3rem]">
            {FROM_THE_OVEN.map((item, index) => (
              <li key={item} className="flex items-center gap-5">
                {index > 0 && <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-zloto not-italic" />}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

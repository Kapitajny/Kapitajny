import type { CSSProperties } from "react";
import { formatPrice, promo } from "@/data/offer";

/** Wschód słońca nad morzem chmur – „początek współpracy”. Jedyne miejsce, w którym pojawia się kolor słońca. */
function Sunrise({ className }: { className?: string }) {
  // Grzbiety chmur rysowane płaskimi łukami – im bliżej widza, tym ciemniejsze; górną krawędź warstwy środkowej muska światło.
  const ridge = (y: number, widths: number[]) =>
    `M-20 ${y}` + widths.map((w) => `a${w * 0.56} ${w * 0.2} 0 0 1 ${w} 0`).join("") + "V560H-20Z";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 560"
      className={className}
      fill="none"
      style={{ maskImage: "radial-gradient(ellipse 50% 62% at 50% 72%, #000 60%, transparent 100%)" }}
    >
      <defs>
        <radialGradient id="sun-glow" cx="400" cy="400" r="330" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffc25c" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#ff9f5a" stopOpacity="0.1" />
          <stop offset="1" stopColor="#ff9f5a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sun-disc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6b3" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <g className="origin-[400px_400px] animate-[glow_9s_ease-in-out_infinite]">
        <circle cx="400" cy="400" r="330" fill="url(#sun-glow)" />
      </g>
      <circle cx="400" cy="410" r="120" fill="url(#sun-disc)" />
      <path d={ridge(448, [120, 70, 150, 90, 110, 140, 160])} fill="#173a83" />
      <path d={ridge(478, [90, 160, 110, 130, 80, 150, 140])} fill="#102c6b" />
      <path d={ridge(478, [90, 160, 110, 130, 80, 150, 140])} stroke="#ffc25c" strokeOpacity="0.4" />
      <path d={ridge(518, [150, 100, 170, 120, 140, 160])} fill="#0a1d4b" />
    </svg>
  );
}

const conditions = [
  "Cena promocyjna dotyczy realizacji strony internetowej – nie obejmuje sklepu internetowego.",
  `Oferta jest ograniczona do pierwszych ${promo.seats === 5 ? "pięciu" : promo.seats} klientów ComputerIT.`,
  "Szczegółowy zakres realizacji ustalamy indywidualnie przed rozpoczęciem współpracy.",
];

export function Promo() {
  return (
    <section
      id="promocja"
      tabIndex={-1}
      aria-labelledby="promocja-title"
      className="on-dark section relative isolate overflow-hidden bg-[linear-gradient(to_bottom,#0c2257,#081738)] text-white outline-none"
    >
      <Sunrise className="absolute right-[-20%] bottom-0 -z-10 w-[min(140%,64rem)] opacity-90 sm:right-[-8%] lg:right-[-2%] lg:w-[min(64vw,62rem)]" />

      <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="reveal inline-flex border border-sun/70 px-3 py-1.5 text-[0.8125rem] font-semibold tracking-[0.08em] text-sun">
            OFERTA LIMITOWANA — {promo.seats} MIEJSC
          </p>
          <h2 id="promocja-title" className="reveal title-xl mt-8 max-w-[16ch]" style={{ "--d": "80ms" } as CSSProperties}>
            Rozpocznijmy współpracę na wyjątkowych warunkach.
          </h2>
          <p className="reveal lead mt-6 text-mist" style={{ "--d": "160ms" } as CSSProperties}>
            Specjalna oferta dla pierwszych pięciu klientów ComputerIT.
          </p>
          <p className="reveal mt-8 max-w-[36rem] text-white/85" style={{ "--d": "220ms" } as CSSProperties}>
            Skorzystaj z wyjątkowej ceny na realizację strony internetowej w ramach limitowanej oferty dla pierwszych pięciu klientów.
          </p>
          <ul className="reveal mt-8 max-w-[36rem] space-y-3 text-[0.9375rem] text-mist" style={{ "--d": "280ms" } as CSSProperties}>
            {conditions.map((condition) => (
              <li key={condition} className="flex gap-4">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-sun/80" />
                {condition}
              </li>
            ))}
          </ul>
          <a href="#kontakt" data-project="promocja" className="reveal btn btn-sun mt-10" style={{ "--d": "340ms" } as CSSProperties}>
            Skorzystaj z promocji
          </a>
        </div>

        <div className="reveal pb-[min(48vw,15rem)] lg:col-span-5 lg:pb-[clamp(6rem,14vw,12rem)] lg:text-right" style={{ "--d": "200ms" } as CSSProperties}>
          <p className="text-[1rem] text-mist">Strona internetowa</p>
          <p className="wide mt-2 text-[clamp(4.5rem,11vw,9.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-sun [text-shadow:0_0_60px_rgb(255_194_92/0.25)]">
            {formatPrice(promo.price)}&nbsp;zł
          </p>
        </div>
      </div>
    </section>
  );
}

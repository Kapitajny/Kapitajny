import type { CSSProperties } from "react";
import { Blueprint } from "./Blueprint";
import { SkyCanvas } from "./SkyCanvas";
import { Wordmark } from "./Wordmark";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="start"
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[max(100svh,44rem)] flex-col overflow-hidden bg-[linear-gradient(to_bottom,#0a2264,#1951ba_55%,#78abec)] text-white"
    >
      <SkyCanvas className="absolute inset-0 -z-20 h-full w-full" />
      {/* Przejście z morza chmur w jasne tło kolejnej sekcji. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[16vh] bg-gradient-to-b from-cloud/0 to-cloud" />

      <div className="container-x flex flex-1 flex-col pt-[calc(var(--header-h)+clamp(1.5rem,7vh,4.5rem))] pb-[clamp(9rem,26vh,15rem)]">
        <Wordmark />

        <div className="relative mt-[clamp(2.5rem,7vh,5rem)] grid flex-1 items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <h1
              id="hero-title"
              className="intro-after text-[clamp(2rem,4.2vw,3.5rem)] [text-shadow:0_1px_24px_rgb(8_23_56/0.25)]"
              style={delay(0)}
            >
              Projektuję strony, które budują wizerunek Twojej firmy.
            </h1>
            <p className="intro-after lead mt-6 max-w-[34rem] text-white/90 [text-shadow:0_1px_18px_rgb(8_23_56/0.3)]" style={delay(180)}>
              Tworzę nowoczesne strony internetowe i sklepy online, które pomagają firmom rozwijać swoją obecność w internecie.
            </p>
            <div className="intro-after mt-9 flex flex-wrap gap-3" style={delay(340)}>
              <a href="#uslugi" className="btn btn-light">
                Poznaj ofertę
              </a>
              <a href="#portfolio" className="btn btn-outline-light">
                Zobacz portfolio
              </a>
            </div>
          </div>

          <Blueprint className="pointer-events-none w-[min(100%,34rem)] justify-self-end text-white opacity-80 md:col-span-12 lg:absolute lg:-top-6 lg:right-[-2vw] lg:w-[min(46vw,40rem)] lg:opacity-100" />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PORTFOLIO_IS_SAMPLE, workById, workSrc } from "@/config/work";
import { ArrowIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { Wordmark } from "@/components/ui/Seal";

const SCROLLS = [
  { id: "lotus-spine", className: "mt-16 sm:mt-24", delay: 250 },
  { id: "tiger-chest", className: "", delay: 0 },
  { id: "floral-mandala", className: "mt-10 sm:mt-14", delay: 450 },
];

/** Zwój kakejiku: sznurek, górny drążek, oprawa z papieru i dolny wałek z gałkami. */
function HangingScroll({ id, className, delay, preload }: { id: string; className: string; delay: number; preload?: boolean }) {
  const work = workById(id);
  return (
    <figure className={`kakejiku flex w-full flex-col items-center ${className}`} style={{ ["--unroll-delay" as string]: `${delay}ms` }}>
      <svg viewBox="0 0 100 22" className="h-auto w-[62%] text-usuzumi" aria-hidden="true">
        <path d="M8 22 50 2 92 22" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="50" cy="2" r="1.6" fill="currentColor" />
      </svg>
      <div className="h-[7px] w-[104%] rounded-[1px] bg-[#3d342a] shadow-[0_2px_0_rgba(0,0,0,0.25)]" />
      <div className="kakejiku-roll w-full">
        <div className="overflow-hidden">
          <div className="bg-kinari px-[7%] pb-[22%] pt-[9%] shadow-[0_30px_50px_-30px_rgba(0,0,0,0.9)]">
            <div className="relative aspect-[3/5] w-full overflow-hidden bg-sumi-3">
              <Image
                src={workSrc(work)}
                alt={work.alt}
                fill
                preload={preload}
                quality={85}
                sizes="(min-width: 1024px) 15vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-[11px] w-[112%] rounded-full bg-[#2c251e]">
        <span className="absolute -left-[3px] top-1/2 h-[15px] w-[9px] -translate-y-1/2 rounded-[3px] bg-[#4a3f33]" />
        <span className="absolute -right-[3px] top-1/2 h-[15px] w-[9px] -translate-y-1/2 rounded-[3px] bg-[#4a3f33]" />
      </div>
    </figure>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative isolate flex min-h-svh flex-col overflow-hidden bg-sumi text-washi">
      <div className="page-x relative z-10 flex items-center justify-between pt-6 sm:pt-8">
        <Link href="/" aria-label={`${siteConfig.name} — strona główna`} className="rounded-sm">
          <Wordmark />
        </Link>
        <p className="hidden font-gothic text-xs tracking-[0.2em] text-usuzumi sm:block">{siteConfig.city}</p>
      </div>

      <div className="page-x relative z-10 grid flex-1 items-center gap-y-14 pb-36 pt-14 lg:grid-cols-12 lg:gap-x-10 lg:pb-40 lg:pt-6">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className="hero-in">
            <span className="display block text-[clamp(5.25rem,19vw,15.5rem)] font-normal leading-[0.86] tracking-[0.06em]">
              {siteConfig.name}
            </span>
            <span className="mt-7 block max-w-[24rem] font-gothic text-sm font-medium leading-relaxed tracking-[0.28em] text-kinari sm:max-w-none">
              {siteConfig.tagline}
            </span>
          </h1>
          <p className="hero-in mt-8 max-w-[30rem] font-mincho text-lg leading-[1.85] text-washi/85 [--hero-delay:150ms]">
            Autorskie projekty tatuaży inspirowane japońską sztuką — jej symboliką, proporcjami i harmonią. Każdy projekt
            zaczynamy od rozmowy o Twojej historii.
          </p>
          <div className="hero-in mt-10 flex flex-wrap gap-3 [--hero-delay:300ms]">
            <Link href="/rezerwacja" className="btn btn-paper">
              Book your tattoo
            </Link>
            <Link href="#gallery" className="btn btn-line text-washi">
              See the work
              <ArrowIcon direction="down" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="mx-auto grid max-w-[34rem] grid-cols-3 items-start gap-[5%]">
            {SCROLLS.map((scroll, index) => (
              <HangingScroll key={scroll.id} {...scroll} preload={index === 1} />
            ))}
          </div>
          {PORTFOLIO_IS_SAMPLE && (
            <p className="mt-6 text-center font-gothic text-2xs tracking-[0.12em] text-usuzumi">Zdjęcia poglądowe</p>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 text-washi/[0.13] [mask-image:linear-gradient(to_top,black_30%,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" scale={1.1} strokeWidth={0.8} />
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { PORTFOLIO_IS_SAMPLE, workById, workSrc, type WorkId } from "@/config/work";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { BrandTagline } from "@/components/ui/BrandTagline";
import { ArrowIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { Wordmark } from "@/components/ui/Seal";

/** Panele parawanu byōbu — kąt złożenia na przemian, jak w prawdziwym parawanie. */
const PANELS: { id: WorkId; fold: number }[] = [
  { id: "lotus-spine", fold: 14 },
  { id: "candle-lantern", fold: -14 },
  { id: "floral-mandala", fold: 14 },
  { id: "skull-anubis", fold: -14 },
];

export function Hero() {
  const { t } = useI18n();
  const screenRef = useRef<HTMLDivElement>(null);

  // Delikatne pochylenie parawanu w stronę kursora (tylko precyzyjny wskaźnik, bez reduced motion).
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!query.matches) return;
    const section = screen.closest("section");
    const onMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      screen.style.setProperty("--tilt", (x * 2).toFixed(3));
    };
    const onLeave = () => screen.style.setProperty("--tilt", "0");
    section?.addEventListener("pointermove", onMove);
    section?.addEventListener("pointerleave", onLeave);
    return () => {
      section?.removeEventListener("pointermove", onMove);
      section?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-sumi text-washi lg:min-h-svh">
      <div className="page-x relative z-10 flex items-center justify-between gap-4 pt-5 sm:pt-7">
        <LocalizedLink route="home" aria-label={t.common.homeLink(siteConfig.name)} className="rounded-sm">
          <Wordmark />
        </LocalizedLink>
        <LanguageSwitcher />
      </div>

      <div className="page-x relative z-10 grid items-center gap-y-16 pb-36 pt-14 lg:grid-cols-12 lg:gap-x-12 lg:pb-40 lg:pt-10">
        <div className="lg:col-span-6">
          <h1 id="hero-title" className="hero-in">
            <span className="display block text-[clamp(5rem,15vw,12.5rem)] font-normal leading-[0.84] tracking-[0.04em]">{siteConfig.name}</span>
            <span className="mt-6 block max-w-[16ch] font-mincho text-[clamp(1.6rem,3vw,2.5rem)] font-normal leading-[1.15] text-washi">
              {t.hero.title}
            </span>
          </h1>
          <div className="hero-in mt-8 flex items-center gap-4 [--hero-delay:120ms]">
            <span aria-hidden="true" className="h-px w-10 bg-kin" />
            <BrandTagline className="font-gothic text-2xs font-medium tracking-[0.28em] text-kinari sm:text-xs" />
          </div>
          <p className="lead hero-in mt-8 text-washi/80 [--hero-delay:240ms]">{t.hero.lead}</p>
          <div className="hero-in mt-10 flex flex-wrap gap-3 [--hero-delay:360ms]">
            <LocalizedLink route="booking" className="btn btn-paper">
              {t.hero.ctaPrimary}
              <ArrowIcon className="btn-arrow h-4 w-4" />
            </LocalizedLink>
            <LocalizedLink route="home" hash="gallery" className="btn btn-line text-washi">
              {t.hero.ctaSecondary}
            </LocalizedLink>
          </div>
        </div>

        <figure className="relative lg:col-span-6">
          <div
            ref={screenRef}
            role="group"
            aria-label={t.hero.screenLabel}
            className="mx-auto flex max-w-[40rem] items-stretch justify-center [perspective:1400px]"
          >
            {PANELS.map((panel, index) => {
              const work = workById(panel.id);
              return (
                <div
                  key={panel.id}
                  className="byobu-panel relative w-1/4 border-x-[3px] border-y-[5px] border-[#0c0a08] bg-[#0c0a08] shadow-[0_40px_60px_-35px_rgba(0,0,0,0.95)]"
                  style={{
                    ["--fold" as string]: `${panel.fold}deg`,
                    ["--i" as string]: index,
                    transformOrigin: index % 2 === 0 ? "right center" : "left center",
                  }}
                >
                  <div className="relative aspect-[1/2.5] overflow-hidden outline outline-1 -outline-offset-4 outline-kin/50">
                    <Image
                      src={workSrc(work)}
                      alt={t.work.items[panel.id].alt}
                      fill
                      preload={index === 1}
                      quality={85}
                      sizes="(min-width: 1024px) 12vw, 24vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/35"
                      style={{ transform: panel.fold < 0 ? "scaleX(-1)" : undefined }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {PORTFOLIO_IS_SAMPLE && (
            <figcaption className="mt-8 text-center font-gothic text-2xs tracking-[0.12em] text-usuzumi">{t.common.samplePhotos}</figcaption>
          )}
        </figure>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 text-washi/[0.12] [mask-image:linear-gradient(to_top,black_30%,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" scale={1.1} strokeWidth={0.8} />
      </div>
    </section>
  );
}

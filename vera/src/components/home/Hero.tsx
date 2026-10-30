import Link from "next/link";
import { bookingHref } from "@/config/site";
import { Photo } from "@/components/ui/Photo";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative flex flex-col overflow-hidden lg:block lg:min-h-[max(100svh,44rem)]">
      {/* Campaign photo: right 60% on desktop, full-bleed below the headline on mobile. */}
      <div className="hero-photo order-2 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[60%]">
        <Photo
          image="heroPortrait"
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-auto lg:h-full"
          focus="64% 22%"
        />
      </div>

      <div className="shell relative z-10 order-1 flex flex-col pt-[calc(var(--header-h)+2.5rem)] lg:min-h-[max(100svh,44rem)] lg:justify-end lg:pb-14 lg:pt-[var(--header-h)]">
        <h1 id="hero-title" className="display offset-lines text-[clamp(3.1rem,13.6vw,6rem)] text-burgundy sm:text-[clamp(5rem,12vw,7.5rem)] lg:text-[clamp(6.5rem,10.4vw,11.5rem)]">
          <span className="-mb-[0.14em] overflow-hidden pb-[0.14em]">
            <span className="hero-line" style={{ "--i": 0 } as React.CSSProperties}>
              Your beauty.
            </span>
          </span>
          <span className="-mb-[0.2em] overflow-hidden pb-[0.2em]">
            <span className="hero-line" style={{ "--i": 1 } as React.CSSProperties}>
              Your identity.
            </span>
          </span>
        </h1>

        <div className="mt-8 grid gap-8 pb-10 sm:grid-cols-[minmax(0,26rem)_auto] sm:items-end sm:gap-12 lg:mt-12 lg:max-w-[38%] lg:grid-cols-1 lg:pb-0 xl:max-w-[34%]">
          <p className="hero-fade text-lg leading-relaxed text-black/85" style={{ "--i": 0 } as React.CSSProperties}>
            VÉRA is a studio for aesthetic medicine and professional skin care in Warszawa. We begin with a consultation, plan in small steps and keep you recognisably yourself.
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-x-8 gap-y-4" style={{ "--i": 1 } as React.CSSProperties}>
            <Link href={bookingHref} className="btn btn-primary">
              Book a consultation
            </Link>
            <Link href="/treatments" className="link-line text-sm font-semibold text-burgundy">
              See treatments
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#philosophy"
        className="hero-fade absolute bottom-10 right-[var(--gutter)] z-10 hidden flex-col items-center gap-3 text-xs font-medium text-ivory lg:flex"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span aria-hidden="true" className="relative block h-14 w-px overflow-hidden bg-ivory/30">
          <span className="scroll-cue-line absolute inset-0 bg-ivory" />
        </span>
      </a>
    </section>
  );
}

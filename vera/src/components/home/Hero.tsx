import Link from "next/link";
import { bookHref, site } from "@/config/site";
import { Shot } from "@/components/ui/Shot";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[var(--bar)]">
      <div className="wrap grid min-h-[calc(100svh-var(--bar))] gap-y-10 pb-12 pt-8 lg:grid-cols-12 lg:gap-x-8 lg:pb-14 lg:pt-10">
        <div className="relative z-10 flex flex-col lg:col-span-7">
          <p className="kicker hero-fade text-rose-deep">
            {site.contact.city}, {site.contact.district}
          </p>
          <h1 id="hero-title" className="mt-6 font-display text-[clamp(3.5rem,15vw,5.5rem)] leading-[0.9] tracking-[-0.035em] text-black lg:mt-auto lg:text-[clamp(5rem,8.4vw,10.5rem)]">
            <span className="mask-line" style={{ "--i": 0 } as React.CSSProperties}>
              <span>Your beauty.</span>
            </span>{" "}
            <span className="mask-line pl-[0.5em] italic text-burgundy" style={{ "--i": 1 } as React.CSSProperties}>
              <span>Your identity.</span>
            </span>
          </h1>
          <div className="hero-fade mt-10 grid gap-8 sm:grid-cols-[minmax(0,24rem)_auto] sm:items-end lg:mt-14 lg:grid-cols-1 xl:grid-cols-[minmax(0,24rem)_auto]">
            <p className="text-stone">
              An aesthetic medicine and skin studio in Kraków. We start with your features and your skin – and plan treatments that keep them
              unmistakably yours.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href={bookHref} className="cta cta-burgundy">
                Book a consultation
              </Link>
              <Link href="/treatments" className="underline-draw text-sm font-medium">
                Explore treatments
              </Link>
            </div>
          </div>
          <a href="#philosophy" className="hero-fade mt-14 hidden items-center gap-4 self-start text-black lg:flex" aria-label="Scroll to Our philosophy">
            <span aria-hidden="true" className="scroll-cue relative block h-12 w-px overflow-hidden bg-black/15" />
            <span className="kicker">Scroll</span>
          </a>
        </div>

        <div className="relative lg:col-span-5 lg:-mr-[var(--pad)]">
          <div className="hero-photo relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <Shot image="heroCampaign" sizes="(min-width: 1024px) 42vw, 100vw" preload />
          </div>
        </div>
      </div>
    </section>
  );
}

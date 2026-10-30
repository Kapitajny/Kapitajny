import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";
import { Photo } from "@/components/ui/Photo";

const lines = ["Piękno", "w harmonii", "z Tobą."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="frame relative grid gap-y-12 pb-20 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-x-8 lg:pb-28 lg:pt-14">
      <div className="relative z-10 flex flex-col lg:col-span-6 lg:pt-16 xl:col-span-6">
        <h1 id="hero-title" className="text-[clamp(3.4rem,12.5vw,8rem)] lg:text-[clamp(5rem,8.4vw,8rem)] leading-[0.92] tracking-[-0.025em] text-espresso">
          {lines.map((line, i) => (
            <span key={line} className={`hero-line ${i === 1 ? "pl-[0.6em]" : i === 2 ? "pl-[0.25em]" : ""}`} style={{ "--i": i } as React.CSSProperties}>
              <span>{line}</span>
              {i < lines.length - 1 && " "}
            </span>
          ))}
        </h1>

        <div className="hero-after mt-10 max-w-md sm:mt-12 lg:ml-[0.6em] lg:mt-14">
          <p className="text-base text-taupe sm:text-lg">
            Klinika medycyny estetycznej i kosmetologii w warszawskim Śródmieściu. Każdą współpracę zaczynamy od rozmowy, a zabiegi dobieramy tak, by
            podkreślały Twoje rysy, nie je zmieniały.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={bookingHref} className="btn btn-primary">
              Umów konsultację
            </Link>
            <Link href="/zabiegi" className="link-quiet text-sm font-medium">
              Poznaj zabiegi
            </Link>
          </div>
        </div>
      </div>

      <div className="relative lg:col-span-6 lg:col-start-7">
        {/* Łuk – motyw zaczerpnięty z ramy logo ÉLORIA. */}
        <div className="relative mx-auto w-[86%] max-w-[34rem] sm:w-[70%] lg:ml-auto lg:mr-0 lg:w-[88%]">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-3 rounded-t-full border border-champagne/70 sm:-inset-4" />
          <div className="hero-unveil relative aspect-[4/5] overflow-hidden rounded-t-full bg-blush">
            <div className="absolute inset-0">
              <Photo image="highlightRoom" sizes="(min-width: 1024px) 44vw, (min-width: 640px) 70vw, 86vw" preload className="object-[62%_50%]" />
            </div>
          </div>

          <figure className="hero-after absolute -bottom-10 -left-[12%] w-[42%] max-w-[13rem] sm:-left-[22%] lg:-left-[30%] lg:bottom-14">
            <div className="relative aspect-square overflow-hidden border-[6px] border-ivory bg-blush sm:border-8">
              <Photo image="heroDetail" sizes="(min-width: 1024px) 208px, 40vw" hideCaption />
            </div>
          </figure>
        </div>

        <p className="hero-after mt-16 text-right text-xs text-taupe sm:mt-10 lg:mr-0">
          Gabinet zabiegowy, {siteConfig.contact.district}
        </p>
      </div>
    </section>
  );
}

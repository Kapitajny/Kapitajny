import Link from "next/link";
import { LOCATIONS } from "@/data/locations";
import { getProduct, PRODUCTS } from "@/data/menu";
import { formatPrice } from "@/lib/pricing";
import { PICKUP_RULES } from "@/lib/pickup";
import { QuickAddButton } from "@/components/cart/AddToCartButton";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

const featured = getProduct("cappuccino")!;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-14 pb-20 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-16">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow motion-safe:animate-[toast-in_700ms_var(--ease-soft)_both]">Kawiarnia specialty · Gdańsk</p>
          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.75rem,1.4rem+5.2vw,6.25rem)] leading-[0.98] motion-safe:animate-[toast-in_900ms_var(--ease-soft)_80ms_both]"
          >
            Dobre poranki zaczynają się od <em className="font-light italic text-latte">dobrej kawy.</em>
          </h1>
          <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-muted motion-safe:animate-[toast-in_900ms_var(--ease-soft)_160ms_both] md:text-xl">
            Starannie wyselekcjonowane ziarna, perfekcyjnie przygotowane espresso i chwila, która należy tylko do Ciebie.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 motion-safe:animate-[toast-in_900ms_var(--ease-soft)_240ms_both]">
            <Link href="/#menu" className="btn btn-primary">
              Zamów swoją kawę <ArrowRightIcon size={18} />
            </Link>
            <Link href="/#lokale" className="btn btn-secondary">
              Poznaj nasze lokale
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t sm:gap-6 border-line pt-6">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Lokale</dt>
              <dd className="mt-1 whitespace-nowrap font-serif text-[1.4rem] text-roast sm:text-3xl">{LOCATIONS.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">W menu</dt>
              <dd className="mt-1 whitespace-nowrap font-serif text-[1.4rem] text-roast sm:text-3xl">{PRODUCTS.length} kaw</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-muted">Odbiór</dt>
              <dd className="mt-1 whitespace-nowrap font-serif text-[1.4rem] text-roast sm:text-3xl">od {PICKUP_RULES.leadMinutes} min</dd>
            </div>
          </dl>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <div aria-hidden="true" className="absolute -right-24 bottom-[-3rem] top-16 w-3/4 rounded-sm bg-sand lg:-right-40" />
          <RotatingBadge />
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-[50%_50%_1rem_1rem/40%_40%_1rem_1rem] shadow-[var(--shadow-lift)]">
            {/* Zdjęcie hero: public/images/coffee/hero-coffee.jpg (podmień na własne, min. 2000 px) */}
            <Photo image="hero" sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 45vw, 92vw" preload placeholderLabel="NOIR COFFEE" />
          </div>
          <div className="relative -mt-14 ml-auto mr-2 flex w-fit max-w-[19rem] items-center gap-4 rounded-2xl border border-line bg-paper/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:mr-6">
            <div>
              <p className="font-serif text-xl leading-tight text-roast">{featured.name}</p>
              <p className="text-sm text-muted">{formatPrice(featured.basePrice, { compact: true })} · z mlekiem krowim</p>
            </div>
            <QuickAddButton productId={featured.id} label="Dodaj" className="btn btn-primary btn-sm shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

function RotatingBadge() {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="absolute -left-2 top-4 z-10 hidden h-28 w-28 text-roast motion-safe:animate-[spin_28s_linear_infinite] sm:block lg:-left-10"
    >
      <defs>
        <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--color-cream)" />
      <text fontSize="9.2" letterSpacing="1.9" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="600">
        <textPath href="#badge-circle">ŚWIEŻO PARZONA · ODBIÓR W LOKALU ·</textPath>
      </text>
      <circle cx="60" cy="60" r="9" fill="currentColor" />
    </svg>
  );
}

import { phoneHref, siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { BookingLink } from "@/components/ui/BookingLink";

/** Zamknięcie podstrony: jedno działanie – umówienie pierwszej wizyty. */
export function CtaBand() {
  const { phone } = siteConfig.contact;
  return (
    <section aria-labelledby="umow-sie" className="on-dark bg-brand-strong text-white">
      <div className="page grid gap-8 py-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:py-16">
        <div>
          <h2 id="umow-sie" className="text-h2 text-white">
            Umów pierwszą wizytę
          </h2>
          <p className="mt-3 max-w-prose text-white/85">
            {FIRST_VISIT?.duration && FIRST_VISIT.price
              ? `Konsultacja trwa ${FIRST_VISIT.duration} i kosztuje ${FIRST_VISIT.price}${PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}. `
              : ""}
            Nie potrzebujesz skierowania na wizytę prywatną.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <BookingLink className="btn btn-light" />
          {phone && (
            <a href={phoneHref(phone)} className="btn border-white/70 text-white hover:bg-white/10">
              Zadzwoń: {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

import { siteConfig } from "@/config/site";
import { PRICE_LIST } from "@/data/pricing";
import { BookingLink } from "@/components/ui/BookingLink";
import { CheckIcon } from "@/components/ui/Icons";
import { PendingValue } from "@/components/ui/Pending";
import { Photo } from "@/components/ui/Photo";

const STRENGTHS = ["Indywidualne podejście", "Plan terapii dopasowany do potrzeb", "Jasne zasady współpracy"];

export function Hero() {
  const consultation = PRICE_LIST[0];
  const facts = [
    { label: "Pierwsza wizyta", value: consultation?.duration },
    { label: "Konsultacja", value: consultation?.price },
    { label: "Skierowanie", value: "niepotrzebne na wizyty prywatne" },
    { label: "Zapisy", value: siteConfig.bookingUrl ? "online lub telefonicznie" : "telefonicznie lub przez formularz" },
  ];

  return (
    <section aria-labelledby="hero-title">
      <div className="container-x grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <div>
          <h1 id="hero-title" className="h1">
            Odzyskaj swobodę ruchu. Zadbaj o siebie.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Indywidualnie dopasowana rehabilitacja i fizjoterapia, które wspierają powrót do sprawności i pomagają zadbać o komfort codziennego życia.
          </p>
          <ul className="mt-6 space-y-2">
            {STRENGTHS.map((item) => (
              <li key={item} className="flex items-center gap-3 font-medium text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-forest">
                  <CheckIcon size={15} strokeWidth={2.2} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingLink />
            <a href="#uslugi" className="btn btn-outline">
              Poznaj nasze usługi
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sage lg:aspect-[1/0.9]">
          <Photo image="hero" preload sizes="(min-width: 1024px) 36rem, 92vw" />
        </div>
      </div>

      <div className="border-y border-line bg-white">
        <dl className="container-x grid grid-cols-2 gap-y-5 py-6 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="pr-4">
              <dt className="text-sm text-muted">{fact.label}</dt>
              <dd className="mt-0.5 font-semibold text-ink">{fact.value ?? <PendingValue />}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

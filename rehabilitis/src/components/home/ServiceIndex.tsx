import Link from "next/link";
import { SERVICES } from "@/data/services";
import { PRICES_ARE_EXAMPLES, priceForService } from "@/data/pricing";
import { Photo } from "@/components/ui/Photo";

/** Indeks usług na stronie głównej: miniatura, nazwa, jedno zdanie, czas i cena, link do pełnego opisu. */
export function ServiceIndex() {
  return (
    <section aria-labelledby="uslugi-title" className="bg-white py-section">
      <div className="page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="uslugi-title" className="text-h2">
            Usługi
          </h2>
          {PRICES_ARE_EXAMPLES && <p className="text-small text-muted">Ceny przykładowe</p>}
        </div>
        <ul className="mt-8 border-t-2 border-brand-strong">
          {SERVICES.map((service) => {
            const price = priceForService(service.slug);
            return (
              <li key={service.slug} className="border-b border-line">
                <Link
                  href={`/uslugi#${service.slug}`}
                  className="group grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-1 py-5 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:gap-x-8"
                >
                  <span className="media row-span-2 block aspect-[4/3] sm:row-span-1">
                    <Photo image={service.image} sizes="(min-width: 640px) 8.5rem, 5.5rem" decorative />
                  </span>
                  <span>
                    <span className="block text-h3 font-bold tracking-[-0.015em] text-brand-strong group-hover:text-brand group-hover:underline">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-small text-muted">{service.short}</span>
                  </span>
                  {price && (
                    <span className="col-start-2 text-small tabular-nums sm:col-start-3 sm:text-right">
                      <span className="block font-bold text-ink">
                        {price.from ? "od " : ""}
                        {price.price}
                      </span>
                      {price.duration && <span className="text-muted">{price.duration}</span>}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8">
          <Link href="/uslugi" className="link">
            Pełny opis usług i dolegliwości
          </Link>
        </p>
      </div>
    </section>
  );
}

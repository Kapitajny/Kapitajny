import Link from "next/link";
import { SERVICES } from "@/data/services";
import { PRICES_ARE_EXAMPLES, priceForService } from "@/data/pricing";

/**
 * Usługi jak karta w gabinecie: nazwa, jedno zdanie, kropki prowadzące do ceny i czasu.
 * Każda pozycja prowadzi do pełnego opisu na /uslugi.
 */
export function ServiceMenu() {
  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {SERVICES.map((service) => {
          const price = priceForService(service.slug);
          return (
            <li key={service.slug}>
              <Link href={`/uslugi#${service.slug}`} className="group block py-5">
                <span className="flex items-baseline gap-3">
                  <span className="text-h3 type-condensed group-hover:text-brand group-hover:underline">
                    {service.title}
                  </span>
                  {price && (
                    <>
                      <span aria-hidden="true" className="leader hidden sm:block" />
                      <span className="ml-auto shrink-0 text-right tabular-nums sm:ml-0">
                        <span className="font-semibold text-ink">
                          {price.from ? "od " : ""}
                          {price.price}
                        </span>
                        {price.duration && <span className="block text-caption text-muted">{price.duration}</span>}
                      </span>
                    </>
                  )}
                </span>
                <span className="mt-1 block max-w-prose text-small text-muted">{service.short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {PRICES_ARE_EXAMPLES && <p className="mt-4 text-caption text-muted">Ceny przykładowe – aktualne ceny gabinet poda przed publikacją strony.</p>}
    </div>
  );
}

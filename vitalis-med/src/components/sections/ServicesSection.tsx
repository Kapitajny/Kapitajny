import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { formatPrice, priceList } from "@/data/pricing";
import { services } from "@/data/services";
import { SectionHeading } from "./SectionHeading";

/** Cena „od” dla usługi z cennika usług prywatnych (lub wycena indywidualna). */
function priceFor(slug: string) {
  const item = priceList.find((p) => p.serviceSlug === slug && p.priceFrom !== null);
  return item ? formatPrice(item) : null;
}

/** Usługi jak produkty w serwisie placówki: opis, cena orientacyjna i akcja. */
export function ServicesGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => {
        const price = priceFor(s.slug);
        return (
          <li key={s.slug} className="card flex flex-col p-6 transition-colors hover:border-line-strong">
            <Icon name={s.icon} size={28} strokeWidth={1.5} className="text-ink" />
            <h3 className="mt-5 text-[1.15rem] leading-snug">
              <Link href={`/uslugi#${s.slug}`} className="hover:text-red-dark">
                {s.title}
              </Link>
            </h3>
            <p className="mt-2 flex-1 text-[0.96rem] font-light leading-relaxed">{s.summary}</p>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-t border-line pt-4">
              <p className="whitespace-nowrap text-sm leading-tight text-muted">
                Cena
                <span className="mt-1 block text-[1.02rem] font-semibold text-ink">{price ?? "wycena indywidualna"}</span>
              </p>
              <Link href={orderHref(s.slug)} className="link-arrow shrink-0 text-[0.95rem]" aria-label={`Zapytaj o usługę: ${s.title}`}>
                Zapytaj o&nbsp;usługę
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ServicesSection() {
  return (
    <section aria-labelledby="uslugi-title" className="section">
      <div className="container-x">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            title="Nasze usługi"
            id="uslugi-title"
            lead="Transport sanitarny i medyczny, przewozy międzyszpitalne, zabezpieczenie wydarzeń i stała obsługa placówek."
            className="max-w-2xl"
          />
          <Link href="/uslugi" className="btn btn-outline btn-sm self-start lg:self-auto">
            Wszystkie usługi
          </Link>
        </Reveal>
        <div className="mt-10">
          <ServicesGrid />
        </div>
        <p className="mt-5 text-sm text-muted">
          Ceny dotyczą usług prywatnych i są przykładowe. Świadczenia w&nbsp;ramach NFZ nie są płatne według cennika.
        </p>
      </div>
    </section>
  );
}

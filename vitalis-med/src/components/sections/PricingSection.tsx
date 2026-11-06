import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { formatPrice, priceList } from "@/data/pricing";
import { SectionHeading } from "./SectionHeading";

export function PriceTable({ caption = true }: { caption?: boolean }) {
  return (
    <table className="w-full border-collapse text-left">
      {caption && <caption className="sr-only">Cennik usług komercyjnych – ceny przykładowe</caption>}
      <thead>
        <tr className="border-b-2 border-ink text-xs uppercase tracking-[0.14em] text-muted">
          <th scope="col" className="pb-3 font-semibold">
            Usługa
          </th>
          <th scope="col" className="hidden pb-3 font-semibold md:table-cell">
            Zakres
          </th>
          <th scope="col" className="pb-3 text-right font-semibold">
            Cena przykładowa
          </th>
        </tr>
      </thead>
      <tbody>
        {priceList.map((item) => (
          <tr key={item.service} className="group border-b border-line transition-colors hover:bg-mist">
            <th scope="row" className="py-5 pr-4 align-top font-normal">
              <Link href={orderHref(item.serviceSlug)} className="font-display text-[1.15rem] font-semibold text-ink group-hover:text-red-dark" style={{ fontStretch: "92%" }}>
                {item.service}
              </Link>
              <span className="mt-1 block text-sm text-muted md:hidden">{item.scope}</span>
            </th>
            <td className="hidden py-5 pr-4 align-top text-[0.98rem] md:table-cell">{item.scope}</td>
            <td className="whitespace-nowrap py-5 text-right align-top">
              <span className={item.priceFrom === null ? "text-[0.98rem] text-muted" : "font-display text-xl font-semibold text-ink"} style={{ fontStretch: "90%" }}>
                {formatPrice(item)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function PricingNotes() {
  return (
    <ul className="space-y-3 text-[0.95rem] leading-relaxed">
      <li className="flex gap-3">
        <Icon name="info" size={18} className="mt-0.5 shrink-0 text-ink" />
        <span>
          <strong className="font-semibold text-ink">Wszystkie ceny są przykładowe</strong> i wymagają weryfikacji przed publikacją.
        </span>
      </li>
      <li className="flex gap-3">
        <Icon name="info" size={18} className="mt-0.5 shrink-0 text-ink" />
        Ostateczna cena zależy od odległości, rodzaju ambulansu, składu zespołu i potrzeb pacjenta. Przed realizacją podajemy wycenę.
      </li>
      <li className="flex gap-3">
        <Icon name="info" size={18} className="mt-0.5 shrink-0 text-ink" />
        <span>
          Cennik dotyczy wyłącznie usług komercyjnych. Świadczenia finansowane przez NFZ nie są objęte cennikiem –{" "}
          <Link href="/nfz" className="link-quiet text-ink">
            zasady NFZ
          </Link>
          .
        </span>
      </li>
    </ul>
  );
}

export function PricingSection() {
  return (
    <section aria-labelledby="cennik-title" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading eyebrow="Cennik" title="Przejrzyste zasady rozliczeń" id="cennik-title" />
          <p className="mt-6 text-[1.05rem] leading-relaxed">Ceny orientacyjne usług komercyjnych. Dokładną wycenę przygotujemy po rozmowie z dyspozytorem.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href={orderHref()} className="btn btn-primary">
              Zapytaj o wycenę
            </Link>
            <Link href="/cennik" className="btn btn-outline">
              Pełny cennik
            </Link>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={100}>
          <PriceTable />
          <div className="mt-8">
            <PricingNotes />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

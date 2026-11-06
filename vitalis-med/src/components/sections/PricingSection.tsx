import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { formatPrice, priceList } from "@/data/pricing";
import { SectionHeading } from "./SectionHeading";

export function PriceTable({ caption = true }: { caption?: boolean }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full border-collapse text-left">
        {caption && <caption className="sr-only">Cennik usług komercyjnych – ceny przykładowe</caption>}
        <thead>
          <tr className="bg-mist text-sm text-ink">
            <th scope="col" className="px-3 py-3.5 sm:px-5 font-bold">
              Usługa
            </th>
            <th scope="col" className="hidden py-3.5 pr-3 sm:pr-5 font-bold md:table-cell">
              Zakres
            </th>
            <th scope="col" className="px-3 py-3.5 sm:px-5 text-right font-bold">
              Cena przykładowa
            </th>
          </tr>
        </thead>
        <tbody>
          {priceList.map((item) => (
            <tr key={item.service} className="group border-t border-line transition-colors hover:bg-mist/60">
              <th scope="row" className="px-3 py-4 align-top font-normal sm:px-5">
                <Link href={orderHref(item.serviceSlug)} className="target-expand text-[1.05rem] font-bold text-ink group-hover:text-red-dark">
                  {item.service}
                </Link>
                <span className="mt-1 block text-sm text-muted md:hidden">{item.scope}</span>
              </th>
              <td className="hidden py-4 pr-5 align-top text-[0.97rem] md:table-cell">{item.scope}</td>
              <td className="px-3 py-4 text-right align-top sm:px-5">
                <span className={item.priceFrom === null ? "text-[0.95rem] text-muted" : "whitespace-nowrap text-lg font-black text-ink"}>{formatPrice(item)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PricingNotes() {
  return (
    <ul className="space-y-3 text-[0.95rem] leading-relaxed">
      <li className="flex gap-3">
        <Icon name="info" size={18} className="mt-0.5 shrink-0 text-ink" />
        <span>
          <strong className="font-bold text-ink">Wszystkie ceny są przykładowe</strong> i wymagają weryfikacji przed publikacją.
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
        <Reveal className="self-start lg:sticky lg:top-28 lg:col-span-4">
          <SectionHeading title="Cennik usług prywatnych" id="cennik-title" />
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
        <Reveal className="min-w-0 lg:col-span-8">
          <PriceTable />
          <div className="mt-8">
            <PricingNotes />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq } from "@/components/ui/Faq";
import { IconCheck } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { PageIntro } from "@/components/ui/PageIntro";
import { generalFaq } from "@/data/faq";
import { formatPLN } from "@/lib/format";
import { BUSINESS_TYPES, pricingConfig as cfg } from "@/lib/pricing/config";
import { packages } from "@/lib/pricing/packages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cennik obsługi księgowej – pakiety od 700 zł",
  description:
    "Przykładowe pakiety abonamentowe InterPodatki: Start, Biznes, Pro, Premium i Enterprise – od 700 zł do 10 000 zł miesięcznie i więcej. Ceny demonstracyjne i orientacyjne.",
  path: "/cennik",
});

export default function PricingPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/cennik", label: "Cennik" }]}
        title="Cennik pakietów"
        lede="Pięć poziomów obsługi z ceną wyjściową. Dokładną kwotę dla swojej firmy sprawdzisz w kalkulatorze – uwzględnia liczbę dokumentów, pracowników i zakres usług."
      >
        <Link href="/kalkulator" className="btn btn-primary">
          Oblicz abonament
        </Link>
      </PageIntro>

      <section aria-labelledby="pakiety" className="py-14 sm:py-20">
        <div className="shell">
          <h2 id="pakiety" className="sr-only">
            Pakiety
          </h2>
          <Notice tone="demo" title="Ceny orientacyjne i demonstracyjne" className="mb-10">
            Kwoty są założeniami projektowymi, a nie zweryfikowanym cennikiem rynkowym. Ostateczna oferta zależy od
            liczby dokumentów, rodzaju działalności, liczby pracowników, formy opodatkowania i rzeczywistego zakresu
            usług. Wszystkie ceny netto.
          </Notice>

          <ol className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line md:grid-cols-2 xl:grid-cols-5">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className={`flex flex-col bg-white p-6 ${pkg.id === "premium" ? "shadow-[inset_0_3px_0_var(--color-gold)]" : ""}`}
              >
                <h3 className="text-[1.75rem]">{pkg.name}</h3>
                <p className="mt-1 min-h-[4.5rem] text-sm text-muted">{pkg.audience}</p>
                <p className="num mt-4 text-navy">
                  {pkg.priceFrom === null ? (
                    <span className="font-serif text-2xl leading-tight">Wycena indywidualna</span>
                  ) : (
                    <>
                      <span className="text-sm text-muted">od </span>
                      <span className="font-serif text-[2.25rem] leading-none">{formatPLN(pkg.priceFrom)}</span>
                      <span className="block text-sm text-muted">netto miesięcznie</span>
                    </>
                  )}
                </p>
                <p className="num mt-2 text-sm text-ink">
                  Opłata jednorazowa:{" "}
                  {pkg.onboardingFee === null ? "indywidualnie" : formatPLN(pkg.onboardingFee)}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5 text-[0.9375rem]">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2 text-ink">
                      <IconCheck size={18} className="mt-0.5 shrink-0 text-teal-ink" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {pkg.orderable ? (
                    <Link href={`/zamowienie?pakiet=${pkg.id}`} className="btn btn-dark w-full" aria-label={`Wybierz pakiet ${pkg.name}`}>
                      Wybierz pakiet
                    </Link>
                  ) : (
                    <Link href="/wycena" className="btn btn-primary w-full">
                      Poproś o wycenę
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="jak-liczymy" className="border-t border-line bg-mist py-14 sm:py-20">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 id="jak-liczymy">Jak liczymy abonament</h2>
            <p className="lede mt-4">
              Te same stawki wykorzystuje kalkulator. Dzięki temu widzisz, z czego wynika cena, zanim zaczniemy
              rozmowę.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="panel overflow-x-auto">
              <table className="num w-full min-w-[26rem] text-left text-[0.9375rem]">
                <caption className="border-b border-line px-5 py-4 text-left font-semibold text-navy">
                  Cena bazowa księgowości
                </caption>
                <thead className="text-sm text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Rodzaj działalności</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Dokumenty w cenie</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Netto / mies.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {BUSINESS_TYPES.map((t) => (
                    <tr key={t}>
                      <th scope="row" className="px-5 py-3 font-normal text-ink">{cfg.businessTypes[t].label}</th>
                      <td className="px-5 py-3 text-right">{cfg.businessTypes[t].includedDocuments}</td>
                      <td className="px-5 py-3 text-right font-semibold text-navy">{formatPLN(cfg.businessTypes[t].accountingBase)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel overflow-x-auto">
              <table className="num w-full min-w-[26rem] text-left text-[0.9375rem]">
                <caption className="border-b border-line px-5 py-4 text-left font-semibold text-navy">
                  Dokumenty ponad limit (stawka malejąca)
                </caption>
                <thead className="text-sm text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Kolejne dokumenty ponad limit</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Za dokument</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {cfg.documentTiers.map((tier, index) => {
                    const from = (index === 0 ? 0 : cfg.documentTiers[index - 1].upTo) + 1;
                    return (
                      <tr key={tier.upTo}>
                        <th scope="row" className="px-5 py-3 font-normal text-ink">
                          {Number.isFinite(tier.upTo) ? `${from}–${tier.upTo}` : `od ${from}`}
                        </th>
                        <td className="px-5 py-3 text-right font-semibold text-navy">{formatPLN(tier.perDocument)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="panel overflow-x-auto lg:col-span-2">
              <table className="num w-full min-w-[34rem] text-left text-[0.9375rem]">
                <caption className="border-b border-line px-5 py-4 text-left font-semibold text-navy">
                  Usługi dodatkowe i korekty
                </caption>
                <thead className="text-sm text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Pozycja</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Netto / mies.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {[
                    [cfg.services.vat.label, `${formatPLN(cfg.services.vat.monthly.jdg)} – ${formatPLN(cfg.services.vat.monthly.ecommerce)}`],
                    [cfg.services.kadry.label, `${formatPLN(cfg.services.kadry.base)} + ${formatPLN(cfg.services.kadry.perEmployee)} za pracownika + ${formatPLN(cfg.services.kadry.perHrDocument)} za dokument kadrowy`],
                    [cfg.services.raportowanie.label, formatPLN(cfg.services.raportowanie.monthly)],
                    [cfg.services.konsultacje.label, formatPLN(cfg.services.konsultacje.monthly)],
                    [cfg.services.ecommerce.label, formatPLN(cfg.services.ecommerce.monthly)],
                    [`${cfg.services.doradztwo.label} (uprawniony doradca)`, `od ${formatPLN(cfg.services.doradztwo.monthly)}`],
                    [cfg.extras.frequentReporting.label, formatPLN(cfg.extras.frequentReporting.monthly)],
                    [cfg.extras.consultationHour.label, `${formatPLN(cfg.extras.consultationHour.perHour)} / h`],
                    [cfg.extras.urgent.label, `+${Math.round(cfg.extras.urgent.rate * 100)}%`],
                    ["Skala działalności", "od 0% do +45%"],
                    ["Złożoność rozliczeń", "od 0% do +35%"],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <th scope="row" className="px-5 py-3 font-normal text-ink">{label}</th>
                      <td className="px-5 py-3 text-right font-semibold text-navy">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            Minimalny abonament wynosi {formatPLN(cfg.minimumMonthly)} netto miesięcznie. Przy szacunku od{" "}
            {formatPLN(cfg.individualQuoteThreshold)} przygotowujemy wyłącznie indywidualną wycenę.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq" className="py-14 sm:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <h2 id="faq">Pytania o cennik</h2>
          <Faq items={generalFaq.slice(0, 4)} />
        </div>
      </section>

      <CtaBand title="Nie wiesz, który pakiet wybrać?" text="Policz abonament na podstawie danych swojej firmy albo opisz potrzeby w formularzu – przygotujemy indywidualną wycenę." />
    </>
  );
}

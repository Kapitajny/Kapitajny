import Link from "next/link";
import { Ledger } from "@/components/calculator/Ledger";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq } from "@/components/ui/Faq";
import { IconArrowRight, IconCheck, IconClose } from "@/components/ui/Icons";
import { PageIntro } from "@/components/ui/PageIntro";
import { ARTICLE_CATEGORIES, getArticle } from "@/data/articles";
import type { ServicePageData } from "@/data/services";
import { calculate } from "@/lib/pricing/calculator";
import { calculatorToParams } from "@/lib/pricing/params";

export function ServicePage({ data }: { data: ServicePageData }) {
  const example = calculate(data.example);
  const query = calculatorToParams(data.example).toString();
  const related = data.articles.map(getArticle).filter((a) => a !== undefined);

  return (
    <>
      <PageIntro
        crumbs={[{ href: data.path, label: data.navLabel }]}
        title={data.title}
        lede={data.lede}
        aside={
          <div className="panel p-5 shadow-[var(--shadow-panel)]">
            <p className="text-sm font-semibold text-navy">Przykładowy szacunek</p>
            <p className="mb-3 text-sm text-muted">{data.exampleLabel}</p>
            <Ledger
              lines={example.lines}
              adjustments={example.adjustments}
              totalLabel="Razem"
              total={example.monthly}
              caption={`Przykładowy szacunek: ${data.exampleLabel}`}
            />
            <Link href={`/kalkulator?${query}`} className="btn btn-sm btn-outline mt-4 w-full">
              Dostosuj w kalkulatorze
            </Link>
          </div>
        }
      >
        <Link href={`/kalkulator?${query}`} className="btn btn-primary">
          Oblicz abonament
        </Link>
        <Link href="/wycena" className="btn btn-outline">
          Poproś o wycenę
        </Link>
      </PageIntro>

      <section aria-labelledby="dla-kogo" className="py-16 sm:py-20">
        <div className="shell">
          <h2 id="dla-kogo">Dla kogo</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line md:grid-cols-3">
            {data.audience.map((a) => (
              <li key={a.title} className="bg-white p-6">
                <h3 className="font-sans text-lg font-semibold">{a.title}</h3>
                <p className="mt-2 text-ink">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="zakres" className="border-t border-line bg-mist py-16 sm:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="zakres">Zakres usługi</h2>
            <p className="lede mt-3">Dokładny zakres zapisujemy w umowie. Poniżej typowe elementy obsługi.</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {data.scope.map((group) => (
                <div key={group.title}>
                  <h3 className="font-sans text-base font-semibold">{group.title}</h3>
                  <ul className="mt-3 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-ink">
                        <IconCheck size={18} className="mt-1 shrink-0 text-teal-ink" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="panel p-6">
              <h3 className="font-sans text-base font-semibold">Poza standardowym zakresem</h3>
              <ul className="mt-3 space-y-2.5 text-[0.9375rem]">
                {data.outOfScope.map((item) => (
                  <li key={item} className="flex gap-2.5 text-ink">
                    <IconClose size={18} className="mt-0.5 shrink-0 text-muted" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <h3 className="font-sans text-base font-semibold">Co przygotować na start</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-ink marker:text-muted">
                {data.prepare.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pytania" className="py-16 sm:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 id="pytania">Pytania o tę usługę</h2>
            {related.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-navy">Powiązane artykuły</p>
                <ul className="mt-3 space-y-3">
                  {related.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/baza-wiedzy/${article.slug}`} className="group block">
                        <span className="text-xs text-muted">{ARTICLE_CATEGORIES[article.category]}</span>
                        <span className="flex items-start gap-1.5 font-medium text-navy group-hover:text-blue-ink">
                          {article.title}
                          <IconArrowRight size={16} className="mt-1 shrink-0" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Faq items={data.faq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

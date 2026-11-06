import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { NfzComparison } from "@/components/sections/NfzSection";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { NFZ_INFORMATOR_URL, nfzContract, nfzFaq, nfzRules } from "@/data/nfz";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Świadczenia w ramach NFZ",
  description:
    "Świadczenia zdrowotne finansowane przez NFZ w zakresie zawartego kontraktu: zasady korzystania, zlecenie lekarza i różnice między usługami NFZ a komercyjnymi.",
  path: "/nfz",
});

const steps = [
  { title: "Zlecenie lekarza", text: "Lekarz ubezpieczenia zdrowotnego ocenia potrzebę transportu i wystawia zlecenie." },
  {
    title: "Kontakt z dyspozytornią",
    text: `Zadzwoń pod ${siteConfig.contact.phoneDisplay}. Sprawdzimy, czy przejazd mieści się w zakresie naszej umowy z NFZ.`,
  },
  { title: "Ustalenie terminu", text: "Termin uzgadniamy zgodnie z zasadami umowy i dostępnością zespołów." },
  { title: "Realizacja", text: "W dniu przejazdu przygotuj zlecenie i dokument tożsamości pacjenta." },
];

export default function NfzPage() {
  return (
    <>
      <PageHero
        crumb="NFZ"
        title="Świadczenia medyczne w ramach NFZ"
        lead="Realizujemy również świadczenia zdrowotne finansowane ze środków Narodowego Funduszu Zdrowia w zakresie objętym zawartym kontraktem. Naszym priorytetem jest zapewnienie pacjentom profesjonalnej obsługi, bezpieczeństwa oraz wysokiej jakości świadczeń."
      />

      <section aria-labelledby="zakres-title" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading title="Zakres umowy z NFZ" id="zakres-title" />
            <p className="mt-6 text-[1.05rem] leading-relaxed">
              Świadczenia finansowane ze środków publicznych wykonujemy wyłącznie w zakresie, na obszarze i w okresie wynikającym z umowy z NFZ.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <ul className="divide-y divide-line border-y-2 border-ink">
              {nfzContract.scopes.map((s) => (
                <li key={s.title} className="py-6">
                  <h3 className="text-[1.3rem]">{s.title}</h3>
                  <p className="mt-2 text-[1rem] leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 grid gap-4 text-[0.98rem] sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Oddział Wojewódzki NFZ</dt>
                <dd className="font-bold text-ink">{nfzContract.branch ?? "[do uzupełnienia]"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Okres obowiązywania umowy</dt>
                <dd className="font-bold text-ink">{nfzContract.period ?? "[do uzupełnienia]"}</dd>
              </div>
            </dl>
            <p className="mt-6 flex gap-3 rounded-[4px] border border-line-strong bg-mist p-4 text-[0.95rem]">
              <Icon name="info" size={20} className="mt-0.5 shrink-0 text-ink" />
              <span>
                Zakres przedstawiony powyżej jest przykładowy i wymaga uzupełnienia zgodnie z faktycznie zawartą umową. Umowy z NFZ można sprawdzić w serwisie{" "}
                <a href={NFZ_INFORMATOR_URL} target="_blank" rel="noopener noreferrer" className="link-quiet font-bold text-ink">
                  Informator o zawartych umowach NFZ
                  <span className="sr-only"> (otwiera się w nowej karcie)</span>
                </a>
                .
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="zasady-title" className="section border-y border-line bg-mist">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Zasady korzystania ze świadczeń" id="zasady-title" />
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {nfzRules.map((r) => (
              <li key={r.title} className="card p-6 lg:p-7">
                <h3 className="text-[1.35rem]">{r.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="porownanie-title" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              title="NFZ a usługi prywatne"
              id="porownanie-title"
              lead="Nie każdy transport medyczny jest finansowany przez NFZ. Przed realizacją zawsze informujemy, na jakiej podstawie odbywa się przejazd."
            />
          </Reveal>
          <Reveal className="lg:col-span-8">
            <NfzComparison />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="kroki-nfz-title" className="section bg-mist">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Jak skorzystać z transportu w ramach NFZ" id="kroki-nfz-title" />
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red text-lg font-black text-white" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[1.15rem]">{step.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading title="Najczęstsze pytania" id="faq-title" />
          </Reveal>
          <div className="lg:col-span-8">
            <div className="divide-y divide-line border-y border-line">
              {nfzFaq.map((f) => (
                <details key={f.q} className="group py-2 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-[1.2rem] font-bold text-ink">
                    {f.q}
                    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-red" />
                      <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-red transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="pb-5 pr-10 text-[1rem] leading-relaxed">
                    {f.a}
                    {f.q.startsWith("Gdzie") && (
                      <>
                        {" "}
                        <a href={NFZ_INFORMATOR_URL} target="_blank" rel="noopener noreferrer" className="link-quiet font-bold text-ink">
                          Przejdź do informatora NFZ
                          <span className="sr-only"> (otwiera się w nowej karcie)</span>
                        </a>
                      </>
                    )}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-[0.95rem]">
              Szczegółowe informacje o prawach pacjenta znajdziesz w dokumencie{" "}
              <Link href="/prawa-pacjenta" className="link-quiet font-bold text-ink">
                Informacja o prawach pacjenta
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Masz zlecenie na transport?" text="Zadzwoń do dyspozytorni – sprawdzimy, czy przejazd możemy zrealizować w ramach umowy z NFZ." />
    </>
  );
}

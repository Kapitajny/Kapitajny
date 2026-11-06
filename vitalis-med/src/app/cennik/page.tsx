import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { PriceTable, PricingNotes } from "@/components/sections/PricingSection";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { orderHref } from "@/config/site";
import { priceFactors } from "@/data/pricing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cennik usług prywatnych",
  description: "Przykładowe ceny transportu sanitarnego, transportu medycznego, przewozu pacjenta leżącego i zabezpieczenia imprez. Wycena indywidualna.",
  path: "/cennik",
});

const payments = [
  { title: "Przelew na podstawie faktury", text: "Dla firm i instytucji, także w rozliczeniu miesięcznym na podstawie umowy." },
  { title: "Płatność kartą lub BLIK", text: "Po potwierdzeniu zlecenia – szczegóły przekaże dyspozytor." },
  { title: "Gotówka", text: "U zespołu realizującego transport, za pokwitowaniem." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        crumb="Cennik"
        eyebrow="Cennik usług prywatnych"
        title="Przejrzyste ceny usług komercyjnych"
        lead="Poniższe ceny mają charakter orientacyjny. Przed każdym przejazdem podajemy wycenę dopasowaną do trasy i potrzeb pacjenta."
      >
        <Link href={orderHref()} className="btn btn-primary">
          Zapytaj o wycenę
          <Icon name="arrowRight" size={18} />
        </Link>
      </PageHero>

      <section aria-labelledby="tabela-title" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <h2 id="tabela-title" className="sr-only">
              Tabela cen
            </h2>
            <Reveal>
              <PriceTable />
            </Reveal>
            <div className="mt-8">
              <PricingNotes />
            </div>
          </div>
          <Reveal as="aside" className="self-start border border-line bg-mist p-7 lg:sticky lg:top-28 lg:col-span-4" delay={80}>
            <h2 className="text-[1.4rem]">Świadczenia NFZ nie są objęte cennikiem</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed">
              Transport finansowany przez NFZ realizujemy na podstawie zlecenia lekarza i w zakresie zawartej umowy. Jeśli przejazd nie spełnia tych
              warunków, poinformujemy Cię o tym przed realizacją.
            </p>
            <Link href="/nfz" className="link-arrow mt-6">
              Zasady świadczeń NFZ
              <Icon name="arrowRight" size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="czynniki-title" className="section border-t border-line bg-mist">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Wycena"
              title="Od czego zależy ostateczna cena"
              id="czynniki-title"
              lead="Każdy transport jest inny. Na wycenę wpływają przede wszystkim cztery czynniki."
            />
          </Reveal>
          <ol className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {priceFactors.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 70} className="bg-white p-7">
                <span className="font-display text-sm font-semibold tracking-[0.12em] text-red" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.3rem]">{f.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed">{f.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="platnosci-title" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="Płatności" title="Formy płatności" id="platnosci-title" />
            <p className="mt-6 text-[1rem] text-muted">Dostępne formy płatności są przykładowe – do potwierdzenia przed publikacją strony.</p>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={80}>
            <ul className="divide-y divide-line border-y border-line">
              {payments.map((p) => (
                <li key={p.title} className="flex gap-4 py-6">
                  <Icon name="card" size={24} className="mt-0.5 shrink-0 text-red" />
                  <div>
                    <h3 className="text-[1.2rem]">{p.title}</h3>
                    <p className="mt-1 text-[0.98rem]">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.95rem]">
              Zasady płatności i odwoływania usług opisuje{" "}
              <Link href="/regulamin" className="link-quiet font-semibold text-ink">
                Regulamin świadczenia usług
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Potrzebujesz dokładnej wyceny?" />
    </>
  );
}

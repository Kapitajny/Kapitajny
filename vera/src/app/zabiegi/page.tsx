import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";
import { getCategory, treatmentsIn } from "@/data/treatments";

export const metadata: Metadata = {
  title: "Zabiegi",
  description: "Medycyna estetyczna, zabiegi na skórę, kosmetologia profesjonalna i konsultacje skóry w VÉRA Aesthetic Studio.",
  alternates: { canonical: "/zabiegi" },
  openGraph: { title: "Zabiegi | VÉRA Aesthetic Studio", url: "/zabiegi" },
};

function TreatmentLink({ slug, children, className = "" }: { slug: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={`/zabiegi/${slug}`} className={`group block ${className}`}>
      {children}
    </Link>
  );
}

export default function TreatmentsPage() {
  const medicine = getCategory("medycyna-estetyczna");
  const skin = getCategory("zabiegi-na-skore");
  const cosmetology = getCategory("kosmetologia");
  const consultation = getCategory("konsultacja-skory");

  return (
    <>
      <section className="shell pb-20 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Strona główna" },
            { href: "/zabiegi", label: "Zabiegi" },
          ]}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="display text-[clamp(3.5rem,11vw,10rem)] text-burgundy lg:col-span-8">Zabiegi</h1>
          <p className="lede text-black/85 lg:col-span-4">Cztery obszary opieki i jedna zasada: każdy plan zaczyna się od konsultacji. Wybierz obszar albo zacznij od samej konsultacji.</p>
        </div>
        <nav aria-label="Obszary zabiegów" className="mt-14 border-y border-line">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {[medicine, skin, cosmetology, consultation].map((c) => (
              <li key={c.slug} className="border-line sm:odd:border-r lg:border-r lg:last:border-r-0">
                <a href={`#${c.slug}`} className="flex items-center justify-between gap-4 px-1 py-5 font-serif text-2xl hover:text-burgundy sm:px-5">
                  {c.name}
                  <svg aria-hidden="true" width="10" height="14" viewBox="0 0 10 14" className="shrink-0">
                    <path d="M5 1v12M1 9l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.2" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Medycyna estetyczna – burgund, zdjęcie i długie wiersze. */}
      <section id="medycyna-estetyczna" aria-labelledby="medycyna-estetyczna-title" className="scroll-mt-0 bg-burgundy py-24 text-ivory sm:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Photo image={medicine.image} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/5]" />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="medycyna-estetyczna-title" className="display text-[clamp(2.75rem,6vw,5.5rem)]">
              {medicine.name}
            </h2>
            <p className="mt-6 max-w-xl text-ivory/80">{medicine.intro}</p>
            <ul className="mt-14 border-t border-line-light">
              {treatmentsIn(medicine.slug).map((t) => (
                <li key={t.slug} className="border-b border-line-light">
                  <TreatmentLink slug={t.slug} className="grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:gap-8">
                    <span>
                      <span className="block font-serif text-3xl leading-tight group-hover:text-rose-light">{t.name}</span>
                      <span className="mt-2 block max-w-lg text-sm text-ivory/75">{t.lede}</span>
                    </span>
                    <span className="text-sm text-rose-light sm:text-right">{t.duration}</span>
                  </TreatmentLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Zabiegi na skórę – spokojna tabela na jasnym tle. */}
      <section id="zabiegi-na-skore" aria-labelledby="zabiegi-na-skore-title" className="shell py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 id="zabiegi-na-skore-title" className="display text-[clamp(2.75rem,6vw,5.5rem)] text-burgundy">
              {skin.name}
            </h2>
            <p className="mt-6 max-w-lg text-black/80">{skin.intro}</p>
          </div>
          <div className="sm:w-2/3 lg:col-span-4 lg:col-start-9 lg:w-full">
            <Photo image={skin.image} sizes="(min-width: 1024px) 30vw, 66vw" className="aspect-[5/4]" />
          </div>
        </div>
        <table className="mt-16 w-full text-left">
          <caption className="sr-only">{skin.name}: czas trwania i zwykły przebieg</caption>
          <thead className="hidden text-xs text-stone sm:table-header-group">
            <tr className="border-b border-black">
              <th scope="col" className="pb-3 font-medium">
                Zabieg
              </th>
              <th scope="col" className="pb-3 font-medium">
                Czas trwania
              </th>
              <th scope="col" className="pb-3 font-medium">
                Zwykły przebieg
              </th>
              <th scope="col" className="pb-3">
                <span className="sr-only">Szczegóły</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {treatmentsIn(skin.slug).map((t) => (
              <tr key={t.slug} className="grid border-b border-line py-6 sm:table-row sm:py-0">
                <th scope="row" className="font-normal sm:py-8 sm:pr-8">
                  <Link href={`/zabiegi/${t.slug}`} className="font-serif text-3xl hover:text-burgundy">
                    {t.name}
                  </Link>
                </th>
                <td className="mt-2 text-sm text-stone sm:mt-0 sm:py-8 sm:pr-8">{t.duration}</td>
                <td className="text-sm text-stone sm:py-8 sm:pr-8">{t.course}</td>
                <td className="mt-3 sm:mt-0 sm:py-8 sm:text-right">
                  <Link href={`/zabiegi/${t.slug}`} className="link-line text-sm font-semibold text-burgundy">
                    Szczegóły<span className="sr-only">: {t.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Kosmetologia profesjonalna – czerń, trzy kolumny ze zdjęciami. */}
      <section id="kosmetologia" aria-labelledby="kosmetologia-title" className="bg-black py-24 text-ivory sm:py-32">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 id="kosmetologia-title" className="display text-[clamp(2.75rem,6vw,5.5rem)] lg:col-span-7">
              Kosmetologia
              <br />
              <span className="pl-[0.9em]">profesjonalna</span>
            </h2>
            <p className="max-w-md text-ivory/75 lg:col-span-4 lg:col-start-9 lg:self-end">{cosmetology.intro}</p>
          </div>
          <ul className="mt-16 grid gap-14 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {treatmentsIn(cosmetology.slug).map((t, i) => (
              <li key={t.slug} className={i === 1 ? "sm:mt-20" : ""}>
                <TreatmentLink slug={t.slug}>
                  <div className="overflow-hidden">
                    <Photo
                      image={t.image}
                      sizes="(min-width: 640px) 30vw, 100vw"
                      decorative
                      className="aspect-[4/5]"
                      imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-5 font-serif text-3xl group-hover:text-rose-light">{t.name}</h3>
                </TreatmentLink>
                <p className="mt-2 text-sm text-ivory/75">{t.lede}</p>
                <p className="mt-3 text-xs text-rose-light">{t.duration}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Konsultacja skóry – punkt wyjścia, pokazany jako jedna oferta. */}
      <section id="konsultacja-skory" aria-labelledby="konsultacja-skory-title" className="bg-powder py-24 sm:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 id="konsultacja-skory-title" className="display text-[clamp(2.75rem,6vw,5.5rem)] text-burgundy">
              {consultation.name}
            </h2>
            <p className="mt-8 font-serif text-3xl font-light leading-snug">{consultation.intro}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`${bookingHref}?zabieg=konsultacja-skory`} className="btn btn-primary">
                Umów konsultację skóry
              </Link>
              <Link href="/zabiegi/konsultacja-skory" className="btn btn-outline">
                Jak wygląda konsultacja
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Photo image={consultation.image} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[5/4]" />
            <ul className="mt-8 border-t border-black/30">
              {treatmentsIn(consultation.slug).map((t) => (
                <li key={t.slug} className="border-b border-black/30">
                  <TreatmentLink slug={t.slug} className="flex items-baseline justify-between gap-6 py-5">
                    <span className="font-serif text-2xl group-hover:text-burgundy">{t.name}</span>
                    <span className="shrink-0 text-sm text-stone">{t.duration}</span>
                  </TreatmentLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="shell py-14">
        <DemoNote>
          Opisy zabiegów na tej demonstracyjnej stronie mają charakter poglądowy. Przed publikacją musi je sprawdzić personel medyczny studia. Efekty różnią się
          u poszczególnych osób i nigdy nie są gwarantowane.
        </DemoNote>
      </div>
    </>
  );
}

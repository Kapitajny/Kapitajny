import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";
import { specialists } from "@/data/specialists";
import { getCategory } from "@/data/treatments";

export const metadata: Metadata = {
  title: "Nasi specjaliści",
  description: "Poznaj lekarza, kosmetologa i specjalistę ds. skóry w VÉRA Aesthetic Studio.",
  alternates: { canonical: "/specjalisci" },
  openGraph: { title: "Nasi specjaliści | VÉRA Aesthetic Studio", url: "/specjalisci" },
};

export default function SpecialistsPage() {
  return (
    <>
      <section className="shell pb-16 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Strona główna" },
            { href: "/specjalisci", label: "Nasi specjaliści" },
          ]}
        />
        <h1 className="display mt-10 text-[clamp(3.25rem,10vw,9rem)] text-burgundy">
          <span className="block">Nasi</span>
          <span className="block pl-[0.6em] sm:pl-[1.4em]">specjaliści</span>
        </h1>
        <p className="lede mt-10 text-black/85 lg:ml-[50%]">
          Celowo mały zespół. Na konsultacji, zabiegu i wizycie kontrolnej spotykasz tę samą osobę – a każde z nas pracuje wyłącznie w swojej
          dziedzinie.
        </p>
      </section>

      <ul>
        {specialists.map((s, i) => {
          const flipped = i % 2 === 1;
          return (
            <li key={s.slug} id={s.slug} className={`scroll-mt-[var(--header-h)] ${flipped ? "bg-powder" : ""}`}>
              <article className="shell grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-8">
                <div className={`lg:col-span-5 ${flipped ? "lg:order-2 lg:col-start-8" : ""}`}>
                  <Photo image={s.image} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5]" />
                </div>
                <div className={`lg:col-span-6 ${flipped ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                  <p className={`text-sm font-medium ${flipped ? "text-burgundy" : "text-rose-deep"}`}>{s.role}</p>
                  <h2 className="display mt-3 text-[clamp(3rem,6vw,5.5rem)]">{s.name}</h2>
                  <blockquote className="mt-8 border-l-2 border-burgundy pl-6 font-serif text-2xl italic leading-snug text-burgundy sm:text-3xl">
                    <p>“{s.quote}”</p>
                  </blockquote>
                  <div className="mt-8 max-w-xl space-y-4 text-black/85">
                    {s.bio.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xs font-semibold text-stone">Obszary opieki</h3>
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {s.areas.map((a) => (
                        <li key={a}>
                          <Link href={`/zabiegi#${a}`} className="link-line text-sm font-semibold text-burgundy">
                            {getCategory(a).name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div className="shell py-14">
        <DemoNote>
          Osoby na tej stronie są fikcyjne i pokazane wyłącznie demonstracyjnie. Imiona, role, biogramy i ewentualne kwalifikacje muszą pochodzić od zespołu
          studia i z jego dokumentów.
        </DemoNote>
      </div>

      <CtaBand title="Wybierz, kogo chcesz poznać" text="Wpisz w zapytaniu imię specjalisty, a umówimy konsultację właśnie z tą osobą." />
    </>
  );
}

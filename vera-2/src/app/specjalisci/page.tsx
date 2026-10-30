import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { DemoNote } from "@/components/ui/DemoNote";
import { PageHead } from "@/components/ui/PageHead";
import { Photo } from "@/components/ui/Photo";
import { specialists } from "@/data/specialists";
import { getCategory } from "@/data/treatments";

export const metadata: Metadata = {
  title: "Nasi specjaliści",
  description: "Poznaj lekarkę, kosmetolożkę i specjalistę ds. skóry w VÉRA Aesthetic Studio.",
  alternates: { canonical: "/specjalisci" },
  openGraph: { title: "Nasi specjaliści | VÉRA Aesthetic Studio", url: "/specjalisci" },
};

export default function SpecialistsPage() {
  return (
    <>
      <PageHead
        crumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/specjalisci", label: "Nasi specjaliści" },
        ]}
        title="Nasi specjaliści"
        lede="Celowo mały zespół. Na konsultacji, zabiegu i wizycie kontrolnej spotykasz tę samą osobę."
      />

      <ul className="shell grid gap-6 pb-12">
        {specialists.map((s, i) => (
          <li key={s.slug} id={s.slug} className={`scroll-mt-[var(--header-h)] rounded-[2.5rem] px-6 py-14 sm:rounded-[4rem] sm:px-12 ${i % 2 ? "bg-powder/70" : "bg-blush"}`}>
            <article className="mx-auto max-w-3xl text-center">
              <Photo image={s.image} sizes="260px" className="oval mx-auto aspect-square w-52 ring-1 ring-rose/50 ring-offset-8 ring-offset-blush sm:w-60" />
              <h2 className="script mt-8 text-[clamp(2.6rem,6vw,4rem)] leading-none">{s.name}</h2>
              <p className="mt-2 text-sm">{s.role}</p>
              <blockquote className="script mx-auto mt-8 max-w-xl text-2xl leading-snug sm:text-3xl">
                <p>„{s.quote}”</p>
              </blockquote>
              <div className="mx-auto mt-8 max-w-xl space-y-4 font-light text-black/80">
                {s.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul aria-label="Obszary opieki" className="mt-8 flex flex-wrap justify-center gap-2.5">
                {s.areas.map((a) => (
                  <li key={a}>
                    <Link href={`/zabiegi#${a}`} className="pill pill-line min-h-10 px-5 py-2 text-xs">
                      {getCategory(a).name}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>

      <div className="shell">
        <DemoNote>
          Osoby na tej stronie są fikcyjne i pokazane wyłącznie demonstracyjnie. Imiona, role, biogramy i ewentualne kwalifikacje muszą pochodzić od zespołu studia
          i z jego dokumentów.
        </DemoNote>
      </div>

      <CtaBand title="Wybierz, kogo chcesz poznać" text="Wpisz w zapytaniu imię osoby ze studia, a umówimy konsultację właśnie z nią." />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bookHref, site } from "@/config/site";
import { BookBand } from "@/components/ui/BookBand";
import { Crumbs } from "@/components/ui/Crumbs";
import { DemoNote } from "@/components/ui/DemoNote";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";
import { getCategory, getTreatment, treatments } from "@/data/treatments";

export const dynamicParams = false;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const t = getTreatment((await params).slug);
  if (!t) return {};
  return {
    title: `${t.name} – ${getCategory(t.category).name}`,
    description: `${t.lede} Consultation, indications, contraindications and qualification at VÉRA Aesthetic Studio, Kraków.`,
    alternates: { canonical: `/treatments/${t.slug}` },
    openGraph: { title: `${t.name} – VÉRA Aesthetic Studio`, description: t.lede, url: `/treatments/${t.slug}`, type: "article" },
  };
}

export default async function TreatmentPage({ params }: PageProps<"/treatments/[slug]">) {
  const t = getTreatment((await params).slug);
  if (!t) notFound();
  const category = getCategory(t.category);
  const index = treatments.indexOf(t);
  const nextT = treatments[(index + 1) % treatments.length];
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/treatments", label: "Treatments" },
    { href: `/treatments#${category.slug}`, label: category.name },
    { href: `/treatments/${t.slug}`, label: t.name },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs(crumbs.map((c) => ({ name: c.label, path: c.href })))} />

      <header className="wrap grid gap-12 pb-16 pt-[calc(var(--bar)+2.5rem)] lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="flex flex-col lg:col-span-7">
          <Crumbs items={crumbs} />
          <p className="kicker mt-14 text-rose-deep lg:mt-auto lg:pt-24">{category.name}</p>
          <h1 className="display-xl mt-5 text-[clamp(2.5rem,10vw,8.5rem)] hyphens-auto lg:text-[clamp(3rem,6.6vw,8.5rem)]">{t.name}</h1>
          <p className="mt-8 max-w-xl text-lg text-stone">{t.lede}</p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden lg:col-span-4 lg:col-start-9">
          <Shot image={t.image} sizes="(min-width: 1024px) 32vw, 100vw" preload />
        </div>
      </header>

      <div className="border-y border-black/15 bg-powder/40">
        <dl className="wrap grid grid-cols-1 divide-y divide-black/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {t.facts.map((f) => (
            <div key={f.label} className="py-6 sm:px-6 sm:first:pl-0">
              <dt className="kicker text-stone">{f.label}</dt>
              <dd className="mt-2 font-display text-2xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="wrap grid gap-16 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <article className="min-w-0 space-y-20 lg:col-span-7">
          <section aria-labelledby="overview">
            <h2 id="overview" className="display-md">
              Overview
            </h2>
            <div className="mt-8 max-w-2xl space-y-5 text-black/80">
              {t.overview.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="consultation">
            <h2 id="consultation" className="display-md">
              How it runs
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2">
              {t.consultation.map((s, i) => (
                <li key={s.title} className="border-t border-black pt-5">
                  <span aria-hidden="true" className="font-display text-5xl italic leading-none text-rose">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-stone">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="suitability" className="grid gap-px bg-black/15 md:grid-cols-2">
            <h2 id="suitability" className="sr-only">
              Indications and contraindications
            </h2>
            <div className="bg-ivory pb-8 md:pr-8">
              <h3 className="display-md text-[clamp(1.8rem,2.6vw,2.4rem)]">Indications</h3>
              <ul className="mt-6 space-y-3 text-black/80">
                {t.indications.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 bg-burgundy" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ivory pb-8 pt-8 md:pl-8 md:pt-0">
              <h3 className="display-md text-[clamp(1.8rem,2.6vw,2.4rem)]">Contraindications</h3>
              {t.contraindicationsNote && <p className="mt-6 text-black/80">{t.contraindicationsNote}</p>}
              {t.contraindications.length > 0 && (
                <ul className="mt-6 space-y-3 text-black/80">
                  {t.contraindications.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-black" />
                      {x}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 text-xs text-stone">Not a complete list – the specialist makes the final assessment after taking your history.</p>
            </div>
          </section>

          <section aria-labelledby="qualification" className="border-l-2 border-burgundy pl-6 sm:pl-10">
            <h2 id="qualification" className="display-md">
              Qualification
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-black/80">
              {t.qualification.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>
          </section>

          <DemoNote />
        </article>

        <aside aria-label="Book this treatment" className="min-w-0 lg:col-span-4 lg:col-start-9">
          <div className="sticky top-28 bg-burgundy p-8 text-ivory lg:p-10">
            <p className="kicker text-rose-light">Book</p>
            <p className="mt-4 font-display text-[clamp(1.6rem,2.2vw,2.1rem)] leading-tight hyphens-auto [overflow-wrap:anywhere]">Interested in {t.name}?</p>
            <p className="mt-3 text-sm text-ivory/75">Send a request – we&apos;ll call you to choose a time. Every treatment starts with a consultation.</p>
            <Link href={`${bookHref}?treatment=${t.slug}`} className="cta cta-ivory mt-8 w-full">
              Book a consultation
            </Link>
            <a href={site.contact.phoneHref} className="underline-draw mt-6 inline-block text-sm">
              Or call {site.contact.phone}
            </a>
          </div>
        </aside>
      </div>

      <Link href={`/treatments/${nextT.slug}`} className="group block border-t border-black/15">
        <span className="wrap flex flex-wrap items-baseline justify-between gap-6 py-14">
          <span className="kicker text-stone">Next treatment</span>
          <span className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none transition-transform duration-500 group-hover:-translate-x-3 group-hover:italic">{nextT.name}</span>
        </span>
      </Link>

      <BookBand treatment={t.slug} />
    </>
  );
}

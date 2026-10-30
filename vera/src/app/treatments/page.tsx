import type { Metadata } from "next";
import Link from "next/link";
import { bookHref } from "@/config/site";
import { BookBand } from "@/components/ui/BookBand";
import { Crumbs } from "@/components/ui/Crumbs";
import { DemoNote } from "@/components/ui/DemoNote";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";
import { categories, getCategory, treatmentsIn, type Treatment } from "@/data/treatments";

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Aesthetic medicine, skin treatments, professional cosmetology and skin consultations at VÉRA Aesthetic Studio in Kraków. Every treatment begins with a consultation.",
  alternates: { canonical: "/treatments" },
  openGraph: { title: "Treatments – VÉRA Aesthetic Studio", url: "/treatments" },
};

const fact = (t: Treatment, label: string) => t.facts.find((f) => f.label === label)?.value ?? "–";

function CategoryHead({ slug, light = false, powder = false }: { slug: Parameters<typeof getCategory>[0]; light?: boolean; powder?: boolean }) {
  // On powder, stone and rose-deep fall below 4.5:1 – burgundy and near-black are used there instead.
  const accent = light ? "text-rose-light" : powder ? "text-burgundy" : "text-rose-deep";
  const c = getCategory(slug);
  const n = categories.findIndex((x) => x.slug === slug) + 1;
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <h2 id={`${slug}-title`} className="display-lg lg:col-span-7">
        <span className={`kicker mb-5 block ${accent}`}>{String(n).padStart(2, "0")} / 04</span>
        {c.name}
      </h2>
      <div className="lg:col-span-4 lg:col-start-9">
        <p className={light ? "text-ivory/80" : powder ? "text-black/80" : "text-stone"}>{c.intro}</p>
        <p className={`kicker mt-4 ${accent}`}>With: {c.performedBy}</p>
      </div>
    </div>
  );
}

export default function TreatmentsPage() {
  const medicine = treatmentsIn("aesthetic-medicine");
  const skin = treatmentsIn("skin-treatments");
  const cosmetology = treatmentsIn("professional-cosmetology");
  const consultation = treatmentsIn("skin-consultation");

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Treatments", path: "/treatments" }])} />
      <header className="wrap pb-16 pt-[calc(var(--bar)+2.5rem)] lg:pb-24">
        <Crumbs items={[{ href: "/", label: "Home" }, { href: "/treatments", label: "Treatments" }]} />
        <h1 className="display-xl mt-12">Treatments</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <p className="max-w-xl text-lg text-stone lg:col-span-6">
            Four disciplines, one rule: we decide on a treatment together, after a consultation. Use this page to prepare – not to self-prescribe.
          </p>
          <nav aria-label="Treatment categories" className="lg:col-span-5 lg:col-start-8">
            <ul className="divide-y divide-black/15 border-y border-black/15">
              {categories.map((c, i) => (
                <li key={c.slug}>
                  <a href={`#${c.slug}`} className="group flex items-baseline justify-between gap-4 py-3">
                    <span className="font-display text-xl group-hover:italic">{c.name}</span>
                    <span className="kicker text-stone">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* 01 – Aesthetic Medicine: burgundy, image + large list */}
      <section id="aesthetic-medicine" aria-labelledby="aesthetic-medicine-title" className="scroll-mt-20 bg-burgundy text-ivory">
        <div className="wrap py-24 lg:py-32">
          <CategoryHead slug="aesthetic-medicine" light />
          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="relative aspect-[4/5] overflow-hidden lg:col-span-4">
              <Shot image="catAesthetic" sizes="(min-width: 1024px) 32vw, 100vw" />
            </div>
            <ul className="border-t border-ivory/30 lg:col-span-7 lg:col-start-6">
              {medicine.map((t) => (
                <li key={t.slug} className="border-b border-ivory/15">
                  <Link href={`/treatments/${t.slug}`} className="group grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                    <span>
                      <span className="block font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight transition-transform duration-500 group-hover:translate-x-2 group-hover:italic">
                        {t.name}
                      </span>
                      <span className="mt-2 block text-sm text-ivory/75">{t.summary}</span>
                    </span>
                    <span className="kicker text-rose-light">View treatment</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 02 – Skin Treatments: a comparison table */}
      <section id="skin-treatments" aria-labelledby="skin-treatments-title" className="scroll-mt-20">
        <div className="wrap py-24 lg:py-32">
          <CategoryHead slug="skin-treatments" />
          <div className="mt-16 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">Skin treatments compared</caption>
              <thead>
                <tr className="border-b border-black text-xs">
                  <th scope="col" className="kicker py-4 pr-6 font-medium">
                    Treatment
                  </th>
                  <th scope="col" className="kicker py-4 pr-6 font-medium">
                    Good for
                  </th>
                  <th scope="col" className="kicker py-4 pr-6 font-medium">
                    Course
                  </th>
                  <th scope="col" className="kicker py-4 font-medium">
                    Downtime / season
                  </th>
                </tr>
              </thead>
              <tbody>
                {skin.map((t) => (
                  <tr key={t.slug} className="group border-b border-black/15 align-top">
                    <th scope="row" className="py-7 pr-6 font-normal">
                      <Link href={`/treatments/${t.slug}`} className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight group-hover:italic">
                        {t.name}
                      </Link>
                    </th>
                    <td className="py-7 pr-6 text-sm text-stone">{t.indications[0]}</td>
                    <td className="py-7 pr-6 text-sm">{fact(t, "Course") !== "–" ? fact(t, "Course") : fact(t, "Duration")}</td>
                    <td className="py-7 text-sm">{fact(t, "Downtime") !== "–" ? fact(t, "Downtime") : fact(t, "Season")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 03 – Professional Cosmetology: two large features */}
      <section id="professional-cosmetology" aria-labelledby="professional-cosmetology-title" className="scroll-mt-20 bg-powder">
        <div className="wrap py-24 lg:py-32">
          <CategoryHead slug="professional-cosmetology" powder />
          <ul className="mt-16 grid gap-14 md:grid-cols-2 md:gap-8">
            {cosmetology.map((t, i) => (
              <li key={t.slug} className={i === 1 ? "md:mt-32" : ""}>
                <Link href={`/treatments/${t.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Shot image={t.image} sizes="(min-width: 768px) 46vw, 100vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-6">
                    <h3 className="font-display text-[clamp(2rem,3.2vw,3rem)] leading-none group-hover:italic">{t.name}</h3>
                    <span className="kicker shrink-0">{fact(t, "Duration")}</span>
                  </div>
                  <p className="mt-3 max-w-md text-black/75">{t.lede}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 – Skin Consultation: black, "start here" */}
      <section id="skin-consultation" aria-labelledby="skin-consultation-title" className="scroll-mt-20 bg-black text-ivory">
        <div className="wrap py-24 lg:py-32">
          <CategoryHead slug="skin-consultation" light />
          <div className="mt-16 grid gap-px bg-ivory/15 md:grid-cols-2">
            {consultation.map((t) => (
              <Link key={t.slug} href={`/treatments/${t.slug}`} className="group flex min-h-72 flex-col justify-between gap-10 bg-black p-8 transition-colors hover:bg-burgundy lg:p-12">
                <span className="kicker text-rose">{fact(t, "Duration")}</span>
                <span>
                  <span className="block font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none group-hover:italic">{t.name}</span>
                  <span className="mt-4 block max-w-sm text-ivory/75">{t.summary}</span>
                </span>
              </Link>
            ))}
          </div>
          <Link href={`${bookHref}?treatment=skin-analysis`} className="cta cta-ivory mt-12">
            Start with a skin analysis
          </Link>
        </div>
      </section>

      <div className="wrap py-12">
        <DemoNote />
      </div>
      <BookBand title="Not sure where to start?" />
    </>
  );
}

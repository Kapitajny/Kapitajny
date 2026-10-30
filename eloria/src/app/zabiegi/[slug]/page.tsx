import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bookingHref, siteConfig } from "@/config/site";
import { BookingCta } from "@/components/ui/BookingCta";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCategory, getService, services, servicesIn } from "@/data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/zabiegi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const category = getCategory(service.category);
  return {
    title: `${service.name} – ${category.name}`,
    description: `${service.lede} Przebieg, wskazania, przeciwwskazania i kwalifikacja – ÉLORIA Aesthetic Clinic, Warszawa.`,
    alternates: { canonical: `/zabiegi/${service.slug}` },
    openGraph: { title: `${service.name} | ÉLORIA Aesthetic Clinic`, description: service.lede, url: `/zabiegi/${service.slug}`, type: "article" },
  };
}

const sections = [
  { id: "opis", label: "Opis" },
  { id: "przebieg", label: "Przebieg" },
  { id: "wskazania", label: "Wskazania i przeciwwskazania" },
  { id: "kwalifikacja", label: "Kwalifikacja" },
];

export default async function ServicePage({ params }: PageProps<"/zabiegi/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const category = getCategory(service.category);
  const related = servicesIn(service.category).filter((s) => s.slug !== service.slug);
  const crumbs = [
    { href: "/", label: "Strona główna" },
    { href: "/zabiegi", label: "Zabiegi" },
    { href: `/zabiegi#${category.slug}`, label: category.name },
    { href: `/zabiegi/${service.slug}`, label: service.name },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />

      <header className="frame grid gap-y-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-x-8 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <nav aria-label="Okruszki" className="mb-10 text-xs text-taupe lg:mb-16">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {crumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="h-px w-3 bg-champagne" />}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="link-quiet">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="text-sm text-champagne-deep">{category.name}</p>
          <h1 className="mt-4 text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.98] tracking-[-0.02em]">{service.name}</h1>
          <p className="lead mt-8 max-w-xl">{service.lede}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={`${bookingHref}?zabieg=${service.slug}`} className="btn btn-primary">
              Umów konsultację
            </Link>
            <a href={siteConfig.contact.phoneHref} className="link-quiet text-sm font-medium">
              Zadzwoń: {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="relative aspect-[4/5] overflow-hidden bg-blush">
            <Photo image={service.image} sizes="(min-width: 1024px) 32vw, 100vw" preload />
          </div>
        </div>
      </header>

      <section aria-label="Najważniejsze informacje" className="border-y border-line bg-white/55">
        <dl className="frame grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {service.facts.map((fact, i) => (
            <div key={fact.label} className={`pr-6 ${i % 2 === 1 ? "border-l border-line pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""}`}>
              <dt className="text-xs text-taupe">{fact.label}</dt>
              <dd className="mt-2 font-serif text-xl leading-snug text-espresso">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="frame grid gap-y-12 py-20 lg:grid-cols-12 lg:gap-x-8 lg:py-28">
        <nav aria-label="Na tej stronie" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-32 space-y-3 border-l border-line pl-5 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-taupe transition-colors hover:text-espresso">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-20 lg:col-span-8 lg:col-start-5 lg:space-y-24">
          <section id="opis" aria-labelledby="opis-title">
            <h2 id="opis-title" className="text-[clamp(2rem,3.5vw,2.75rem)]">
              Opis
            </h2>
            <div className="prose-body mt-6 text-base sm:text-lg">
              {service.description.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>

          <section id="przebieg" aria-labelledby="przebieg-title">
            <h2 id="przebieg-title" className="text-[clamp(2rem,3.5vw,2.75rem)]">
              Przebieg
            </h2>
            <ol className="mt-8 border-t border-line">
              {service.steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[4rem_14rem_1fr] sm:gap-x-6">
                  <span aria-hidden="true" className="font-serif text-xl italic text-champagne-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-xl leading-snug">{step.title}</h3>
                  <p className="col-start-2 mt-1 text-sm text-taupe sm:col-start-3 sm:mt-0 sm:text-base">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="wskazania" aria-labelledby="wskazania-title" className="grid gap-12 md:grid-cols-2 md:gap-10">
            <h2 id="wskazania-title" className="sr-only">
              Wskazania i przeciwwskazania
            </h2>
            <div>
              <h3 className="text-[clamp(1.75rem,3vw,2.25rem)]">Wskazania</h3>
              <ul className="mt-6 space-y-3">
                {service.indications.map((item) => (
                  <li key={item} className="flex gap-4 text-taupe">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-champagne" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:border-l md:border-line md:pl-10">
              <h3 className="text-[clamp(1.75rem,3vw,2.25rem)]">Przeciwwskazania</h3>
              {service.contraindicationsNote && <p className="mt-6 text-taupe">{service.contraindicationsNote}</p>}
              {service.contraindications.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {service.contraindications.map((item) => (
                    <li key={item} className="flex gap-4 text-taupe">
                      <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-espresso/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 text-sm text-taupe">Lista nie jest wyczerpująca – o ostatecznej kwalifikacji decyduje specjalista po zebraniu wywiadu.</p>
            </div>
          </section>

          <section id="kwalifikacja" aria-labelledby="kwalifikacja-title" className="bg-blush p-8 sm:p-12">
            <h2 id="kwalifikacja-title" className="text-[clamp(2rem,3.5vw,2.75rem)]">
              Kwalifikacja do zabiegu
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-espresso/85">
              {service.qualification.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <Link href={`${bookingHref}?zabieg=${service.slug}`} className="btn btn-primary mt-8">
              Umów konsultację
            </Link>
          </section>

          <DemoNote />
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="powiazane" className="border-t border-line">
          <div className="frame py-20">
            <h2 id="powiazane" className="font-serif text-3xl">
              Inne zabiegi: {category.name.toLowerCase()}
            </h2>
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug} className="border-t border-line">
                  <Link href={`/zabiegi/${s.slug}`} className="group block py-5">
                    <span className="font-serif text-xl group-hover:underline group-hover:decoration-champagne group-hover:decoration-1 group-hover:underline-offset-4">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-sm text-taupe">{s.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BookingCta serviceSlug={service.slug} />
    </>
  );
}

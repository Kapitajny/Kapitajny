import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta } from "@/components/ui/BookingCta";
import { DemoNote } from "@/components/ui/DemoNote";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { categories, servicesIn } from "@/data/services";

export const metadata: Metadata = {
  title: "Zabiegi – medycyna estetyczna, kosmetologia, terapie skóry",
  description:
    "Zabiegi w ÉLORIA Aesthetic Clinic: konsultacje i zabiegi medycyny estetycznej, oczyszczanie i pielęgnacja skóry, terapie kosmetologiczne oraz opieka nad skórą problematyczną.",
  alternates: { canonical: "/zabiegi" },
  openGraph: { title: "Zabiegi | ÉLORIA Aesthetic Clinic", url: "/zabiegi" },
};

const columns: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Zabiegi", path: "/zabiegi" }])} />
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/zabiegi", label: "Zabiegi" },
        ]}
        title="Zabiegi"
        lede="Każdy zabieg poprzedza rozmowa i kwalifikacja. Opisy poniżej pomogą Ci przygotować się do konsultacji – ostateczny plan ustalamy wspólnie, w gabinecie."
      >
        <nav aria-label="Obszary zabiegów" className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm">
          {categories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="link-quiet">
              {c.name}
            </a>
          ))}
        </nav>
      </PageIntro>

      {categories.map((category, ci) => {
        const items = servicesIn(category.slug);
        return (
          <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-title`} className={ci % 2 === 1 ? "bg-white/55" : ""}>
            <div className="frame py-20 lg:py-28">
              <div className="grid gap-6 md:grid-cols-12 md:items-end">
                <h2 id={`${category.slug}-title`} className="text-[clamp(2.5rem,5vw,4rem)] md:col-span-6">
                  {category.name}
                </h2>
                <div className="md:col-span-5 md:col-start-8">
                  <p className="text-taupe">{category.intro}</p>
                </div>
              </div>

              <ul className={`mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 ${columns[items.length] ?? "lg:grid-cols-3"}`}>
                {items.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/zabiegi/${service.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
                        <Photo
                          image={service.image}
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                          className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                        />
                      </div>
                      <h3 className="mt-6 font-serif text-2xl leading-tight group-hover:underline group-hover:decoration-champagne group-hover:decoration-1 group-hover:underline-offset-4">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-sm text-taupe">{service.summary}</p>
                      <span className="mt-4 inline-block text-sm font-medium text-espresso">Szczegóły zabiegu</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <div className="frame pb-16">
        <DemoNote />
      </div>

      <BookingCta title="Nie wiesz, od czego zacząć?" text="Wybierz w formularzu „Nie wiem, doradźcie” – koordynatorka pacjentek dobierze konsultację do Twoich potrzeb." />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bookingHref } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";
import { getCategory, getTreatment, treatments, treatmentsIn } from "@/data/treatments";

export const dynamicParams = false;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  const category = getCategory(treatment.category);
  return {
    title: treatment.name === category.name ? treatment.name : `${treatment.name} – ${category.name}`,
    description: `${treatment.lede} Consultation, indications, contraindications and qualification at VÉRA Aesthetic Studio.`,
    alternates: { canonical: `/treatments/${treatment.slug}` },
    openGraph: { title: `${treatment.name} | VÉRA Aesthetic Studio`, description: treatment.lede, url: `/treatments/${treatment.slug}`, type: "article" },
  };
}

const sections = [
  { id: "description", label: "Description" },
  { id: "consultation", label: "Consultation and visit" },
  { id: "indications", label: "Indications and contraindications" },
  { id: "qualification", label: "Qualification" },
];

export default async function TreatmentPage({ params }: PageProps<"/treatments/[slug]">) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();
  const category = getCategory(treatment.category);
  const related = treatmentsIn(treatment.category).filter((t) => t.slug !== treatment.slug);
  const bookHref = `${bookingHref}?treatment=${treatment.slug}`;

  return (
    <article>
      <header className="shell grid gap-12 pb-20 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="lg:col-span-7">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/treatments", label: "Treatments" },
              { href: `/treatments/${treatment.slug}`, label: treatment.name },
            ]}
          />
          <Link href={`/treatments#${category.slug}`} className="mt-10 inline-block text-sm font-medium text-rose-deep hover:text-burgundy">
            {category.name}
          </Link>
          <h1 className="display mt-4 text-[clamp(3rem,7.5vw,7rem)] text-burgundy">{treatment.name}</h1>
          <p className="lede mt-8 text-black/85">{treatment.lede}</p>
          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-black pt-6">
            <div>
              <dt className="text-xs text-stone">Duration</dt>
              <dd className="mt-1 font-serif text-2xl">{treatment.duration}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone">Usual course</dt>
              <dd className="mt-1 text-sm leading-relaxed">{treatment.course}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href={bookHref} className="btn btn-primary">
              Book a consultation
            </Link>
            <span className="text-sm text-stone">Price confirmed at the consultation.</span>
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <Photo image={treatment.image} priority sizes="(min-width: 1024px) 32vw, 100vw" className="aspect-[4/5]" />
        </div>
      </header>

      <div className="shell grid gap-12 pb-24 lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-[calc(var(--header-h)+2rem)] space-y-3 border-l border-line pl-5 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-stone hover:text-burgundy">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-24 lg:col-span-8 lg:col-start-5">
          <section id="description" aria-labelledby="description-title">
            <h2 id="description-title" className="font-serif text-4xl sm:text-5xl">
              Description
            </h2>
            <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed text-black/85">
              {treatment.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          <section id="consultation" aria-labelledby="consultation-title">
            <h2 id="consultation-title" className="font-serif text-4xl sm:text-5xl">
              Consultation and visit
            </h2>
            <ol className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {treatment.process.map((step, i) => (
                <li key={step.title} className="border-t border-black pt-5">
                  <span aria-hidden="true" className="font-serif text-4xl font-light text-rose-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
                  <p className="mt-2 text-sm text-stone">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="indications" aria-labelledby="indications-title">
            <h2 id="indications-title" className="sr-only">
              Indications and contraindications
            </h2>
            <div className="grid gap-12 sm:grid-cols-2 sm:gap-10">
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl">Indications</h3>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {treatment.indications.map((item) => (
                    <li key={item} className="py-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl">Contraindications</h3>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {treatment.contraindications.map((item) => (
                    <li key={item} className="py-4">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-stone">This list is not exhaustive. The specialist confirms contraindications during your visit.</p>
              </div>
            </div>
          </section>

          <section id="qualification" aria-labelledby="qualification-title" className="bg-burgundy px-6 py-12 text-ivory sm:px-12 sm:py-14">
            <h2 id="qualification-title" className="font-serif text-4xl sm:text-5xl">
              Qualification
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">{treatment.qualification}</p>
            <Link href={bookHref} className="btn btn-light mt-10">
              Book a consultation
            </Link>
          </section>

          <DemoNote>
            Demonstration content. The description, indications and contraindications must be reviewed and approved by the studio&apos;s medical staff before
            publication. Results vary between people and are never guaranteed.
          </DemoNote>
        </div>
      </div>

      {related.length > 0 && (
        <aside aria-labelledby="related-title" className="border-t border-line">
          <div className="shell py-20">
            <h2 id="related-title" className="font-serif text-3xl">
              Also in {category.name.toLowerCase()}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link href={`/treatments/${t.slug}`} className="group block border-t border-black pt-5">
                    <span className="block font-serif text-2xl group-hover:text-burgundy">{t.name}</span>
                    <span className="mt-2 block text-sm text-stone">{t.lede}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </article>
  );
}

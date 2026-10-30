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

export async function generateMetadata({ params }: PageProps<"/zabiegi/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  const category = getCategory(treatment.category);
  return {
    title: treatment.name === category.name ? treatment.name : `${treatment.name} – ${category.name}`,
    description: `${treatment.lede} Konsultacja, wskazania, przeciwwskazania i kwalifikacja – VÉRA Aesthetic Studio.`,
    alternates: { canonical: `/zabiegi/${treatment.slug}` },
    openGraph: { title: `${treatment.name} | VÉRA Aesthetic Studio`, description: treatment.lede, url: `/zabiegi/${treatment.slug}`, type: "article" },
  };
}

export default async function TreatmentPage({ params }: PageProps<"/zabiegi/[slug]">) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();
  const category = getCategory(treatment.category);
  const related = treatmentsIn(treatment.category).filter((t) => t.slug !== treatment.slug);
  const bookHref = `${bookingHref}?zabieg=${treatment.slug}`;

  return (
    <article>
      <header className="shell pb-16 pt-[calc(var(--header-h)+2.5rem)] text-center lg:pt-[calc(var(--header-h)+3.5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Strona główna" },
            { href: "/zabiegi", label: "Zabiegi" },
            { href: `/zabiegi/${treatment.slug}`, label: treatment.name },
          ]}
        />
        <Photo image={treatment.image} priority sizes="260px" className="oval mx-auto mt-10 aspect-[3/4] w-44 sm:w-56" />
        <Link href={`/zabiegi#${category.slug}`} className="mt-8 inline-block text-sm text-rose-deep hover:underline">
          {category.name}
        </Link>
        <h1 className="script mx-auto mt-2 max-w-4xl text-[clamp(2.8rem,8vw,5.75rem)] leading-[1.02]">{treatment.name}</h1>
        <p className="lede mx-auto mt-6 max-w-2xl text-stone">{treatment.lede}</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5 text-sm" aria-label="W skrócie">
          <li className="rounded-full bg-blush px-4 py-2">Czas: {treatment.duration}</li>
          <li className="rounded-full bg-blush px-4 py-2">{treatment.course}</li>
        </ul>
        <div className="mt-9 flex flex-col items-center gap-2">
          <Link href={bookHref} className="pill pill-solid">
            Umów konsultację
          </Link>
          <span className="text-xs text-stone">Cenę potwierdzamy podczas konsultacji.</span>
        </div>
      </header>

      <section aria-labelledby="opis-title" className="shell pb-20">
        <h2 id="opis-title" className="script text-center text-[clamp(2.2rem,5vw,3.4rem)]">
          Na czym polega
        </h2>
        <div className="prose-soft mt-6 text-center">
          {treatment.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="przebieg-title" className="bg-blush py-20">
        <div className="shell">
          <h2 id="przebieg-title" className="script text-center text-[clamp(2.2rem,5vw,3.4rem)]">
            Jak wygląda wizyta
          </h2>
          <ol className={`mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-2 ${treatment.process.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {treatment.process.map((step, i) => (
              <li key={step.title} className="text-center">
                <span aria-hidden="true" className="script mx-auto grid h-14 w-14 place-items-center rounded-full bg-ivory text-2xl">
                  {i + 1}
                </span>
                <h3 className="script mt-4 text-2xl leading-tight">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm font-light text-stone">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="wskazania-title" className="shell py-20">
        <h2 id="wskazania-title" className="sr-only">
          Wskazania i przeciwwskazania
        </h2>
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="rounded-[2.25rem] bg-white/70 px-7 py-9 sm:px-10">
            <h3 className="script text-3xl">Dla kogo</h3>
            <ul className="mt-5 space-y-3">
              {treatment.indications.map((item) => (
                <li key={item} className="flex gap-3 font-light">
                  <span aria-hidden="true" className="mt-[0.6em] h-2 w-3 shrink-0 rounded-full bg-rose" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2.25rem] bg-powder/60 px-7 py-9 sm:px-10">
            <h3 className="script text-3xl">Kiedy nie</h3>
            <ul className="mt-5 space-y-3">
              {treatment.contraindications.map((item) => (
                <li key={item} className="flex gap-3 font-light">
                  <span aria-hidden="true" className="mt-[0.6em] h-2 w-3 shrink-0 rounded-full border border-burgundy" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-stone">Lista nie jest wyczerpująca. Przeciwwskazania potwierdzamy podczas wizyty.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="kwalifikacja-title" className="shell pb-20">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-burgundy px-6 py-14 text-center text-ivory sm:rounded-[4rem] sm:px-14">
          <h2 id="kwalifikacja-title" className="script text-[clamp(2.2rem,5vw,3.4rem)]">
            Kwalifikacja
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ivory/90">{treatment.qualification}</p>
          <Link href={bookHref} className="pill pill-ivory mt-9">
            Umów konsultację
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <aside aria-labelledby="related-title" className="shell pb-16 text-center">
          <h2 id="related-title" className="script text-3xl">
            Może Cię też zainteresować
          </h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
            {related.map((t) => (
              <li key={t.slug}>
                <Link href={`/zabiegi/${t.slug}`} className="pill pill-line whitespace-normal text-center">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="shell pb-16">
        <DemoNote>
          Treść demonstracyjna. Opis, wskazania i przeciwwskazania musi przed publikacją sprawdzić i zatwierdzić personel medyczny studia. Efekty różnią się u
          poszczególnych osób i nigdy nie są gwarantowane.
        </DemoNote>
      </div>
    </article>
  );
}

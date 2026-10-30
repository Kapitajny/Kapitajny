import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Photo } from "@/components/ui/Photo";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { imageSrc } from "@/config/images";
import { formatDate, getEntry, journal, type JournalBlock } from "@/data/journal";

export const dynamicParams = false;

export function generateStaticParams() {
  return journal.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/magazyn/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.excerpt,
    alternates: { canonical: `/magazyn/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.excerpt,
      url: `/magazyn/${entry.slug}`,
      type: "article",
      publishedTime: entry.date,
      images: [{ url: imageSrc(entry.image) }],
    },
  };
}

function Block({ block }: { block: JournalBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "list":
      return (
        <ul>
          {block.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="!my-12 border-l-2 border-burgundy pl-6 font-serif text-3xl italic leading-snug text-burgundy">
          <p>{block.text}</p>
        </blockquote>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function JournalEntryPage({ params }: PageProps<"/magazyn/[slug]">) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  const others = journal.filter((e) => e.slug !== entry.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.excerpt,
          datePublished: entry.date,
          author: { "@type": "Person", name: entry.author },
          publisher: { "@type": "Organization", name: siteConfig.fullName },
          image: `${siteConfig.url}${imageSrc(entry.image)}`,
        }}
      />
      <article>
        <header className="shell pb-14 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
          <Breadcrumbs
            items={[
              { href: "/", label: "Strona główna" },
              { href: "/magazyn", label: "Magazyn" },
              { href: `/magazyn/${entry.slug}`, label: entry.title },
            ]}
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <p className="text-sm font-medium text-rose-deep">{entry.topic}</p>
              <h1 className="display mt-4 text-[clamp(2.75rem,7vw,6.5rem)] text-burgundy">{entry.title}</h1>
            </div>
            <dl className="grid grid-cols-3 gap-4 self-end border-t border-black pt-4 text-sm lg:col-span-3 lg:col-start-10 lg:grid-cols-1">
              <div>
                <dt className="text-xs text-stone">Autor</dt>
                <dd>{entry.author}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Data</dt>
                <dd>
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone">Czas czytania</dt>
                <dd>{entry.readingMinutes} min</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="shell">
          <Photo image={entry.image} priority sizes="(min-width: 1024px) 66vw, 100vw" className="aspect-[16/10] lg:w-2/3" />
        </div>

        <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
          <p className="font-serif text-2xl leading-snug lg:col-span-3">{entry.excerpt}</p>
          <div className="prose-vera lg:col-span-7 lg:col-start-5">
            {entry.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <p className="!mt-14 border-t border-line pt-6 text-sm text-stone">
              Informacje ogólne, nie porada medyczna. Pytania o Twoją skórę najlepiej zadać podczas konsultacji.
            </p>
          </div>
        </div>
      </article>

      <aside aria-labelledby="more-title" className="border-t border-line">
        <div className="shell py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 id="more-title" className="font-serif text-4xl">
              Więcej z magazynu
            </h2>
            <Link href="/magazyn" className="link-line text-sm font-semibold text-burgundy">
              Wszystkie artykuły
            </Link>
          </div>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2">
            {others.map((e) => (
              <li key={e.slug}>
                <Link href={`/magazyn/${e.slug}`} className="group block border-t border-black pt-5">
                  <span className="block text-xs font-medium text-rose-deep">{e.topic}</span>
                  <span className="mt-2 block font-serif text-3xl leading-tight group-hover:text-burgundy">{e.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <CtaBand title="Masz pytania o swoją skórę?" text="Konsultacja jest właśnie na nie. Wychodzisz z pisemnym planem i bez zobowiązań." />
    </>
  );
}

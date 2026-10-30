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
        <blockquote className="script !my-12 rounded-[2rem] bg-powder/60 px-8 py-8 text-center text-3xl leading-snug">
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
        <header className="shell pb-12 pt-[calc(var(--header-h)+2.5rem)] text-center lg:pt-[calc(var(--header-h)+3.5rem)]">
          <Breadcrumbs
            items={[
              { href: "/", label: "Strona główna" },
              { href: "/magazyn", label: "Magazyn" },
              { href: `/magazyn/${entry.slug}`, label: entry.title },
            ]}
          />
          <p className="mt-10 text-sm text-rose-deep">{entry.topic}</p>
          <h1 className="script mx-auto mt-3 max-w-4xl text-[clamp(2.6rem,7vw,5.25rem)] leading-[1.04]">{entry.title}</h1>
          <p className="mt-6 text-sm text-stone">
            {entry.author}, <time dateTime={entry.date}>{formatDate(entry.date)}</time>, {entry.readingMinutes} min czytania
          </p>
        </header>

        <div className="shell">
          <Photo image={entry.image} priority sizes="(min-width: 1024px) 60vw, 100vw" className="mx-auto aspect-[16/10] max-w-4xl rounded-[2.5rem] sm:rounded-[4rem]" />
        </div>

        <div className="shell py-16 sm:py-20">
          <p className="script mx-auto max-w-2xl text-center text-[1.75rem] leading-snug sm:text-3xl">{entry.excerpt}</p>
          <div className="prose-soft mt-12">
            {entry.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <p className="!mt-14 rounded-[1.5rem] bg-blush px-6 py-5 text-center text-sm text-stone">
              Informacje ogólne, nie porada medyczna. Pytania o Twoją skórę najlepiej zadać podczas konsultacji.
            </p>
          </div>
        </div>
      </article>

      <aside aria-labelledby="more-title" className="shell pb-6 text-center">
        <h2 id="more-title" className="script text-3xl">
          Przeczytaj też
        </h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
          {others.map((e) => (
            <li key={e.slug}>
              <Link href={`/magazyn/${e.slug}`} className="pill pill-line whitespace-normal text-center">
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <CtaBand title="Masz pytania o swoją skórę?" text="Konsultacja jest właśnie na nie. Wychodzisz z pisemnym planem i bez zobowiązań." />
    </>
  );
}

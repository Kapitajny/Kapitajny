import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { BookBand } from "@/components/ui/BookBand";
import { Crumbs } from "@/components/ui/Crumbs";
import { DemoNote } from "@/components/ui/DemoNote";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";
import { articles, formatDate, getArticle } from "@/data/journal";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { title: `${a.title} – VÉRA Journal`, description: a.dek, url: `/journal/${a.slug}`, type: "article", publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 2);
  const [intro, ...sections] = a.body;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.dek,
          datePublished: a.date,
          publisher: { "@type": "Organization", name: site.fullName },
        }}
      />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Journal", path: "/journal" }, { name: a.title, path: `/journal/${a.slug}` }])} />

      <article>
        <header className="wrap pb-14 pt-[calc(var(--bar)+2.5rem)]">
          <Crumbs items={[{ href: "/", label: "Home" }, { href: "/journal", label: "Journal" }, { href: `/journal/${a.slug}`, label: a.title }]} />
          <div className="mx-auto mt-16 max-w-4xl text-center">
            <p className="kicker text-rose-deep">{a.category}</p>
            <h1 className="display-lg mt-6">{a.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone">{a.dek}</p>
            <p className="mt-6 text-sm text-stone">
              <time dateTime={a.date}>{formatDate(a.date)}</time> – {a.readingMinutes} min read
            </p>
          </div>
        </header>

        <div className="wrap">
          <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden">
            <Shot image={a.image} sizes="448px" preload />
          </div>
        </div>

        <div className="wrap py-16 lg:py-24">
          <div className="mx-auto max-w-[38rem] text-lg leading-relaxed text-black/85">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-burgundy">
              {intro.text}
            </p>
            {sections.map((s) => (
              <section key={s.text.slice(0, 30)} className="mt-10">
                {s.heading && <h2 className="font-display text-3xl leading-tight text-black">{s.heading}</h2>}
                <p className="mt-4">{s.text}</p>
              </section>
            ))}
            <DemoNote className="mt-14">Demo article for a ComputerIT concept – to be reviewed by the studio&apos;s specialists. It is general information, not individual medical advice.</DemoNote>
          </div>
        </div>
      </article>

      <section aria-labelledby="more" className="border-t border-black/15">
        <div className="wrap py-16">
          <h2 id="more" className="kicker text-stone">
            More from the Journal
          </h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-2">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/journal/${m.slug}`} className="group block border-t border-black pt-5">
                  <span className="font-display text-3xl leading-tight group-hover:italic">{m.title}</span>
                  <span className="mt-2 block text-stone">{m.dek}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <BookBand />
    </>
  );
}

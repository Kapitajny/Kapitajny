import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { IconInfo } from "@/components/ui/Icons";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { ARTICLE_CATEGORIES, articles, getArticle } from "@/data/articles";
import { formatDate } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/baza-wiedzy/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  const meta = pageMetadata({ title: article.title, description: article.excerpt, path: `/baza-wiedzy/${article.slug}` });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: article.publishedAt } };
}

export default async function ArticlePage({ params }: PageProps<"/baza-wiedzy/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2);
  const more = related.length ? related : articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <article>
        <header className="border-b border-line bg-mist">
          <div className="shell py-10 sm:py-14">
            <Breadcrumbs items={[{ href: "/baza-wiedzy", label: "Baza wiedzy" }, { href: `/baza-wiedzy/${article.slug}`, label: article.title }]} />
            <p className="kicker mt-8">{ARTICLE_CATEGORIES[article.category]}</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.1rem,1.5rem+2.4vw,3.5rem)]">{article.title}</h1>
            <p className="lede mt-5">{article.excerpt}</p>
            <p className="mt-6 text-sm text-muted">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>, {article.readingMinutes} min czytania
            </p>
          </div>
        </header>
        <div className="shell grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="prose-body text-ink">
            {article.body.map((block, i) => {
              switch (block.type) {
                case "h2":
                  return <h2 key={i}>{block.text}</h2>;
                case "p":
                  return <p key={i}>{block.text}</p>;
                case "ul":
                  return (
                    <ul key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                case "ol":
                  return (
                    <ol key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  );
                case "note":
                  return (
                    <aside key={i} className="flex gap-3 rounded-[var(--radius-control)] border border-blue/30 bg-sky p-4 text-[0.9375rem]">
                      <IconInfo size={20} className="mt-0.5 shrink-0 text-blue-ink" />
                      <p>{block.text}</p>
                    </aside>
                  );
              }
            })}
          </div>
          <aside aria-label="Czytaj dalej" className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="panel p-5">
              <p className="text-sm font-semibold text-navy">Czytaj dalej</p>
              <ul className="mt-3 space-y-4">
                {more.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/baza-wiedzy/${a.slug}`} className="font-medium text-navy hover:text-blue-ink hover:underline">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-5">
              <p className="text-sm font-semibold text-navy">Masz konkretne pytanie?</p>
              <p className="mt-1 text-sm text-muted">Opisz sytuację – przygotujemy indywidualną wycenę.</p>
              <Link href="/wycena" className="btn btn-sm btn-primary mt-4 w-full">
                Poproś o wycenę
              </Link>
            </div>
          </aside>
        </div>
      </article>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          inLanguage: "pl-PL",
          mainEntityOfPage: absoluteUrl(`/baza-wiedzy/${article.slug}`),
          publisher: { "@type": "Organization", name: `${siteConfig.name} (projekt demonstracyjny)` },
        }}
      />
    </>
  );
}

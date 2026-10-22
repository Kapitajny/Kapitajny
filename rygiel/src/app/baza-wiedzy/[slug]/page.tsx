import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBlocks } from "@/components/knowledge/ArticleBody";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { articleCategories, articles, getArticle, readingMinutes } from "@/content/articles";
import { siteConfig } from "@/content/site";
import { getService } from "@/content/services";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { typeset } from "@/lib/typography";
import proseStyles from "@/components/knowledge/ArticleBody.module.css";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/baza-wiedzy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const base = pageMetadata({ title: article.title, description: article.description, path: `/baza-wiedzy/${article.slug}`, type: "article" });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", publishedTime: article.published, modifiedTime: article.updated },
  };
}

const dateFormat = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

export default async function ArticlePage({ params }: PageProps<"/baza-wiedzy/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = articles[index - 1];
  const next = articles[index + 1];
  const related = article.related.map(getArticle).filter((item) => item !== undefined);
  const minutes = readingMinutes(article);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.published,
          dateModified: article.updated,
          inLanguage: "pl-PL",
          mainEntityOfPage: absoluteUrl(`/baza-wiedzy/${article.slug}`),
          author: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") },
          publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") },
        }}
      />
      <PageHeader
        breadcrumbs={[
          { href: "/baza-wiedzy", label: "Baza wiedzy" },
          { href: `/baza-wiedzy/${article.slug}`, label: article.title },
        ]}
        kicker={articleCategories[article.category]}
        title={article.title}
      >
        <p className={styles.meta}>
          <span>
            Aktualizacja: <time dateTime={article.updated}>{dateFormat.format(new Date(article.updated))}</time>
          </span>
          <span>{minutes} min czytania</span>
        </p>
      </PageHeader>

      <div className={`container ${styles.layout}`}>
        <nav className={styles.toc} aria-labelledby="spis-tresci">
          <p id="spis-tresci" className={styles.tocTitle}>
            W&nbsp;tym artykule
          </p>
          <ol className={styles.tocList}>
            {article.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{typeset(section.heading)}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className={`${proseStyles.prose} ${styles.article}`}>
          <p className={styles.lead}>{typeset(article.lead)}</p>
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`}>
              <h2 id={`${section.id}-h`}>{typeset(section.heading)}</h2>
              <ArticleBlocks blocks={section.blocks} />
            </section>
          ))}
        </article>

        <aside className={styles.aside} aria-label="Powiązane materiały">
          {related.length > 0 ? (
            <div className={styles.asideBlock}>
              <h2 className={styles.asideTitle}>Przeczytaj też</h2>
              <ul role="list">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/baza-wiedzy/${item.slug}`}>{typeset(item.title)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={styles.asideBlock}>
            <h2 className={styles.asideTitle}>Powiązane usługi</h2>
            <ul role="list">
              {article.services.map((serviceSlug) => {
                const service = getService(serviceSlug);
                return (
                  <li key={service.slug}>
                    <Link href={service.href}>{service.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      <nav className={`container ${styles.pager}`} aria-label="Poprzedni i następny artykuł">
        {previous ? (
          <Link href={`/baza-wiedzy/${previous.slug}`} className={styles.pagerLink} rel="prev">
            <span className={styles.pagerLabel}>Poprzedni artykuł</span>
            {typeset(previous.title)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/baza-wiedzy/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
            <span className={styles.pagerLabel}>Następny artykuł</span>
            {typeset(next.title)}
          </Link>
        ) : null}
      </nav>

      <ClosingCta
        headingId="artykul-cta"
        title="Masz pytanie dotyczące swojej firmy?"
        text="Opisz sytuację w formularzu. Odpowiemy konkretnie, nawet jeśli wystarczy jedna zmiana w konfiguracji."
        secondary={{ href: "/baza-wiedzy", label: "Wróć do bazy wiedzy" }}
      />
    </>
  );
}

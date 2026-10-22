import type { Metadata } from "next";
import { ArticleIndex } from "@/components/knowledge/ArticleIndex";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { PageHeader } from "@/components/ui/PageHeader";
import { articles, readingMinutes } from "@/content/articles";
import { pageMetadata } from "@/lib/seo";
import { typeset } from "@/lib/typography";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Baza wiedzy – cyberbezpieczeństwo i IT dla małych firm",
  description:
    "Praktyczne artykuły o bezpieczeństwie IT w małej firmie: podstawy cyberbezpieczeństwa, kopie zapasowe 3-2-1, SPF, DKIM i DMARC, zarządzanie dostępami i ochrona przed phishingiem.",
  path: "/baza-wiedzy",
});

export default function KnowledgeBasePage() {
  const summaries = articles.map((article) => ({
    slug: article.slug,
    title: typeset(article.title),
    description: typeset(article.description),
    category: article.category,
    minutes: readingMinutes(article),
  }));

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/baza-wiedzy", label: "Baza wiedzy" }]}
        title="Baza wiedzy"
        lede="Praktyczne teksty dla właścicieli firm i osób odpowiedzialnych za IT. Każdy kończy się listą rzeczy, które możesz sprawdzić lub zrobić samodzielnie."
      />
      <section className={`container ${styles.section}`} aria-label="Artykuły">
        <ArticleIndex articles={summaries} />
      </section>
      <ClosingCta
        headingId="baza-cta"
        title="Chcesz, żebyśmy sprawdzili to w Twojej firmie?"
        text="Artykuły pomogą Ci zacząć. Jeśli chcesz mieć pewność, że wszystko jest ustawione poprawnie, zacznijmy od przeglądu środowiska."
        secondary={{ href: "/uslugi", label: "Zobacz zakres usług" }}
      />
    </>
  );
}

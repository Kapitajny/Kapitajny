import { ArticleBrowser } from "@/components/knowledge/ArticleBrowser";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageIntro } from "@/components/ui/PageIntro";
import { articles } from "@/data/articles";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Baza wiedzy dla przedsiębiorców",
  description:
    "Artykuły o współpracy z biurem rachunkowym, kosztach księgowości, formach działalności, dokumentach i doradztwie podatkowym. Treści ogólne i edukacyjne.",
  path: "/baza-wiedzy",
});

export default function KnowledgeBasePage() {
  const items = articles.map(({ body: _body, ...rest }) => {
    void _body;
    return rest;
  });
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/baza-wiedzy", label: "Baza wiedzy" }]}
        title="Baza wiedzy"
        lede="Praktyczne wyjaśnienia dla przedsiębiorców. Artykuły mają charakter ogólny – w sprawach podatkowych i prawnych zawsze sprawdź aktualne przepisy i skonsultuj się z uprawnionym specjalistą."
      />
      <section className="py-12 sm:py-16">
        <div className="shell">
          <ArticleBrowser articles={items} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}

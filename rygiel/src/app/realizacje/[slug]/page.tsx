import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseTitleBlockRows } from "@/components/cases/case-meta";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";
import { ProblemList } from "@/components/services/ServiceBlocks";
import { ClosingCta } from "@/components/ui/ClosingCta";
import { PageHeader } from "@/components/ui/PageHeader";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { caseStudies, getCaseStudy } from "@/content/cases";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps<"/realizacje/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({
    title: `${study.title} (realizacja demonstracyjna)`,
    description: study.summary,
    path: `/realizacje/${study.slug}`,
    type: "article",
  });
}

const sections = [
  { id: "kontekst", label: "Kontekst i problem" },
  { id: "zalozenia", label: "Założenia" },
  { id: "analiza", label: "Analiza rozwiązań" },
  { id: "architektura", label: "Schemat" },
  { id: "zakres", label: "Zakres prac" },
  { id: "kryteria", label: "Kryteria oceny" },
];

export default async function CaseStudyPage({ params }: PageProps<"/realizacje/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const previous = caseStudies[index - 1];
  const next = caseStudies[index + 1];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/realizacje", label: "Realizacje" },
          { href: `/realizacje/${study.slug}`, label: study.title },
        ]}
        kicker="Realizacja demonstracyjna – firma i dane są fikcyjne"
        title={study.title}
        lede={study.summary}
        aside={<TitleBlock rows={caseTitleBlockRows(study)} label="Metryczka realizacji" />}
      />

      <div className={`container ${styles.layout}`}>
        <nav className={styles.toc} aria-labelledby="spis-tresci">
          <p id="spis-tresci" className={styles.tocTitle}>
            Spis treści
          </p>
          <ol className={styles.tocList}>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className={styles.article}>
          <section id="kontekst" aria-labelledby="kontekst-title" className={styles.section}>
            <h2 id="kontekst-title" className={styles.h2}>
              Kontekst i&nbsp;problem
            </h2>
            {study.context.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            <h3 className={styles.h3}>Co nie działało</h3>
            <ProblemList items={study.problems} />
          </section>

          <section id="zalozenia" aria-labelledby="zalozenia-title" className={styles.section}>
            <h2 id="zalozenia-title" className={styles.h2}>
              Założenia projektu
            </h2>
            <ol className={styles.assumptions}>
              {study.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section id="analiza" aria-labelledby="analiza-title" className={styles.section}>
            <h2 id="analiza-title" className={styles.h2}>
              Analiza proponowanego rozwiązania
            </h2>
            <p className={styles.paragraph}>{study.analysis.intro}</p>
            <div className={styles.options}>
              {study.analysis.options.map((option) => (
                <div key={option.name} className={styles.option} data-chosen={option.chosen || undefined}>
                  <h3 className={styles.optionName}>
                    {option.name}
                    <span className={styles.decision}>{option.chosen ? "Wybrany" : "Odrzucony"}</span>
                  </h3>
                  <dl className={styles.optionDetails}>
                    <div>
                      <dt>Zalety</dt>
                      <dd>{option.pros}</dd>
                    </div>
                    <div>
                      <dt>Ograniczenia</dt>
                      <dd>{option.cons}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
            <p className={`${styles.paragraph} ${styles.conclusion}`}>{study.analysis.conclusion}</p>
          </section>

          <section id="architektura" aria-labelledby="architektura-title" className={styles.section}>
            <h2 id="architektura-title" className={styles.h2}>
              Schemat rozwiązania
            </h2>
            <FlowDiagram diagram={study.diagram} />
          </section>

          <section id="zakres" aria-labelledby="zakres-title" className={styles.section}>
            <h2 id="zakres-title" className={styles.h2}>
              Zakres prac
            </h2>
            <ol className={styles.stages}>
              {study.scope.map((stage) => (
                <li key={stage.stage} className={styles.stage}>
                  <h3 className={styles.stageTitle}>{stage.stage}</h3>
                  <ul role="list">
                    {stage.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section id="kryteria" aria-labelledby="kryteria-title" className={styles.section}>
            <h2 id="kryteria-title" className={styles.h2}>
              Kryteria oceny efektu
            </h2>
            <p className={styles.paragraph}>
              Projekt odbieramy według kryteriów ustalonych na początku. Każde ma określony sposób weryfikacji, który klient może powtórzyć samodzielnie.
            </p>
            <table className={styles.criteria}>
              <caption className="visually-hidden">Kryteria oceny efektu i&nbsp;sposób ich weryfikacji</caption>
              <thead>
                <tr>
                  <th scope="col">Kryterium</th>
                  <th scope="col">Sposób weryfikacji</th>
                </tr>
              </thead>
              <tbody>
                {study.criteria.map((item) => (
                  <tr key={item.criterion}>
                    <th scope="row">{item.criterion}</th>
                    <td>{item.verification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className={styles.related} aria-labelledby="powiazane-uslugi">
            <h2 id="powiazane-uslugi" className={styles.relatedTitle}>
              Usługi wykorzystane w&nbsp;projekcie
            </h2>
            <ul role="list">
              {study.services.map((serviceSlug) => {
                const service = getService(serviceSlug);
                return (
                  <li key={service.slug}>
                    <Link href={service.href} className="text-link">
                      {service.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <nav className={styles.pager} aria-label="Inne realizacje">
            {previous ? (
              <Link href={`/realizacje/${previous.slug}`} className={styles.pagerLink} rel="prev">
                <span className={styles.pagerLabel}>Poprzednia realizacja</span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/realizacje/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
                <span className={styles.pagerLabel}>Następna realizacja</span>
                {next.title}
              </Link>
            ) : null}
          </nav>
        </article>
      </div>

      <ClosingCta
        headingId="realizacja-cta"
        title="Chcesz przejść podobną drogę w swojej firmie?"
        text="Zaczniemy od rozmowy i przeglądu środowiska. Kryteria odbioru ustalimy razem, zanim zaczniemy cokolwiek zmieniać."
        secondary={{ href: "/realizacje", label: "Wróć do listy realizacji" }}
      />
    </>
  );
}

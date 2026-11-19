import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legal } from "@/content/legal";
import { hasLocale, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { docFromSlug, legalDocs, legalHref, legalSlugs } from "@/i18n/routes";
import { InfoIcon } from "@/components/ui/Icons";
import styles from "../subpage.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => legalDocs.map((doc) => ({ lang, doc: legalSlugs[lang][doc] })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[doc]">): Promise<Metadata> {
  const { lang, doc: slug } = await params;
  if (!hasLocale(lang)) return {};
  const doc = docFromSlug(lang, slug);
  if (!doc) return {};
  return {
    title: legal[lang][doc].title,
    alternates: { canonical: legalHref(lang, doc), languages: { "pl-PL": legalHref("pl", doc), "en-GB": legalHref("en", doc) } },
    robots: { index: false },
  };
}

export default async function LegalPage({ params }: PageProps<"/[lang]/[doc]">) {
  const { lang, doc: slug } = await params;
  if (!hasLocale(lang)) notFound();
  const doc = docFromSlug(lang, slug);
  if (!doc) notFound();
  const t = await getDictionary(lang);
  const content = legal[lang][doc];

  return (
    <main id="main" className={styles.page}>
      <article className={`container ${styles.narrow}`}>
        <a href={localePath(lang, "/")} className={styles.back}>
          {t.legal.back}
        </a>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.meta}>
          {t.legal.updated} {content.updated}
        </p>
        <p className="demo-note">
          <InfoIcon size={16} />
          {t.legal.draft}
        </p>
        <div className={styles.prose}>
          {content.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p?.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((li) => (
                    <li key={li.slice(0, 30)}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

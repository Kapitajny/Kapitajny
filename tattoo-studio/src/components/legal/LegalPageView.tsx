"use client";

import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { legalEn } from "@/i18n/legal/en";
import { legalPl } from "@/i18n/legal/pl";
import type { LegalContent } from "@/i18n/legal/types";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { Footer } from "@/components/layout/Footer";
import { SubpageHeader } from "@/components/layout/SubpageHeader";

const CONTENT = { pl: legalPl, en: legalEn };

/** Zamienia {{tokeny}} na dane studia lub oznaczenia „do uzupełnienia”, a [[…]] na miejsca do uzupełnienia. */
function renderText(text: string, content: LegalContent, todoBy: string, todo: string, links: { terms: string; privacy: string }): ReactNode[] {
  const values: Record<string, string> = {
    companyName: siteConfig.legal.companyName,
    companyAddress: siteConfig.legal.companyAddress,
    nip: siteConfig.legal.nip,
    regon: siteConfig.legal.regon,
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    studio: siteConfig.name,
  };
  return text.split(/(\{\{[^}]+\}\}|\[\[[^\]]+\]\])/g).map((part, i) => {
    if (part.startsWith("[[")) {
      return (
        <span key={i} className="todo">
          {todoBy} {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("{{")) {
      const token = part.slice(2, -2);
      if (token === "link:privacy" || token === "link:terms") {
        const route = token === "link:privacy" ? "privacy" : "terms";
        return (
          <LocalizedLink key={i} route={route}>
            {links[route]}
          </LocalizedLink>
        );
      }
      const value = values[token];
      if (value) return <span key={i}>{value}</span>;
      const label = content.tokenLabels[token as keyof LegalContent["tokenLabels"]] ?? token;
      return (
        <span key={i} className="todo">
          [{label}: {todo}]
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function LegalPageView({ doc }: { doc: "terms" | "privacy" }) {
  const { t, lang } = useI18n();
  const content = CONTENT[lang];
  const title = t.legal.links[doc];
  const render = (text: string) => renderText(text, content, t.common.todoBy, t.common.todo, t.legal.links);

  return (
    <>
      <SubpageHeader />
      <main id="main" className="page-x py-16 sm:py-24">
        <article className="mx-auto max-w-[44rem]">
          <h1 className="display display-lg">{title}</h1>
          <p className="mt-6 border-l-2 border-kin pl-4 font-gothic text-sm leading-relaxed text-nezumi">{t.legal.draftNote}</p>
          <p className="mt-3 font-gothic text-xs text-nezumi">
            {t.legal.updated}{" "}
            {siteConfig.legal.documentsUpdated || (
              <span className="todo">
                [{t.legal.date}: {t.common.todo}]
              </span>
            )}
          </p>
          <div className="legal mt-12 font-gothic text-base leading-[1.85]">
            {content[doc].sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.blocks.map((block, i) =>
                  "p" in block ? (
                    <p key={i}>{render(block.p)}</p>
                  ) : "ul" in block ? (
                    <ul key={i}>
                      {block.ul.map((item) => (
                        <li key={item}>{render(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <ol key={i}>
                      {block.ol.map((item) => (
                        <li key={item}>{render(item)}</li>
                      ))}
                    </ol>
                  ),
                )}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

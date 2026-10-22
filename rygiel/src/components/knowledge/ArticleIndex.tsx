"use client";

import Link from "next/link";
import { useState } from "react";
import { articleCategories, filterArticles, type ArticleCategory } from "@/content/taxonomy";
import styles from "./ArticleIndex.module.css";

export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  minutes: number;
};

export function ArticleIndex({ articles }: { articles: ArticleSummary[] }) {
  const [category, setCategory] = useState<ArticleCategory | "all">("all");
  const visible = filterArticles(articles, category);
  const categories = Object.entries(articleCategories) as [ArticleCategory, string][];

  return (
    <div className={styles.root}>
      <div className={styles.filters} role="group" aria-label="Filtr kategorii artykułów">
        <button type="button" className={styles.chip} aria-pressed={category === "all"} onClick={() => setCategory("all")}>
          Wszystkie tematy
        </button>
        {categories.map(([key, label]) => (
          <button key={key} type="button" className={styles.chip} aria-pressed={category === key} onClick={() => setCategory(key)}>
            {label}
          </button>
        ))}
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {category === "all" ? `Wszystkie artykuły: ${articles.length}` : `Artykuły w kategorii „${articleCategories[category]}”: ${visible.length}`}
      </p>

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <p>W tej kategorii nie ma jeszcze artykułów.</p>
          <button type="button" className={styles.reset} onClick={() => setCategory("all")}>
            Pokaż wszystkie artykuły
          </button>
        </div>
      ) : (
        <ol role="list" className={styles.list}>
          {visible.map((article) => (
            <li key={article.slug} className={styles.item}>
              <p className={styles.meta}>
                <span>{articleCategories[article.category]}</span>
                <span>{article.minutes} min czytania</span>
              </p>
              <div className={styles.body}>
                <h2 className={styles.title}>
                  <Link href={`/baza-wiedzy/${article.slug}`} className={styles.link}>
                    {article.title}
                  </Link>
                </h2>
                <p className={styles.description}>{article.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

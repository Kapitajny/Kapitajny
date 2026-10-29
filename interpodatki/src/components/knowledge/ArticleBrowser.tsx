"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowRight, IconSearch } from "@/components/ui/Icons";
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from "@/data/articles";
import { formatDate } from "@/lib/format";

/** Normalizacja do wyszukiwania: bez wielkich liter i polskich znaków diakrytycznych. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

type Item = Pick<Article, "slug" | "title" | "excerpt" | "category" | "readingMinutes" | "publishedAt" | "tags">;

export function ArticleBrowser({ articles }: { articles: Item[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ArticleCategory | "all">("all");

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return articles.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      const haystack = normalize([a.title, a.excerpt, ...a.tags, ARTICLE_CATEGORIES[a.category]].join(" "));
      return terms.every((t) => haystack.includes(t));
    });
  }, [articles, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor="szukaj" className="field-label">
            Szukaj w artykułach
          </label>
          <div className="relative">
            <IconSearch size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
            <input
              id="szukaj"
              type="search"
              className="input pl-10"
              placeholder="Np. dokumenty, spółka, VAT"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-controls="wyniki"
            />
          </div>
        </div>
        <fieldset>
          <legend className="sr-only">Kategoria</legend>
          <div className="flex flex-wrap gap-2">
            {(["all", ...Object.keys(ARTICLE_CATEGORIES)] as (ArticleCategory | "all")[]).map((c) => (
              <label
                key={c}
                className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-line bg-white px-4 text-sm font-medium text-navy hover:border-line-strong has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-blue has-[:focus-visible]:outline-offset-2"
              >
                <input
                  type="radio"
                  name="kategoria"
                  className="sr-only"
                  checked={category === c}
                  onChange={() => setCategory(c)}
                />
                {c === "all" ? "Wszystkie" : ARTICLE_CATEGORIES[c]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-8 text-sm text-muted" role="status" aria-live="polite">
        {results.length === 0
          ? "Brak artykułów pasujących do wyszukiwania."
          : `Znaleziono ${results.length} ${results.length === 1 ? "artykuł" : results.length < 5 ? "artykuły" : "artykułów"}.`}
      </p>

      {results.length === 0 ? (
        <div className="mt-4 rounded-[var(--radius-panel)] border border-dashed border-line-strong p-8 text-center">
          <p className="text-ink">Spróbuj innego słowa lub wybierz wszystkie kategorie.</p>
          <button
            type="button"
            className="btn btn-outline btn-sm mt-4"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <ul id="wyniki" className="mt-4 divide-y divide-line border-y border-line">
          {results.map((a) => (
            <li key={a.slug}>
              <Link href={`/baza-wiedzy/${a.slug}`} className="group grid gap-2 py-7 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:gap-8">
                <span className="text-sm text-muted">
                  <span className="block font-medium text-blue-ink">{ARTICLE_CATEGORIES[a.category]}</span>
                  <span className="block">
                    {formatDate(a.publishedAt)}, {a.readingMinutes} min czytania
                  </span>
                </span>
                <span>
                  <span className="block font-serif text-2xl leading-snug text-navy group-hover:text-blue-ink">{a.title}</span>
                  <span className="mt-2 block max-w-2xl text-ink">{a.excerpt}</span>
                </span>
                <IconArrowRight size={20} className="hidden text-muted transition-transform group-hover:translate-x-1 group-hover:text-blue-ink md:block" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

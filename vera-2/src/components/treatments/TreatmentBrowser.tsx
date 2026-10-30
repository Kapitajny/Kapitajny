"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { categories, treatments, type CategorySlug } from "@/data/treatments";

type Filter = CategorySlug | "wszystkie";

/**
 * Lista zabiegów z filtrem obszarów. Filtr działa też z adresu (np. /zabiegi#kosmetologia),
 * a bez JavaScriptu widać pełną listę.
 */
export function TreatmentBrowser() {
  const [filter, setFilter] = useState<Filter>("wszystkie");

  useEffect(() => {
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (categories.some((c) => c.slug === hash)) setFilter(hash as CategorySlug);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const choose = (value: Filter) => {
    setFilter(value);
    history.replaceState(null, "", value === "wszystkie" ? window.location.pathname : `#${value}`);
  };

  const shown = filter === "wszystkie" ? treatments : treatments.filter((t) => t.category === filter);
  const category = categories.find((c) => c.slug === filter);

  return (
    <div>
      <div role="radiogroup" aria-label="Obszar" className="flex flex-wrap justify-center gap-2.5">
        {(["wszystkie", ...categories.map((c) => c.slug)] as Filter[]).map((value) => (
          <label key={value} className="chip">
            <input type="radio" name="obszar" value={value} checked={filter === value} onChange={() => choose(value)} />
            <span>{value === "wszystkie" ? "Wszystkie" : categories.find((c) => c.slug === value)!.name}</span>
          </label>
        ))}
      </div>

      <p id="area-intro" aria-live="polite" className="mx-auto mt-8 min-h-[3.4em] max-w-xl text-center font-light text-stone">
        {category ? category.intro : "Dziesięć zabiegów w czterech obszarach. Wybierz obszar, aby zawęzić listę."}
      </p>

      {categories.map((c) => (
        <span key={c.slug} id={c.slug} className="block scroll-mt-[calc(var(--header-h)+6rem)]" />
      ))}

      <ul className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-2">
        {shown.map((t) => (
          <li key={t.slug} data-category={t.category} className="rounded-[2.25rem] bg-white/70 p-3 sm:p-4">
            <Link href={`/zabiegi/${t.slug}`} className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <Photo image={t.image} sizes="112px" decorative className="oval aspect-[3/4] w-full" />
              <span className="pr-2">
                <span className="block text-xs text-rose-deep">{categories.find((c) => c.slug === t.category)!.name}</span>
                <span className="script mt-1 block text-2xl leading-tight group-hover:text-rose-deep sm:text-[1.75rem]">{t.name}</span>
                <span className="mt-2 line-clamp-2 block text-sm font-light text-stone">{t.lede}</span>
                <span className="mt-3 inline-block rounded-full bg-blush px-3 py-1 text-xs">{t.duration}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/ui/Icons";

/** Pole wyszukiwania strony /szukaj – zapytanie trafia do adresu (?q=), lista filtruje się sama. */
export function SearchHeader() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = params.get("q") ?? "";
  const [draft, setDraft] = useState({ source: current, text: current });
  const text = draft.source === current ? draft.text : current;

  return (
    <form
      role="search"
      className="mb-8 flex max-w-xl gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const next = new URLSearchParams(params.toString());
        if (text.trim()) next.set("q", text.trim());
        else next.delete("q");
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      }}
    >
      <label htmlFor="search-page-q" className="sr-only">
        Czego szukasz?
      </label>
      <input
        id="search-page-q"
        type="search"
        className="field"
        placeholder="np. czarne cargo, zip hoodie, dresy"
        maxLength={80}
        value={text}
        onChange={(e) => setDraft({ source: current, text: e.target.value })}
      />
      <button type="submit" className="btn btn-light shrink-0">
        <SearchIcon size={18} /> Szukaj
      </button>
    </form>
  );
}

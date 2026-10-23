"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { products } from "@/data/catalog";
import { imageSrc, matchesQuery } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { Modal } from "@/components/ui/Modal";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";

const SUGGESTIONS = ["hoodie", "zip", "cargo", "baggy", "dresy", "szeroka nogawka"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const titleId = useId();
  const trimmed = query.trim();
  const results = trimmed.length >= 2 ? products.filter((p) => matchesQuery(p, trimmed)) : [];

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="modal !mt-4 md:!mt-20 !mb-auto">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="display-sm text-lg">
            Szukaj
          </h2>
          <button type="button" className="icon-btn -mr-2" aria-label="Zamknij wyszukiwanie" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <form
          role="search"
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (trimmed) go(`/szukaj?q=${encodeURIComponent(trimmed)}`);
          }}
        >
          <label htmlFor="search-dialog-input" className="sr-only">
            Czego szukasz?
          </label>
          <input
            id="search-dialog-input"
            type="search"
            className="field"
            placeholder="np. czarne cargo, zip hoodie"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            maxLength={80}
            autoFocus
          />
          <button type="submit" className="btn btn-light shrink-0 !px-4" aria-label="Pokaż wyniki">
            <SearchIcon size={20} />
          </button>
        </form>

        {trimmed.length < 2 ? (
          <div className="mt-5">
            <p className="text-sm text-muted">Popularne wyszukiwania</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" className="border border-line px-3 py-1.5 text-sm hover:border-paper" onClick={() => go(`/szukaj?q=${encodeURIComponent(s)}`)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-5" aria-live="polite">
            {results.length === 0 ? (
              <p className="text-sm text-muted">Brak produktów dla „{trimmed}”. Spróbuj krótszej frazy, np. „bluza” albo „cargo”.</p>
            ) : (
              <>
                <ul className="divide-y divide-line">
                  {results.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      <Link href={`/produkt/${p.slug}`} onClick={onClose} className="flex items-center gap-4 py-3 hover:bg-surface">
                        <span className="studio relative block h-16 w-[3.2rem] shrink-0 overflow-hidden">
                          <Image src={imageSrc(p.variants[0].image)} alt="" fill sizes="52px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{p.name}</span>
                          <span className="block truncate text-sm text-muted">{p.kind}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatPrice(p.price, { compact: true })}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button type="button" className="btn btn-outline btn-block mt-4" onClick={() => go(`/szukaj?q=${encodeURIComponent(trimmed)}`)}>
                  Wszystkie wyniki ({results.length})
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

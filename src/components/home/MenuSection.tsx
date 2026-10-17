"use client";

import { useState } from "react";
import { CATEGORY_LABELS, MENU_FILTERS, PRODUCTS, type CategoryId } from "@/data/menu";
import { formatPrice, getProductGroups } from "@/lib/pricing";
import { CustomizeButton } from "@/components/cart/AddToCartButton";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "./SectionHeading";

const GROUP_HINTS: Record<string, string> = {
  size: "rozmiar",
  milk: "mleko",
  temperature: "temperatura",
  ice: "lód",
  beans: "ziarno",
  extras: "dodatki",
};

export function MenuSection() {
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const visible = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.categories.includes(filter));

  return (
    <section id="menu" aria-labelledby="menu-title" className="border-t border-line py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="menu-title" index="03" eyebrow="Menu" className="lg:col-span-6">
            Nasze menu
          </SectionHeading>
          <p className="text-muted lg:col-span-5 lg:col-start-8">
            Dziesięć kaw – od czystego espresso po słodkie latte. Wybierz napój, dopasuj rozmiar, mleko i dodatki, a cenę końcową zobaczysz od razu. Ceny w
            złotych, brutto.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div role="group" aria-label="Filtruj menu" className="flex flex-wrap gap-2">
            {MENU_FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`min-h-10 rounded-full border px-4 text-sm transition-colors ${
                    active ? "border-roast bg-roast text-paper" : "border-oat text-roast hover:border-espresso"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            {visible.length === PRODUCTS.length ? `Wszystkie ${PRODUCTS.length} kaw` : `Wyświetlono ${visible.length} z ${PRODUCTS.length}`}
          </p>
        </div>

        <ul className="grid gap-x-16 md:grid-cols-2">
          {visible.map((product) => {
            const groups = getProductGroups(product);
            const hasMilk = groups.some((g) => g.id === "milk");
            return (
              <li key={product.id} className="border-b border-line py-7 motion-safe:animate-[toast-in_420ms_var(--ease-soft)_both]">
                <article className="flex gap-5 sm:gap-6">
                  <div className="relative aspect-[4/5] w-24 shrink-0 self-start overflow-hidden rounded-xl sm:w-28">
                    <Photo image={product.image} sizes="112px" placeholderLabel="" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-2xl sm:text-[1.7rem]">{product.name}</h3>
                      <span aria-hidden="true" className="mb-1.5 min-w-6 flex-1 border-b border-dotted border-oat" />
                      <p className="font-serif text-xl text-roast tabular-nums sm:text-2xl">{formatPrice(product.basePrice, { compact: true })}</p>
                    </div>
                    <p className="mt-1.5 leading-relaxed text-muted">{product.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-latte">
                      {product.categories.map((c) => CATEGORY_LABELS[c]).join(" · ")}
                      {hasMilk && <span className="normal-case tracking-normal text-muted"> · mleko owsiane +3 zł, bez laktozy +2 zł</span>}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <CustomizeButton productId={product.id} label="Wybierz i dodaj" />
                      <span className="text-xs text-muted">Do wyboru: {groups.map((g) => GROUP_HINTS[g.id]).join(", ")}</span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

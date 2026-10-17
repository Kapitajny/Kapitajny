"use client";

import { useState } from "react";
import { CATEGORY_LABELS, getProduct, type Product } from "@/data/menu";
import { formatPrice, getDefaultSelection, getProductGroups, priceLine, type OptionSelection, type ResolvedGroup } from "@/lib/pricing";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Photo } from "@/components/ui/Photo";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

/** Okno personalizacji napoju – opcje zgodne z konfiguracją konkretnego produktu w `data/menu.ts`. */
export function ProductCustomizer() {
  const { customizingProductId, closeCustomizer } = useCart();
  // Ostatnio otwarty produkt zostaje w oknie podczas animacji zamykania; każde otwarcie zaczyna od ustawień domyślnych.
  const [session, setSession] = useState<{ id: string | null; seq: number }>({ id: null, seq: 0 });
  const [prevOpenId, setPrevOpenId] = useState<string | null>(null);
  if (customizingProductId !== prevOpenId) {
    setPrevOpenId(customizingProductId);
    if (customizingProductId) setSession((s) => ({ id: customizingProductId, seq: s.seq + 1 }));
  }

  const product = session.id ? getProduct(session.id) : undefined;

  return (
    <Modal open={customizingProductId !== null} onClose={closeCustomizer} labelledBy="customizer-title" className="sheet-center">
      {product && <CustomizerBody key={`${product.id}-${session.seq}`} product={product} />}
    </Modal>
  );
}

function CustomizerBody({ product }: { product: Product }) {
  const { addItem, closeCustomizer } = useCart();
  const groups = getProductGroups(product);
  const [selection, setSelection] = useState<OptionSelection>(() => getDefaultSelection(product));
  const [quantity, setQuantity] = useState(1);
  const priced = priceLine({ productId: product.id, options: selection, quantity });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (addItem(product.id, selection, quantity)) closeCustomizer();
  };

  return (
    <form
      onSubmit={submit}
      className="grid h-full max-h-[inherit] grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:grid-rows-[1fr_auto]"
    >
      <div className="relative aspect-[16/9] overflow-hidden md:row-span-2 md:aspect-auto md:h-full">
        <Photo image={product.image} sizes="(min-width: 768px) 420px, 100vw" placeholderLabel={product.name} />
        <button
          type="button"
          onClick={closeCustomizer}
          className="absolute right-3 top-3 rounded-full bg-paper/90 p-2 text-roast shadow-sm backdrop-blur-sm transition-colors hover:bg-paper md:hidden"
          aria-label="Zamknij"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="overflow-y-auto px-6 pb-6 pt-6 md:px-8 md:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{product.categories.map((c) => CATEGORY_LABELS[c]).join(" · ")}</p>
            <h2 id="customizer-title" className="mt-2 text-4xl">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCustomizer}
            className="-mr-2 hidden rounded-full p-2 transition-colors hover:bg-sand md:inline-flex"
            aria-label="Zamknij"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="mt-3 text-muted">{product.description}</p>
        <p className="mt-1 text-sm text-muted">Cena bazowa: {formatPrice(product.basePrice)}</p>

        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <OptionGroupField
              key={group.id}
              productId={product.id}
              group={group}
              value={selection[group.id]}
              onChange={(value) => setSelection((s) => ({ ...s, [group.id]: value }))}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line bg-paper px-6 py-4 md:px-8">
        <QuantityStepper value={quantity} onChange={setQuantity} label="Ilość" />
        <button type="submit" className="btn btn-primary flex-1" disabled={!priced.ok}>
          <span>
            Dodaj<span className="hidden sm:inline"> do zamówienia</span>
          </span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span className="tabular-nums">{priced.ok ? formatPrice(priced.line.lineTotal) : "—"}</span>
        </button>
      </div>
    </form>
  );
}

function OptionGroupField({
  productId,
  group,
  value,
  onChange,
}: {
  productId: string;
  group: ResolvedGroup;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}) {
  const name = `${productId}-${group.id}`;
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const limitReached = group.type === "multiple" && group.maxSelected !== undefined && selected.length >= group.maxSelected;

  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-medium text-roast">
        <span>{group.label}</span>
        {group.type === "multiple" && <span className="text-xs font-normal text-muted">opcjonalnie, maks. {group.maxSelected}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {group.choices.map((choice) => {
          const checked = selected.includes(choice.id);
          const disabled = !checked && limitReached;
          const inputId = `${name}-${choice.id}`;
          return (
            <label
              key={choice.id}
              htmlFor={inputId}
              className={`relative inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-espresso ${
                checked ? "border-roast bg-roast text-paper" : "border-oat bg-paper text-roast hover:border-espresso"
              } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
            >
              <input
                id={inputId}
                type={group.type === "single" ? "radio" : "checkbox"}
                name={name}
                value={choice.id}
                checked={checked}
                disabled={disabled}
                className="sr-only"
                onChange={() => {
                  if (group.type === "single") onChange(choice.id);
                  else onChange(checked ? selected.filter((id) => id !== choice.id) : [...selected, choice.id]);
                }}
              />
              {group.type === "multiple" && checked && <CheckIcon size={14} />}
              <span>{choice.label}</span>
              {choice.priceDelta > 0 && <span className={checked ? "text-paper/70" : "text-muted"}>+{formatPrice(choice.priceDelta, { compact: true })}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

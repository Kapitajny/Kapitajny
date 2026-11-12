"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cartDrawer, useCartLines } from "@/components/cart/cart-store";
import { BasketIcon } from "@/components/ui/Icons";
import { capacities, flavorOrder, flavors, isFlavorId, products, type Capacity, type FlavorId } from "@/data/products";
import { formatAmount, plural } from "@/lib/money";
import { countItems, subtotal } from "@/lib/order";
import { ProductCard } from "./ProductCard";
import styles from "./shop.module.css";

const sorts = [
  { id: "polecane", label: "Polecane" },
  { id: "cena-rosnaco", label: "Cena: od najniższej" },
  { id: "cena-malejaco", label: "Cena: od najwyższej" },
  { id: "nazwa", label: "Nazwa: A–Z" },
] as const;
type SortId = (typeof sorts)[number]["id"];

function parseCapacity(value: string | null): Capacity | null {
  return value === "3" ? 3 : value === "5" ? 5 : null;
}

export function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const lines = useCartLines();

  const rawFlavor = params.get("smak");
  const flavor: FlavorId | null = isFlavorId(rawFlavor) ? rawFlavor : null;
  const capacity = parseCapacity(params.get("pojemnosc"));
  const rawSort = params.get("sortuj");
  const sort: SortId = sorts.some((item) => item.id === rawSort) ? (rawSort as SortId) : "polecane";

  // Filtry żyją w adresie strony: można je udostępnić, a przycisk „wstecz” działa zgodnie z oczekiwaniem.
  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const visible = products
    .filter((product) => (flavor ? product.flavor === flavor : true))
    .filter((product) => (capacity ? product.capacity === capacity : true))
    .sort((a, b) => {
      if (sort === "cena-rosnaco") return a.price - b.price || a.order - b.order;
      if (sort === "cena-malejaco") return b.price - a.price || a.order - b.order;
      if (sort === "nazwa") return a.name.localeCompare(b.name, "pl") || b.capacity - a.capacity;
      return a.order - b.order;
    });

  const count = countItems(lines);
  const filtered = Boolean(flavor || capacity);

  return (
    <div className={styles.browser}>
      <div className={styles.toolbar}>
        <fieldset className={styles.filter}>
          <legend>Smak</legend>
          <div className={styles.options}>
            <label className={styles.option}>
              <input type="radio" name="smak" checked={!flavor} onChange={() => update("smak", null)} />
              <span>Wszystkie</span>
            </label>
            {flavorOrder.map((id) => (
              <label key={id} className={styles.option}>
                <input type="radio" name="smak" checked={flavor === id} onChange={() => update("smak", id)} />
                <span>{flavors[id].label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.filter}>
          <legend>Pojemność</legend>
          <div className={styles.options}>
            <label className={styles.option}>
              <input type="radio" name="pojemnosc" checked={!capacity} onChange={() => update("pojemnosc", null)} />
              <span>Wszystkie</span>
            </label>
            {capacities.map((value) => (
              <label key={value} className={styles.option}>
                <input
                  type="radio"
                  name="pojemnosc"
                  checked={capacity === value}
                  onChange={() => update("pojemnosc", String(value))}
                />
                <span>{value} l</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.sort}>
          <label htmlFor="shop-sort">Sortowanie</label>
          <select
            id="shop-sort"
            className="select"
            value={sort}
            onChange={(event) => update("sortuj", event.target.value === "polecane" ? null : event.target.value)}
          >
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.status}>
        <p aria-live="polite">
          {visible.length} {plural(visible.length, "produkt", "produkty", "produktów")}
          {filtered ? (
            <>
              {" "}
              <button
                type="button"
                className={styles.clear}
                onClick={() => {
                  const next = new URLSearchParams(params.toString());
                  next.delete("smak");
                  next.delete("pojemnosc");
                  const query = next.toString();
                  router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
                }}
              >
                Wyczyść filtry
              </button>
            </>
          ) : null}
        </p>
        <button type="button" className={styles.cartButton} onClick={cartDrawer.open} aria-haspopup="dialog">
          <BasketIcon width={20} height={20} />
          <span>
            {count === 0
              ? "Koszyk jest pusty"
              : `Koszyk: ${count} ${plural(count, "opakowanie", "opakowania", "opakowań")}, ${formatAmount(subtotal(lines))}`}
          </span>
        </button>
      </div>

      {visible.length > 0 ? (
        <ul className={styles.grid}>
          {visible.map((product, index) => (
            <li key={product.slug}>
              <ProductCard product={product} eager={index < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>Żaden sok nie pasuje do wybranych filtrów.</p>
          <button type="button" className="btn btn--outline" onClick={() => router.replace(pathname, { scroll: false })}>
            Pokaż wszystkie soki
          </button>
        </div>
      )}
    </div>
  );
}

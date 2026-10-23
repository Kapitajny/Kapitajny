"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { COLORS, FITS, SIZE_CHARTS, SIZES, type Product, type Size } from "@/data/catalog";
import { DISPATCH_TIME, RETURN_DAYS, SHIPPING_METHODS } from "@/data/shipping";
import { catalogStock, colorName, detailSrc, getCategory, imageSrc } from "@/lib/catalog";
import { formatPrice, ORDER_LIMITS } from "@/lib/pricing";
import { useShop } from "@/components/shop/ShopProvider";
import { useLiveStock } from "@/components/shop/useLiveStock";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { Modal } from "@/components/ui/Modal";
import { CloseIcon, HeartIcon, RulerIcon, TruckIcon } from "@/components/ui/Icons";

/** Wariant z parametru ?kolor= (czytany po stronie przeglądarki, strona produktu pozostaje statyczna). */
export function ProductViewWithParams({ product }: { product: Product }) {
  const params = useSearchParams();
  return <ProductView product={product} initialColor={params.get("kolor") ?? undefined} />;
}

export function ProductView({ product, initialColor }: { product: Product; initialColor?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const startColor = product.variants.find((v) => v.color === initialColor)?.color ?? product.variants[0].color;
  const [selected, setSelected] = useState<{ color: string; size: Size | null }>({ color: startColor, size: null });
  const color = selected.color;
  const variant = product.variants.find((v) => v.color === color) ?? product.variants[0];

  const selectColor = (next: string) => {
    setSelected((s) => ({ ...s, color: next }));
    router.replace(next === product.variants[0].color ? pathname : `${pathname}?kolor=${next}`, { scroll: false });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <Gallery key={variant.color} product={product} image={variant.image} colorLabel={colorName(variant.color)} />
      <div className="lg:col-span-5 xl:col-span-4 xl:col-start-9">
        <div className="lg:sticky lg:top-28">
          <BuyBox product={product} color={variant.color} size={selected.size} onColor={selectColor} onSize={(size) => setSelected((s) => ({ ...s, size }))} />
        </div>
      </div>
    </div>
  );
}

function Gallery({ product, image, colorLabel }: { product: Product; image: string; colorLabel: string }) {
  const images = [
    { src: imageSrc(image), alt: `${product.name} w kolorze ${colorLabel.toLowerCase()} – cały produkt na jasnym tle` },
    { src: detailSrc(image), alt: `${product.name} w kolorze ${colorLabel.toLowerCase()} – zbliżenie na dzianinę i wykończenie` },
  ];
  const [active, setActive] = useState(0);

  return (
    <div className="lg:col-span-7">
      {/* Mobile: przewijana galeria, desktop: zdjęcia jedno pod drugim w dwóch kolumnach. */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto md:mx-0 md:grid md:grid-cols-2 md:gap-2 md:overflow-visible" aria-label="Zdjęcia produktu" role="region" tabIndex={0}>
        {images.map((img, i) => (
          <figure key={img.src} className="studio relative aspect-[4/5] w-[86vw] shrink-0 snap-start md:w-auto" onPointerEnter={() => setActive(i)}>
            <Image src={img.src} alt={img.alt} fill preload={i === 0} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 86vw" className="object-cover" />
          </figure>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Zdjęcie {active + 1} z {images.length}
      </p>
      <p className="mt-3 text-xs text-muted">Zdjęcia poglądowe produktu na tle studyjnym; odcień na ekranie może się nieznacznie różnić od rzeczywistego.</p>
    </div>
  );
}

function BuyBox({
  product,
  color,
  size,
  onColor,
  onSize,
}: {
  product: Product;
  color: string;
  size: Size | null;
  onColor: (color: string) => void;
  onSize: (size: Size) => void;
}) {
  const { addToCart, setCartOpen, notify, isFavorite, toggleFavorite, hydrated, lines } = useShop();
  const { availability, error: stockError } = useLiveStock(product.id);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const ids = useId();
  const category = getCategory(product.category)!;

  const stockOf = (s: Size) => availability?.[color]?.[s] ?? catalogStock(product, color, s);
  const inCart = (s: Size) => lines.find((l) => l.productId === product.id && l.color === color && l.size === s)?.quantity ?? 0;
  const sizeStock = size ? stockOf(size) : null;
  const remaining = size ? Math.max(0, Math.min(ORDER_LIMITS.maxQuantityPerLine, stockOf(size)) - inCart(size)) : ORDER_LIMITS.maxQuantityPerLine;
  const colorAvailable = SIZES.some((s) => stockOf(s) > 0);
  const favorite = hydrated && isFavorite(product.id);
  const qty = Math.max(1, Math.min(quantity, Math.max(1, remaining)));

  const add = () => {
    if (!size) {
      setSizeError("Wybierz rozmiar.");
      document.getElementById(`${ids}-sizes`)?.focus();
      return;
    }
    if (stockOf(size) <= 0) {
      setSizeError("Ten rozmiar jest niedostępny. Wybierz inny.");
      return;
    }
    if (remaining <= 0) {
      setSizeError(`Masz już w koszyku całą dostępną ilość tego rozmiaru (${inCart(size)} szt.).`);
      return;
    }
    const result = addToCart({ productId: product.id, color, size, quantity: qty });
    if (result === "limit") {
      notify(`Osiągnięto limit sztuk w jednym zamówieniu.`);
      return;
    }
    setQuantity(1);
    setCartOpen(true);
  };

  return (
    <div>
      <nav aria-label="Ścieżka" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-x-2">
          <li>
            <Link href={`/kategoria/${category.slug}`} className="hover:text-paper">
              {category.name}
            </Link>
          </li>
          {product.styles.slice(0, 1).map((s) => (
            <li key={s} className="before:mr-2 before:content-['/']">
              <Link href={`/kategoria/${category.slug}/${s}`} className="hover:text-paper">
                {category.subcategories.find((sub) => sub.slug === s)?.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="display mt-4 text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)]">{product.name}</h1>
      <p className="mt-3 text-muted">{product.kind}</p>
      <p className="mt-5 text-2xl font-bold tabular-nums">
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <s className="mr-3 text-lg font-normal text-muted">{formatPrice(product.compareAtPrice)}</s>
        )}
        {formatPrice(product.price)}
      </p>
      <p className="mt-1 text-xs text-muted">Cena brutto z VAT. Koszt dostawy od {formatPrice(Math.min(...SHIPPING_METHODS.map((m) => m.price)))}.</p>

      {/* Kolor */}
      <fieldset className="mt-8">
        <legend className="text-sm">
          <span className="font-bold">Kolor:</span> {colorName(color as keyof typeof COLORS)}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.color}
              type="button"
              onClick={() => onColor(v.color)}
              aria-pressed={v.color === color}
              className="group/sw flex items-center gap-2 border border-line py-1.5 pl-1.5 pr-3 text-sm hover:border-paper aria-pressed:border-paper"
            >
              <span className="studio relative block h-12 w-10 overflow-hidden">
                <Image src={imageSrc(v.image)} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border border-white/25" style={{ background: COLORS[v.color].hex }} />
                {colorName(v.color)}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Rozmiar */}
      <fieldset className="mt-7" aria-describedby={sizeError ? `${ids}-size-error` : undefined}>
        <div className="flex items-baseline justify-between">
          <legend className="text-sm font-bold">Rozmiar</legend>
          <button type="button" className="flex items-center gap-1.5 text-sm underline underline-offset-2 hover:text-paper" onClick={() => setChartOpen(true)} aria-haspopup="dialog">
            <RulerIcon size={16} /> Tabela rozmiarów
          </button>
        </div>
        <div id={`${ids}-sizes`} tabIndex={-1} className="mt-3 grid grid-cols-6 gap-1.5 focus:outline-none" role="group" aria-label="Rozmiar">
          {SIZES.map((s) => {
            const left = stockOf(s);
            const unavailable = left <= 0;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                aria-disabled={unavailable}
                aria-label={unavailable ? `${s} – niedostępny` : left <= 3 ? `${s} – zostały ${left} szt.` : s}
                onClick={() => {
                  if (unavailable) {
                    setSizeError(`Rozmiar ${s} w tym kolorze jest niedostępny.`);
                    return;
                  }
                  setSizeError(null);
                  onSize(s);
                }}
                className={`relative h-12 border text-sm font-semibold transition-colors ${
                  unavailable
                    ? "cursor-not-allowed border-line text-[#5c5c5c] line-through"
                    : "border-line hover:border-paper aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p className="mt-2 min-h-5 text-sm" aria-live="polite">
          {sizeError ? (
            <span id={`${ids}-size-error`} className="text-danger">
              {sizeError}
            </span>
          ) : size && sizeStock === 0 ? (
            <span className="text-danger">Rozmiar {size} jest niedostępny w tym kolorze. Wybierz inny rozmiar.</span>
          ) : size && sizeStock !== null ? (
            <span className="text-muted">{sizeStock <= 3 ? `Dostępne: ${sizeStock} szt. w tym rozmiarze.` : "Dostępny od ręki."}</span>
          ) : !colorAvailable ? (
            <span className="text-danger">Ten kolor jest obecnie wyprzedany.</span>
          ) : (
            <span className="text-muted">{FITS[product.fit].description}</span>
          )}
        </p>
        {stockError && <p className="text-xs text-muted">Nie udało się pobrać aktualnych stanów – dostępność sprawdzimy ponownie przy składaniu zamówienia.</p>}
      </fieldset>

      <div className="mt-6 flex gap-2">
        <QuantityStepper value={qty} max={Math.max(1, remaining)} onChange={setQuantity} label="Ilość" />
        <button type="button" className="btn btn-light flex-1" onClick={add} disabled={!colorAvailable}>
          {colorAvailable ? "Dodaj do koszyka" : "Wyprzedane"}
        </button>
        <button
          type="button"
          className="grid h-12 w-12 shrink-0 place-items-center border border-line hover:border-paper"
          aria-pressed={favorite}
          aria-label={favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          onClick={() => toggleFavorite(product.id, product.name)}
        >
          <HeartIcon filled={favorite} />
        </button>
      </div>

      <p className="mt-5 flex gap-3 text-sm text-muted">
        <TruckIcon size={20} className="shrink-0" />
        <span>
          Wysyłka {DISPATCH_TIME}. {RETURN_DAYS} dni na odstąpienie od umowy bez podania przyczyny.{" "}
          <Link href="/dostawa-i-zwroty" className="link text-paper">
            Dostawa i zwroty
          </Link>
        </span>
      </p>

      <div className="mt-8 divide-y divide-line border-y border-line">
        <Section title="Opis" open>
          <p>{product.description}</p>
          <ul className="mt-3 list-[square] space-y-1 pl-5">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Section>
        <Section title="Materiał i pielęgnacja">
          <p>
            <span className="font-semibold text-paper">Skład:</span> {product.material}
          </p>
          <p className="mt-2">{product.care}</p>
        </Section>
        <Section title="Krój">
          <p>
            <span className="font-semibold text-paper">{FITS[product.fit].name}.</span> {FITS[product.fit].description}
          </p>
          <button type="button" className="link mt-2 text-paper" onClick={() => setChartOpen(true)}>
            Zobacz wymiary w cm
          </button>
        </Section>
        <Section title="Dostawa i zwroty">
          <ul className="space-y-1">
            {SHIPPING_METHODS.map((m) => (
              <li key={m.id}>
                {m.name}: {formatPrice(m.price)} – {m.description.toLowerCase()}
              </li>
            ))}
          </ul>
          <p className="mt-2">
            Masz {RETURN_DAYS} dni od otrzymania paczki na odstąpienie od umowy. Szczegóły w{" "}
            <Link href="/dostawa-i-zwroty" className="link text-paper">
              zasadach dostawy i zwrotów
            </Link>
            .
          </p>
        </Section>
      </div>

      <Modal open={chartOpen} onClose={() => setChartOpen(false)} labelledBy={`${ids}-chart`} className="modal">
        <div className="p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <h2 id={`${ids}-chart`} className="display-sm text-xl">
              Tabela rozmiarów – {product.name}
            </h2>
            <button type="button" className="icon-btn -mr-2 -mt-2 shrink-0" aria-label="Zamknij tabelę rozmiarów" onClick={() => setChartOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <SizeChartTable product={product} />
        </div>
      </Modal>
    </div>
  );
}

function Section({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details className="group/sec" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-bold [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden="true" className="text-xl leading-none text-muted transition-transform group-open/sec:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export function SizeChartTable({ product }: { product: Product }) {
  const chart = SIZE_CHARTS[product.fit];
  return (
    <div>
      <p className="mt-2 text-sm text-muted">
        Krój: {FITS[product.fit].name}. <strong className="font-semibold text-paper">Wymiary przykładowe</strong> – przed startem sprzedaży zastąp je pomiarami
        rzeczywistych sztuk. Tolerancja ±2 cm.
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-sm tabular-nums">
          <caption className="sr-only">Wymiary w centymetrach dla rozmiarów XS–XXL</caption>
          <thead>
            <tr className="border-b border-line text-left">
              <th scope="col" className="py-2 pr-4 font-bold">
                Rozmiar
              </th>
              {chart.columns.map((c) => (
                <th key={c} scope="col" className="py-2 pr-4 font-bold">
                  {c} (cm)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row.size} className="border-b border-line">
                <th scope="row" className="py-2.5 pr-4 text-left font-bold">
                  {row.size}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className="py-2.5 pr-4 text-muted">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">{chart.note}</p>
    </div>
  );
}

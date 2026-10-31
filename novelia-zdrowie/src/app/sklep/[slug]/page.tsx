import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, MAIN_PRODUCT_SLUG, products } from "@/data/products";
import { formatAmount, formatPrice } from "@/lib/format";
import { JsonLd, productJsonLd } from "@/lib/jsonld";
import { isProductAvailable } from "@/lib/server/files";
import { AddToCartButton, BuyNowButton } from "@/components/cart/BuyButtons";
import { Cover } from "@/components/product/Cover";
import { PreviewGallery } from "@/components/product/PreviewGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeftIcon, CheckIcon, DownloadIcon, FileIcon, LeafIcon, LockIcon } from "@/components/ui/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/sklep/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.title} – ${product.subtitle}`,
    description: `${product.short} E-book PDF, ${formatPrice(product.price)}.`,
    alternates: { canonical: `/sklep/${product.slug}` },
    openGraph: {
      title: `${product.title} – e-book NOVELIA ZDROWIE`,
      description: product.short,
      images: [{ url: product.cover.src, width: product.cover.width, height: product.cover.height, alt: product.cover.alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/sklep/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const available = isProductAvailable(product);
  const others = products.filter((p) => p.slug !== product.slug);
  const isMain = product.slug === MAIN_PRODUCT_SLUG;

  return (
    <>
      <JsonLd data={productJsonLd(product, available)} />
      <section className="bg-cream">
        <div className="container-x pb-16 pt-8 lg:pb-24 lg:pt-10">
          <nav aria-label="Ścieżka" className="text-sm text-muted">
            <Link href="/sklep" className="inline-flex min-h-11 items-center gap-2 hover:text-forest">
              <ArrowLeftIcon size={16} /> Sklep
            </Link>
          </nav>
          <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[24rem] bg-beige/70 px-[12%] py-[11%]">
                <Cover product={product} sizes="(min-width: 1024px) 20rem, 70vw" priority />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow">E-book NOVELIA ZDROWIE</p>
              <h1 className="mt-4 text-[clamp(2.4rem,1.6rem+3vw,4rem)]">{product.title}</h1>
              <p className="mt-3 font-serif text-xl italic text-muted">{product.subtitle}</p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed">{product.short}</p>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {product.format.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.98rem]">
                    <FileIcon size={18} className="mt-1 shrink-0 text-olive" /> {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-y border-line py-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm text-muted">{available ? "Cena" : "Planowana cena"}</p>
                    <p className="font-serif text-5xl leading-none text-forest">
                      {formatAmount(product.price)} <span className="text-2xl">zł</span>
                    </p>
                    <p className="mt-2 text-xs text-muted">Cena brutto · produkt cyfrowy, bez kosztów dostawy</p>
                  </div>
                  {available ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <BuyNowButton slug={product.slug} label="Kup teraz" className="btn btn-primary px-10" />
                      <AddToCartButton slug={product.slug} className="btn btn-outline" />
                    </div>
                  ) : (
                    <p className="max-w-xs bg-paper p-4 text-sm leading-relaxed text-forest ring-1 ring-line">{product.comingSoonNote}</p>
                  )}
                </div>
              </div>
              {available && (
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                  <li className="inline-flex items-center gap-2">
                    <DownloadIcon size={18} className="text-olive" /> Link do pobrania po potwierdzeniu płatności
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <LockIcon size={18} className="text-olive" /> Bezpieczna płatność online
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-14 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-4xl">Opis publikacji</h2>
          <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed">
            {product.description.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>
          <h3 className="mt-12 text-2xl">{available ? "Co zyskujesz" : "Co znajdzie się w publikacji"}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex gap-3">
                <CheckIcon size={20} className="mt-1 shrink-0 text-olive" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-12 bg-forest p-7 text-cream sm:p-9">
            <h3 className="text-2xl !text-cream">Dla kogo?</h3>
            <ul className="mt-4 space-y-3">
              {product.audience.map((a) => (
                <li key={a} className="flex gap-3 text-cream/90">
                  <LeafIcon size={18} className="mt-1 shrink-0 text-gold-soft" /> Dla Ciebie, jeśli {a}.
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <h2 className="text-3xl sm:text-4xl">Spis treści</h2>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {product.toc.map((t, i) => (
              <li key={t.title} className="flex gap-4 py-4">
                <span className="w-7 shrink-0 font-serif text-lg text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-serif text-lg leading-snug text-forest">{t.title}</span>
                  {t.detail && <span className="mt-0.5 block text-sm text-muted">{t.detail}</span>}
                </span>
                {t.page && <span className="shrink-0 text-sm text-muted">s. {t.page}</span>}
              </li>
            ))}
          </ol>
          {!isMain && <p className="mt-4 text-sm text-muted">Spis treści i zakres publikacji mogą zostać doprecyzowane przed premierą.</p>}
        </aside>
      </section>

      <section className="bg-beige/50 py-16 lg:py-24">
        <div className="container-x">
          <h2 className="text-3xl sm:text-4xl">{isMain ? "Przykładowe strony" : "Fragment publikacji"}</h2>
          <p className="mt-3 max-w-2xl text-muted">
            {isMain ? "Zobacz, jak wyglądają rozdziały i przepisy w e-booku. Kliknij stronę, aby ją powiększyć." : "Przykładowe strony przygotowywanej publikacji. Kliknij stronę, aby ją powiększyć."}
          </p>
          <div className="mt-8 max-w-5xl">
            <PreviewGallery pages={product.previews} title={product.title} />
          </div>
          {available && (
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <BuyNowButton slug={product.slug} label={`Kup e-book za ${formatPrice(product.price)}`} className="btn btn-primary" />
              <span className="text-sm text-muted">PDF · pobranie po potwierdzeniu płatności</span>
            </div>
          )}
        </div>
      </section>

      <section className="container-x py-16 lg:py-24">
        <h2 className="text-3xl sm:text-4xl">Pozostałe publikacje</h2>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <ProductCard key={p.slug} product={p} available={isProductAvailable(p)} />
          ))}
        </div>
      </section>
    </>
  );
}

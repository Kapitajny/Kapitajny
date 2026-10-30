import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { categories, treatmentsIn, type CategorySlug } from "@/data/treatments";

/** Each category gets its own frame in an asymmetric spread, like a magazine layout. */
const layout: Record<CategorySlug, { frame: string; photo: string; sizes: string }> = {
  "aesthetic-medicine": { frame: "lg:col-span-5", photo: "aspect-[4/5]", sizes: "(min-width: 1024px) 38vw, 100vw" },
  "skin-treatments": { frame: "lg:col-span-5 lg:col-start-8 lg:mt-48", photo: "aspect-[5/4]", sizes: "(min-width: 1024px) 38vw, 100vw" },
  "professional-cosmetology": { frame: "lg:col-span-4 lg:col-start-2 lg:-mt-10", photo: "aspect-square", sizes: "(min-width: 1024px) 30vw, 100vw" },
  "skin-consultation": { frame: "lg:col-span-6 lg:col-start-7 lg:mt-24", photo: "aspect-[5/4]", sizes: "(min-width: 1024px) 46vw, 100vw" },
};

export function SelectedTreatments() {
  return (
    <section aria-labelledby="treatments-title" className="bg-black py-24 text-ivory sm:py-32 lg:py-40">
      <div className="shell">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="treatments-title" className="display text-[clamp(3rem,8vw,7rem)]">
            Selected
            <br />
            <span className="pl-[0.9em]">treatments</span>
          </h2>
          <Link href="/treatments" className="btn btn-outline-light self-start sm:self-auto">
            All treatments
          </Link>
        </div>

        <div className="mt-16 grid gap-16 sm:grid-cols-2 sm:gap-x-8 lg:mt-24 lg:grid-cols-12 lg:gap-y-0">
          {categories.map((category) => {
            const l = layout[category.slug];
            const items = treatmentsIn(category.slug);
            return (
              <article key={category.slug} className={l.frame}>
                <Link href={`/treatments#${category.slug}`} className="group block" aria-describedby={`${category.slug}-summary`}>
                  <div className="overflow-hidden">
                    <Photo
                      image={category.image}
                      sizes={l.sizes}
                      decorative
                      className={l.photo}
                      imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">
                    <span className="link-line bg-[length:0%_1px] group-hover:bg-[length:100%_1px]">{category.name}</span>
                  </h3>
                </Link>
                <p id={`${category.slug}-summary`} className="mt-3 max-w-sm text-sm text-ivory/75">
                  {category.summary}
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {items.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/treatments/${t.slug}`} className="text-rose-light hover:text-ivory">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

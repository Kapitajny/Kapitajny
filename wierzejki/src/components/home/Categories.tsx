import Link from "next/link";
import { getCategory, groupsOf, type CategoryId } from "@/content/products";
import { Photo } from "@/components/ui/Photo";

function CategoryTile({ id, feature }: { id: CategoryId; feature?: boolean }) {
  const category = getCategory(id);
  const groups = groupsOf(id);
  return (
    <article className={`group relative flex flex-col ${feature ? "lg:row-span-2" : "sm:flex-row lg:flex-col xl:flex-row"}`}>
      <div
        className={`relative overflow-hidden bg-linen ${
          feature ? "aspect-[4/5] lg:aspect-auto lg:min-h-[34rem] lg:flex-1" : "aspect-[4/3] sm:w-1/2 sm:shrink-0 lg:w-full xl:w-[46%]"
        }`}
      >
        <Photo media={category.media} sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1280px) 22vw, (min-width: 640px) 50vw, 100vw"} />
      </div>
      <div className={`flex flex-col pt-5 ${feature ? "" : "sm:pl-6 sm:pt-1 lg:pl-0 lg:pt-5 xl:pl-6 xl:pt-1"}`}>
        <h3 className={feature ? "display-lg" : "display-md"}>
          <Link href={`/produkty/${category.slug}`} className="after:absolute after:inset-0 group-hover:text-red">
            {category.name}
          </Link>
        </h3>
        <p className="mt-3 max-w-[30rem] text-ink/85">{category.summary}</p>
        <p className="ui mt-4 text-[0.875rem] text-muted">{groups.map((g) => g.name).join(", ")}</p>
        <span className="ui mt-5 text-[0.9375rem] font-semibold text-red underline decoration-1 underline-offset-4">Zobacz: {category.name.toLowerCase()}</span>
      </div>
    </article>
  );
}

export function Categories() {
  return (
    <section aria-labelledby="produkty-title" className="bg-surface py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="produkty-title" className="display-lg max-w-[40rem]">
            Mięso, wędliny i garmażerka z&nbsp;jednego zakładu
          </h2>
          <p className="max-w-[26rem] text-muted md:text-right">
            Oferta podzielona tak jak katalogi firmy: mięso z rozbioru, wędliny z przetwórni i wyroby garmażeryjne.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-10 lg:gap-y-12">
          <CategoryTile id="wedliny" feature />
          <CategoryTile id="mieso" />
          <CategoryTile id="garmaz" />
        </div>
      </div>
    </section>
  );
}

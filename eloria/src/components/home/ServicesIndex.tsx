import Link from "next/link";
import type { ImageKey } from "@/config/images";
import { Photo } from "@/components/ui/Photo";
import { categories, servicesIn, type CategorySlug } from "@/data/services";

const categoryImage: Record<CategorySlug, ImageKey> = {
  "medycyna-estetyczna": "svcFace",
  kosmetologia: "svcCare",
  "terapie-skory": "svcProblemSkin",
};

export function ServicesIndex() {
  return (
    <section aria-labelledby="zabiegi" className="bg-white/55">
      <div className="frame py-24 lg:py-32">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="zabiegi" className="text-[clamp(2.75rem,6vw,4.5rem)] md:col-span-6">
            Zabiegi
          </h2>
          <p className="max-w-md text-taupe md:col-span-5 md:col-start-8">
            Trzy obszary, jedna zasada: o zabiegu decydujemy po konsultacji. Wybierz temat, który Cię interesuje, albo zacznij od rozmowy z nami.
          </p>
        </div>

        <ul className="mt-16 border-t border-espresso/25">
          {categories.map((category) => (
            <li key={category.slug} className="grid gap-8 border-b border-line py-10 md:grid-cols-12 md:gap-x-8 lg:py-14">
              <div className="flex gap-6 md:col-span-5">
                <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-blush sm:w-32">
                  <Photo image={categoryImage[category.slug]} sizes="128px" hideCaption />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-[2.5rem]">
                    <Link href={`/zabiegi#${category.slug}`} className="hover:text-champagne-deep">
                      {category.name}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-xs text-sm text-taupe">Wykonuje: {category.performedBy}</p>
                </div>
              </div>
              <ul className="md:col-span-7">
                {servicesIn(category.slug).map((service) => (
                  <li key={service.slug} className="border-t border-line first:border-t-0">
                    <Link href={`/zabiegi/${service.slug}`} className="group grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6 first:pt-0">
                      <span className="font-serif text-xl text-espresso group-hover:underline group-hover:decoration-champagne group-hover:decoration-1 group-hover:underline-offset-4">
                        {service.name}
                      </span>
                      <span className="text-sm text-taupe sm:max-w-[16rem] sm:text-right">{service.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

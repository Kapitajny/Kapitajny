import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { categories, treatmentsIn } from "@/data/treatments";

/** Cztery obszary opieki jako smukłe kapsuły – środkowe dwie lekko obniżone, jak w rzędzie flakonów. */
const drop = ["", "sm:mt-12", "sm:mt-12", ""];

export function CategoryCapsules() {
  return (
    <section aria-labelledby="areas-title" className="py-20 sm:py-28">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="areas-title" className="script text-[clamp(2.4rem,6vw,4.25rem)]">
            Zabiegi, które Cię wysłuchają
          </h2>
          <p className="mt-4 font-light text-stone">Cztery obszary opieki: od medycyny estetycznej po chwilę relaksu przy rytuale na twarz i dłonie.</p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-10">
          {categories.map((c, i) => (
            <li key={c.slug} className={drop[i]}>
              <Link href={`/zabiegi#${c.slug}`} className="group block text-center">
                <Photo
                  image={c.image}
                  sizes="(min-width: 640px) 22vw, 45vw"
                  decorative
                  className="capsule aspect-[9/16] w-full"
                  imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                />
                <h3 className="script mt-5 text-2xl leading-tight sm:text-[1.75rem]">{c.name}</h3>
                <p className="mt-1 text-xs text-stone">
                  {treatmentsIn(c.slug).length} {treatmentsIn(c.slug).length === 1 ? "zabieg" : treatmentsIn(c.slug).length < 5 ? "zabiegi" : "zabiegów"}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link href="/zabiegi" className="pill pill-line">
            Zobacz wszystkie zabiegi
          </Link>
        </div>
      </div>
    </section>
  );
}

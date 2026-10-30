import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { specialists } from "@/data/specialists";

export function SpecialistsCircles() {
  return (
    <section aria-labelledby="team-title" className="py-20 sm:py-28">
      <div className="shell text-center">
        <h2 id="team-title" className="script text-[clamp(2.4rem,6vw,4.25rem)]">
          Osoby, którym zaufasz
        </h2>
        <p className="mx-auto mt-4 max-w-md font-light text-stone">Mały zespół, który zna Cię z imienia. Od pierwszej rozmowy do wizyty kontrolnej.</p>

        <ul className="mx-auto mt-14 grid max-w-5xl gap-12 sm:grid-cols-3 sm:gap-8">
          {specialists.map((s) => (
            <li key={s.slug}>
              <Link href={`/specjalisci#${s.slug}`} className="group block">
                <Photo
                  image={s.image}
                  sizes="(min-width: 640px) 26vw, 70vw"
                  className="oval mx-auto aspect-square w-[min(70vw,16rem)] ring-1 ring-rose/40 ring-offset-8 ring-offset-ivory"
                  imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                />
                <h3 className="script mt-7 text-3xl">{s.name}</h3>
                <p className="mt-1 text-sm text-rose-deep">{s.role}</p>
              </Link>
              <p className="mx-auto mt-3 max-w-xs text-sm font-light text-stone">{s.short}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

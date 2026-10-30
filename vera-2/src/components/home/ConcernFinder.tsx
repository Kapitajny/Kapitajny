"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { bookingHref } from "@/config/site";
import { getTreatment } from "@/data/treatments";

/** Potrzeby opisane słowami klientek, każda z dopasowanymi zabiegami. */
const concerns = [
  { id: "mimika", label: "Zmarszczki mimiczne", treatments: ["redukcja-zmarszczek-mimicznych", "skin-boostery"] },
  { id: "usta", label: "Usta i kontur twarzy", treatments: ["modelowanie-kwasem-hialuronowym"] },
  { id: "blask", label: "Zmęczona, matowa skóra", treatments: ["skin-boostery", "rytual-vera", "peeling-chemiczny"] },
  { id: "pory", label: "Pory i nierówna tekstura", treatments: ["peeling-chemiczny", "mikroiglowanie"] },
  { id: "relaks", label: "Chwila tylko dla mnie", treatments: ["rytual-vera", "masaz-modelujacy-twarzy"] },
  { id: "dlonie", label: "Dłonie i paznokcie", treatments: ["rytual-dloni-i-manicure"] },
  { id: "start", label: "Nie wiem, od czego zacząć", treatments: ["konsultacja-skory"] },
];

export function ConcernFinder() {
  const [active, setActive] = useState(concerns[2].id);
  const id = useId();
  const current = concerns.find((c) => c.id === active)!;
  // Wszystkie pasujące zabiegi są w HTML; widoczne są tylko te dla wybranej potrzeby.
  const all = [...new Set(concerns.flatMap((c) => c.treatments))].map((slug) => getTreatment(slug)!);

  return (
    <section id="dla-ciebie" aria-labelledby={`${id}-title`} className="bg-blush py-20 sm:py-28">
      <div className="shell text-center">
        <h2 id={`${id}-title`} className="script text-[clamp(2.4rem,6vw,4.25rem)]">
          Czego dziś potrzebujesz?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-light text-stone">Wybierz to, co jest Ci najbliższe – pokażemy zabiegi, od których warto zacząć rozmowę.</p>

        <div role="radiogroup" aria-label="Twoja potrzeba" className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
          {concerns.map((c) => (
            <label key={c.id} className="chip">
              <input type="radio" name={`${id}-concern`} value={c.id} checked={active === c.id} onChange={() => setActive(c.id)} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>

        <ul aria-live="polite" className="mx-auto mt-12 grid max-w-5xl gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {all.map((t) => (
            <li
              key={t.slug}
              hidden={!current.treatments.includes(t.slug)}
              data-concerns={concerns
                .filter((c) => c.treatments.includes(t.slug))
                .map((c) => c.id)
                .join(" ")}
              className="rounded-[2rem] bg-ivory p-3 pr-6"
            >
              <Link href={`/zabiegi/${t.slug}`} className="group flex items-center gap-5">
                <Photo image={t.image} sizes="96px" decorative className="oval aspect-[3/4] w-20 shrink-0 sm:w-24" />
                <span>
                  <span className="script block text-2xl leading-tight group-hover:text-rose-deep">{t.name}</span>
                  <span className="mt-1 block text-xs text-stone">{t.duration}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-stone">
          Każdy plan zaczyna się od rozmowy.{" "}
          <Link href={bookingHref} className="rose-link font-medium text-burgundy">
            Umów konsultację
          </Link>
        </p>
      </div>
    </section>
  );
}

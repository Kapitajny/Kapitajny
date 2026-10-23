import Link from "next/link";
import { CONDITION_GROUPS } from "@/data/conditions";

/**
 * Indeks „Z czym przychodzą pacjenci” – pacjent szuka gabinetu po tym, co go boli.
 * Każda pozycja otwiera opis tej okolicy na podstronie usług.
 */
export function RegionIndex() {
  return (
    <section aria-labelledby="okolice-title" className="border-b border-line py-section">
      <div className="page grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
        <div>
          <h2 id="okolice-title" className="text-h2">
            Z czym przychodzą pacjenci
          </h2>
          <p className="mt-4 max-w-sm">Wybierz okolicę, która Ci dokucza. Zobaczysz, z jakimi problemami pracujemy i jak wygląda terapia.</p>
        </div>
        <ul className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
          {CONDITION_GROUPS.map((group) => (
            <li key={group.id} className="border-b border-line">
              <Link
                href={`/uslugi#dolegliwosci-${group.id}`}
                className="group flex min-h-16 items-center justify-between gap-4 py-3 text-index font-bold tracking-[-0.015em] text-brand-strong hover:text-brand"
              >
                {group.label}
                <span aria-hidden="true" className="text-small font-normal text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand">
                  zobacz
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

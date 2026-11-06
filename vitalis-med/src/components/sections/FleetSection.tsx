import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { fleet, fleetTotal, type AmbulanceType } from "@/data/fleet";
import { vehicles } from "@/lib/plural";
import { SectionHeading } from "./SectionHeading";

/** Oznaczenie typu ambulansu – litera w czerwonym okręgu, jak na pojeździe. */
export function TypeBadge({ type, size = "md" }: { type: AmbulanceType; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-9 w-9 text-lg border-2", md: "h-14 w-14 text-[1.7rem]", lg: "h-20 w-20 text-[2.5rem] border-4" }[size];
  return (
    <span className={`type-badge ${dims}`} aria-hidden="true">
      {type}
    </span>
  );
}

/** Skład floty w liczbach. */
export function FleetBar() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[0.98rem]">
      {fleet.map((c) => (
        <li key={c.type} className="flex items-center gap-2.5">
          <TypeBadge type={c.type} size="sm" />
          <span>
            <strong className="font-bold text-ink">Typ {c.type}:</strong> {vehicles(c.count)}
          </span>
        </li>
      ))}
      <li className="flex items-center text-muted">Łącznie: {fleetTotal} ambulansów</li>
    </ul>
  );
}

export function FleetSection() {
  return (
    <section aria-labelledby="flota-title" className="section bg-mist">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <SectionHeading
            title="Nowoczesna flota ambulansów"
            id="flota-title"
            lead="Dysponujemy 20 ambulansami w trzech kategoriach. Rodzaj pojazdu i skład zespołu dobieramy do stanu pacjenta i charakteru przewozu."
          />
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {fleet.map((c) => (
            <li key={c.type} className="card flex flex-col overflow-hidden">
              <div className="relative aspect-[4/3] bg-fog">
                <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4">
                  <TypeBadge type={c.type} />
                  <div>
                    <h3 className="text-[1.3rem]">{c.name}</h3>
                    <p className="text-[0.95rem] font-bold text-red">{vehicles(c.count)}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[0.98rem] leading-relaxed">{c.summary}</p>
                <Link href={`/flota#typ-${c.type.toLowerCase()}`} className="link-arrow mt-5 self-start" aria-label={`Wyposażenie i zespół: ${c.name}`}>
                  Wyposażenie i zespół
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

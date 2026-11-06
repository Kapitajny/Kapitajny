import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { fleet, fleetTotal, type AmbulanceType } from "@/data/fleet";
import { vehicles } from "@/lib/plural";
import { FleetShowcase } from "./FleetShowcase";
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
            <strong className="text-ink">Typ {c.type}:</strong> {vehicles(c.count)}
          </span>
        </li>
      ))}
      <li className="flex items-center text-muted">Łącznie: {fleetTotal} ambulansów</li>
    </ul>
  );
}

/** Pojazd wycięty z tła, ustawiony na jasnym „podeście” – jak w katalogu producenta. */
export function VehicleStage({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      <div className="absolute inset-x-[7%] bottom-[11%] top-[10%]">
        <div aria-hidden="true" className="vehicle-shadow" />
        <Image src={src} alt={alt} fill sizes={sizes} className="object-contain object-bottom" />
      </div>
    </div>
  );
}

export function FleetSection() {
  return (
    <section aria-labelledby="flota-title" className="section bg-mist">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading
              title="Nowoczesna flota ambulansów"
              id="flota-title"
              lead="Dysponujemy 20 ambulansami w trzech kategoriach. Rodzaj pojazdu i skład zespołu dobieramy do stanu pacjenta i charakteru przewozu."
            />
          </div>
          <p className="text-muted lg:col-span-5 lg:text-right">
            <span className="block text-[3.4rem] font-semibold leading-none tracking-tight text-ink">{fleetTotal}</span>
            ambulansów we flocie
          </p>
        </Reveal>
        <div className="mt-10">
          <FleetShowcase />
        </div>
      </div>
    </section>
  );
}

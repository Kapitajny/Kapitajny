import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { fleet, fleetTotal, type AmbulanceType } from "@/data/fleet";
import { vehicles } from "@/lib/plural";
import { SectionHeading } from "./SectionHeading";

export function TypeBadge({ type, size = "md" }: { type: AmbulanceType; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-9 w-9 text-lg border-2", md: "h-14 w-14 text-[1.7rem]", lg: "h-20 w-20 text-[2.5rem] border-4" }[size];
  return (
    <span className={`type-badge ${dims}`} aria-hidden="true">
      {type}
    </span>
  );
}

/** Proporcjonalny pasek składu floty (np. 11 P · 5 S · 4 T). */
export function FleetBar() {
  const ordered = [...fleet].sort((a, b) => b.count - a.count);
  const tones: Record<AmbulanceType, string> = { P: "bg-ink", S: "bg-red", T: "bg-line-strong" };
  return (
    <figure>
      <div className="flex h-3 w-full gap-1" aria-hidden="true">
        {ordered.map((c) => (
          <div key={c.type} className={`${tones[c.type]} h-full`} style={{ flexGrow: c.count }} />
        ))}
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[0.95rem] text-body">
        {ordered.map((c) => (
          <span key={c.type} className="flex items-center gap-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 ${tones[c.type]}`} />
            <strong className="font-semibold text-ink">Typ {c.type}:</strong> {vehicles(c.count)}
          </span>
        ))}
        <span className="text-muted">Łącznie: {fleetTotal} ambulansów</span>
      </figcaption>
    </figure>
  );
}

export function FleetSection() {
  return (
    <section aria-labelledby="flota-title" className="section border-t border-line bg-mist">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionHeading
              title="Nowoczesna flota ambulansów"
              id="flota-title"
              lead="Dysponujemy 20 ambulansami w trzech kategoriach. Rodzaj pojazdu i skład zespołu dobieramy do stanu pacjenta i charakteru przewozu."
            />
          </Reveal>
          <Reveal className="lg:col-span-5">
            <FleetBar />
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-8 md:grid-cols-3 lg:mt-16 lg:gap-10">
          {fleet.map((c) => (
            <li key={c.type} className="group flex flex-col bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative flex flex-1 flex-col px-6 pb-7 pt-10 sm:px-7">
                <div className="absolute -top-7 left-6 sm:left-7">
                  <TypeBadge type={c.type} />
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[1.55rem]">{c.name}</h3>
                  <p className="shrink-0 font-display text-lg font-semibold text-red" style={{ fontStretch: "90%" }}>
                    {vehicles(c.count)}
                  </p>
                </div>
                <p className="mt-3 flex-1 text-[1rem] leading-relaxed">{c.summary}</p>
                <Link href={`/flota#typ-${c.type.toLowerCase()}`} className="link-arrow mt-6 self-start" aria-label={`Wyposażenie i zespół: ${c.name}`}>
                  Wyposażenie i zespół
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

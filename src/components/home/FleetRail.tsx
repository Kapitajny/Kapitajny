"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { durationLabel, formatPrice, jetskiTitle, lowestPrice, type Jetski, type LicenseRequirement } from "@/lib/rental";
import { ChevronIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

export const LICENSE_LABEL: Record<LicenseRequirement, string> = {
  none: "Bez patentu",
  required: "Wymaga patentu",
  unknown: "Uprawnienia do potwierdzenia",
};

type Filter = "all" | "none" | "required";

export function FleetRail({ jetskis }: { jetskis: Jetski[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const railRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState({ start: 0, size: 1 });

  const counts = { none: jetskis.filter((j) => j.license === "none").length, required: jetskis.filter((j) => j.license === "required").length };
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Wszystkie", count: jetskis.length },
    { id: "none", label: "Bez patentu", count: counts.none },
    { id: "required", label: "Wymagają patentu", count: counts.required },
  ].filter((t) => t.id === "all" || t.count > 0) as { id: Filter; label: string; count: number }[];
  const shown = filter === "all" ? jetskis : jetskis.filter((j) => j.license === filter);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const max = rail.scrollWidth;
      setProgress({ start: rail.scrollLeft / max, size: Math.min(1, rail.clientWidth / max) });
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [shown.length]);

  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {tabs.length > 1 ? (
          <div role="group" aria-label="Kategoria skuterów" className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={filter === t.id}
                onClick={() => {
                  setFilter(t.id);
                  railRef.current?.scrollTo({ left: 0 });
                }}
                className={`min-h-11 px-4 text-[0.95rem] font-semibold transition-colors ${
                  filter === t.id ? "bg-white text-graphite" : "text-white/80 shadow-[inset_0_0_0_1.5px_var(--color-slate-line)] hover:text-white"
                }`}
              >
                {t.label} <span className="tabular opacity-60">{t.count}</span>
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        {progress.size < 1 && (
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => scrollBy(-1)} disabled={progress.start <= 0.001} aria-label="Poprzednie skutery" className="grid h-12 w-12 place-items-center border border-slate-line disabled:opacity-35">
              <ChevronIcon className="rotate-180" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} disabled={progress.start + progress.size >= 0.999} aria-label="Następne skutery" className="grid h-12 w-12 place-items-center border border-slate-line disabled:opacity-35">
              <ChevronIcon />
            </button>
          </div>
        )}
      </div>

      <ul ref={railRef} className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 md:mx-0 md:scroll-px-0 md:px-0" aria-label="Skutery">
        {shown.map((j, i) => (
          <li key={j.id} className={`w-[84%] shrink-0 snap-start sm:w-[58%] ${i === 0 ? "md:w-[52%]" : "md:w-[34%]"}`}>
            <FleetCard jetski={j} featured={i === 0} />
          </li>
        ))}
      </ul>
      {progress.size < 1 && (
        <div className="mt-6 h-[3px] bg-slate-line" aria-hidden="true">
          <div className="h-full bg-turq transition-[margin] duration-150" style={{ width: `${progress.size * 100}%`, marginLeft: `${progress.start * 100}%` }} />
        </div>
      )}
    </div>
  );
}

function FleetCard({ jetski: j, featured }: { jetski: Jetski; featured: boolean }) {
  const from = lowestPrice(j);
  const specs = [
    j.powerHp != null && { value: `${j.powerHp} KM`, label: "moc silnika" },
    j.seats != null && { value: `${j.seats} ${j.seats === 1 ? "os." : "os."}`, label: "miejsca" },
    j.depositGr != null && { value: formatPrice(j.depositGr), label: "kaucja" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <article className="relative flex h-full flex-col">
      <div className={`relative overflow-hidden bg-slate ${featured ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        {j.image ? (
          <Photo src={j.image} alt={j.imageAlt ?? jetskiTitle(j)} sizes="(min-width: 768px) 50vw, 85vw" className="transition-transform duration-700 ease-[var(--ease-wake)] hover:scale-[1.04]" />
        ) : (
          <div className="grid h-full place-items-center text-white/40">Zdjęcie wkrótce</div>
        )}
        <span className={`absolute left-3 top-3 px-2.5 py-1 text-sm font-bold ${j.license === "none" ? "bg-turq text-graphite" : "bg-white text-graphite"}`}>{LICENSE_LABEL[j.license]}</span>
      </div>
      {j.manufacturer && <p className="mt-4 text-sm text-mist">{j.manufacturer}</p>}
      <h3 className={`font-display font-extrabold uppercase leading-[0.9] ${featured ? "text-5xl" : "text-4xl"} ${j.manufacturer ? "mt-1" : "mt-4"}`}>{j.model ?? j.name}</h3>
      {j.description && <p className="mt-3 line-clamp-3 text-white/75">{j.description}</p>}
      <dl className="mt-4 flex flex-wrap gap-x-7 gap-y-3 border-t border-slate-line pt-4">
        {specs.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-2xl font-bold leading-none">{s.value}</dd>
            <dd className="mt-1 text-sm text-mist">{s.label}</dd>
          </div>
        ))}
        <div>
          <dt className="sr-only">Cena</dt>
          <dd className="font-display text-2xl font-bold leading-none">{from ? `od ${formatPrice(from.price)}` : "Cena wkrótce"}</dd>
          <dd className="mt-1 text-sm text-mist">{from ? `brutto za ${durationLabel(from.duration)}` : "cennik w przygotowaniu"}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link href={`/rezerwacja?skuter=${encodeURIComponent(j.id)}`} className="btn btn-primary btn-sm">
          Zarezerwuj
        </Link>
        <Link href={`/flota/${encodeURIComponent(j.id)}`} className="btn btn-ghost btn-sm text-white">
          Zobacz szczegóły<span className="sr-only">: {jetskiTitle(j)}</span>
        </Link>
      </div>
    </article>
  );
}

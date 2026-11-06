"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icons";
import { orderHref } from "@/config/site";
import { fleet } from "@/data/fleet";
import { vehicles } from "@/lib/plural";

/** Prezentacja floty z zakładkami T / S / P: duży pojazd na podeście i karta z wyposażeniem. */
export function FleetShowcase() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = fleet.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Rodzaje ambulansów" className="grid grid-cols-3 gap-2 sm:gap-3">
        {fleet.map((c, i) => {
          const selected = i === active;
          return (
            <button
              key={c.type}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${uid}-tab-${c.type}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${c.type}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex flex-col items-center gap-2 rounded-[16px] border px-2 py-3 text-center transition-colors sm:flex-row sm:gap-3 sm:px-5 sm:py-4 sm:text-left ${
                selected ? "border-ink bg-white" : "border-transparent bg-white/60 hover:bg-white"
              }`}
            >
              <span className={`type-badge h-10 w-10 border-2 text-xl sm:h-12 sm:w-12 sm:text-2xl ${selected ? "" : "opacity-70"}`} aria-hidden="true">
                {c.type}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold leading-tight text-ink">
                  <span className="sm:hidden">Typ {c.type}</span>
                  <span className="hidden sm:inline">{c.name}</span>
                </span>
                <span className="block text-[0.8rem] text-muted sm:text-sm">{vehicles(c.count)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {fleet.map((c, i) => (
        <div
          key={c.type}
          id={`${uid}-panel-${c.type}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${c.type}`}
          hidden={i !== active}
          className="mt-4 grid overflow-hidden rounded-[24px] bg-white lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
        >
          <div className="relative aspect-[16/10] bg-white lg:aspect-auto lg:min-h-[28rem]">
            <div className="absolute inset-x-[6%] bottom-[12%] top-[10%]">
              <div aria-hidden="true" className="vehicle-shadow" />
              <Image src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain object-bottom" />
            </div>
          </div>
          <div className="border-t border-line p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-11">
            <h3 className="text-[1.6rem] tracking-tight">{c.name}</h3>
            <p className="mt-1 font-semibold text-red">{vehicles(c.count)} we flocie</p>
            <p className="mt-5 font-light leading-relaxed">{c.summary}</p>
            <h4 className="mt-7 text-[0.95rem] font-semibold">Wybrane wyposażenie</h4>
            <ul className="mt-3 space-y-2">
              {c.equipment.map((e) => (
                <li key={e} className="flex gap-3 text-[0.97rem]">
                  <Icon name="check" size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-ink" />
                  {e}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-[0.95rem] leading-relaxed text-muted">{c.crew}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={orderHref()} className="btn btn-dark btn-sm">
                Zamów transport
              </Link>
              <Link href={`/flota#typ-${c.type.toLowerCase()}`} className="link-arrow" aria-label={`Wyposażenie i zespół: ${c.name}`}>
                Wyposażenie i&nbsp;zespół
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

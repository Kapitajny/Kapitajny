import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { formatPrice, services } from "@/data/offer";

/** Dwie kategorie usług z ceną „od” i przejściem do podstrony. */
export function ServicesOverview() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {services.map((service, n) => (
        <article
          key={service.id}
          className="reveal card group relative flex flex-col overflow-hidden p-7 sm:p-10"
          style={{ "--delay": `${n * 90}ms` } as CSSProperties}
        >
          <div className="flex items-start justify-between gap-6">
            <span className="font-mono text-[0.75rem] tracking-[0.08em] text-steel">0{n + 1}</span>
            <ServiceGlyph kind={service.id} />
          </div>
          <h3 className="h3 mt-10">
            <Link href={service.href} className="after:absolute after:inset-0 after:content-['']">
              {service.name}
            </Link>
          </h3>
          <p className="mt-3 max-w-md text-steel">{service.lead}</p>
          <ul className="ticks mt-7 mb-10 grid gap-2.5 text-[0.975rem] sm:grid-cols-2">
            {service.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-6">
            <p>
              <span className="block text-[0.875rem] text-steel">od</span>
              <span className="text-[1.75rem] font-semibold tracking-[-0.03em]">{formatPrice(service.price)} zł</span>{" "}
              <span className="text-steel">netto</span>
            </p>
            <span className="link-arrow text-[0.95rem]" aria-hidden="true">
              Szczegóły <ArrowRight />
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

/** Mini-szkice w narożniku kart: okno strony albo siatka produktów z kwadracikiem z logo. */
function ServiceGlyph({ kind }: { kind: "strona" | "sklep" }) {
  return (
    <svg viewBox="0 0 64 48" className="h-12 w-16 text-ink" aria-hidden="true">
      <rect x="1" y="1" width="62" height="46" rx="7" fill="none" stroke="currentColor" strokeWidth="2" />
      {kind === "strona" ? (
        <>
          <rect x="8" y="10" width="26" height="5" rx="1.5" fill="currentColor" />
          <rect x="8" y="19" width="18" height="3" rx="1.5" fill="#c4c6c0" />
          <rect x="8" y="27" width="14" height="6" rx="3" fill="currentColor" />
          <rect x="38" y="10" width="18" height="23" rx="3" fill="#ecece8" />
        </>
      ) : (
        <>
          {[8, 23, 38].map((x) => (
            <rect key={x} x={x} y="9" width="12" height="15" rx="2" fill="#ecece8" />
          ))}
          {[8, 23, 38].map((x) => (
            <rect key={x} x={x} y="28" width="8" height="3" rx="1.5" fill="currentColor" />
          ))}
        </>
      )}
      <rect x="49" y="35" width="7" height="7" rx="1" fill="var(--color-gold)" />
    </svg>
  );
}

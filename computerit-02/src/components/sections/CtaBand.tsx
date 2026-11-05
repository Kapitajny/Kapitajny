import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

/** Końcowe wezwanie do działania: ciemny blok z siatką i złotą ścieżką. */
export function CtaBand({
  title = "Zbudujmy razem coś wyjątkowego",
  lead = "Opowiedz nam o swojej firmie i o tym, czego potrzebujesz. Odpowiemy z propozycją zakresu i wyceną.",
  primary = { href: "/kontakt", label: "Porozmawiajmy o projekcie" },
  secondary = { href: "/uslugi", label: "Poznaj nasze usługi" },
}: {
  title?: string;
  lead?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="container-x pb-[clamp(4.5rem,10vw,8rem)]">
      <div className="on-dark reveal relative overflow-hidden rounded-[1.75rem] bg-ink px-7 py-16 text-white sm:px-14 sm:py-20">
        <div className="grid-bg-dark fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <svg className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-70" viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax meet" fill="none" aria-hidden="true">
          <path d="M400 70H300V190H210V300" stroke="#5c4a26" strokeWidth="1.5" />
          <path d="M400 70H300V190H210V300" stroke="var(--color-gold)" strokeWidth="2.5" className="trace-pulse" />
          <circle cx="300" cy="70" r="4" fill="var(--color-ink)" stroke="var(--color-gold)" strokeWidth="1.5" />
          <circle cx="300" cy="190" r="4" fill="var(--color-ink)" stroke="var(--color-gold)" strokeWidth="1.5" />
          <rect x="203" y="223" width="14" height="14" rx="2" fill="var(--color-gold)" />
        </svg>
        <div className="relative max-w-2xl">
          <p className="eyebrow eyebrow-gold">Następny krok</p>
          <h2 className="h2 mt-5">{title}</h2>
          <p className="lead mt-5">{lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={primary.href} className="btn btn-light">
              {primary.label}
              <ArrowRight />
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn btn-ghost-dark">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

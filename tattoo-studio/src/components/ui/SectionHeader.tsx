import type { ReactNode } from "react";

/**
 * Nagłówek sekcji: pionowy znak japoński ze złotą linią (tategaki) — wspólny język wszystkich sekcji —
 * oraz tytuł i wstęp. Znak ma charakter dekoracyjny; treścią jest tytuł.
 */
export function SectionHeader({
  id,
  kanji,
  reading,
  title,
  lead,
  tone = "light",
  aside,
  children,
}: {
  id: string;
  kanji: string;
  reading: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-end">
      <div className="flex gap-6 lg:col-span-8 xl:gap-10">
        <div aria-hidden="true" className="hidden shrink-0 flex-col items-center gap-4 pt-2 sm:flex">
          <span className="tategaki text-2xl">{kanji}</span>
          <span className="h-16 w-px bg-kin" />
          <span className={`tategaki font-gothic text-2xs tracking-[0.3em] ${dark ? "text-usuzumi" : "text-nezumi"}`}>{reading}</span>
        </div>
        <div className="min-w-0">
          <span aria-hidden="true" className={`mb-4 block font-mincho text-xl sm:hidden ${dark ? "text-kin" : "text-kin-deep"}`}>
            {kanji}
          </span>
          <h2 id={id} className="display display-lg">
            {title}
          </h2>
          {lead && <div className={`lead mt-6 ${dark ? "text-washi/75" : "text-nezumi"}`}>{lead}</div>}
          {children}
        </div>
      </div>
      {aside && <div className="lg:col-span-4 lg:justify-self-end">{aside}</div>}
    </div>
  );
}

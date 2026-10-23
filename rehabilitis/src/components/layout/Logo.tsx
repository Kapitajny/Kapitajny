import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Logo gabinetu: znak (krzyż z sylwetką, kręgosłupem i liściem) + nazwa z config/site.ts.
 * `layout="stacked"` – znak nad nazwą (panel boczny), `layout="inline"` – obok (pasek mobilny, stopka).
 * Pliki: public/images/brand/logo-znak.png; oryginał: public/images/brand/logo-oryginal.png.
 */
export function Logo({ layout = "inline", onNavigate }: { layout?: "stacked" | "inline"; onNavigate?: () => void }) {
  const stacked = layout === "stacked";
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`inline-flex ${stacked ? "flex-col items-start gap-4" : "items-center gap-3"}`}
      aria-label={`${siteConfig.name} – strona główna`}
    >
      <Image
        src="/images/brand/logo-znak.png"
        alt=""
        width={stacked ? 64 : 40}
        height={stacked ? 64 : 40}
        className={stacked ? "h-16 w-16" : "h-10 w-10 shrink-0"}
      />
      <span className="flex flex-col leading-none">
        <span className="text-h4 font-bold tracking-[0.06em] text-brand-deep">{siteConfig.name}</span>
        {/* Na bardzo wąskich ekranach (< 375 px) pasek mobilny pokazuje tylko znak i nazwę. */}
        <span className={`mt-1.5 whitespace-nowrap text-caption text-muted ${stacked ? "" : "max-[374px]:hidden"}`}>{siteConfig.descriptor}</span>
      </span>
    </Link>
  );
}

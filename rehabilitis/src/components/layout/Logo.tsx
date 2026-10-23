import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Logo gabinetu: znak (krzyż z sylwetką, kręgosłupem i liściem) + nazwa z config/site.ts.
 * Pliki: public/images/brand/logo-znak.png (na jasne tło) i logo-znak-bialy.png (na zielone tło).
 * Oryginał od właściciela: public/images/brand/logo-oryginal.png.
 */
export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  const dark = tone === "dark";
  return (
    <Link href="/" onClick={onNavigate} className="inline-flex items-center gap-3" aria-label={`${siteConfig.name} – strona główna`}>
      <Image
        src={dark ? "/images/brand/logo-znak.png" : "/images/brand/logo-znak-bialy.png"}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.2rem] font-bold tracking-[0.04em] ${dark ? "text-forest" : "text-white"}`}>{siteConfig.name}</span>
        <span className={`mt-1 whitespace-nowrap text-[0.78rem] ${dark ? "text-muted" : "text-white/75"}`}>{siteConfig.descriptor}</span>
      </span>
    </Link>
  );
}

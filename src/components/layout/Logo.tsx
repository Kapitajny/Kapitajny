import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import logo from "../../../public/images/brand/logo-dark.png";

/**
 * Znak marki (but) w wersji na ciemne tło – odwrócone kolory, tak jak na nadrukach na czarnych bluzach.
 */
export function Logo({ className = "", withName = true }: { className?: string; withName?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label={`${siteConfig.name} – strona główna`}>
      <Image src={logo} alt="" className="h-7 w-auto md:h-8" priority />
      {withName && <span className="display-sm hidden text-[0.95rem] tracking-[0.04em] sm:inline">{siteConfig.name}</span>}
    </Link>
  );
}

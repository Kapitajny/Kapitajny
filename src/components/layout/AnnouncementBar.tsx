import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Pasek ogłoszeń – treść i link ustawiasz w `src/config/site.ts`. */
export function AnnouncementBar() {
  const { announcement } = siteConfig;
  if (!announcement.enabled) return null;
  return (
    <div className="bg-paper text-ink">
      <Link
        href={announcement.href}
        className="wrap flex min-h-9 items-center justify-center text-center text-[0.75rem] font-bold uppercase tracking-[0.08em] wide hover:underline"
      >
        {announcement.text}
      </Link>
    </div>
  );
}

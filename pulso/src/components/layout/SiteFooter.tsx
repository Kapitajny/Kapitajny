import Link from "next/link";
import { legalLinks, nav, site } from "@/config/site";
import { services } from "@/data/services";
import { Logo } from "@/components/brand/Logo";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";

export function SiteFooter({ showCta = true, home = true }: { showCta?: boolean; home?: boolean }) {
  const year = new Date().getFullYear();
  const { email, phone } = site.contact;
  const c = site.company;
  const hrefFor = (hash: string) => (home ? hash : `/${hash}`);
  return (
    <footer className="on-ink bg-ink text-paper">
      {showCta && (
        <div className="container-plan border-b border-paper/15 py-[var(--section-y)]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="t-h2 lg:col-span-8">Masz pomysł na kampanię? Rozpiszmy go na plan.</p>
            <div className="lg:col-span-4 lg:justify-self-end">
              <ContactLink className="btn btn-on-ink">
                Rozpocznij współpracę <Arrow />
              </ContactLink>
            </div>
          </div>
          {/* Pasek planu jako zamknięcie strony: cztery kanały, wszystkie zarezerwowane. */}
          <div className="mt-12 grid grid-cols-12 gap-1.5" aria-hidden="true">
            <span className="col-span-5 h-2.5 rounded-[3px] bg-google" />
            <span className="col-span-3 h-2.5 rounded-[3px] bg-meta" />
            <span className="col-span-2 h-2.5 rounded-[3px] bg-youtube" />
            <span className="col-span-2 h-2.5 rounded-[3px] bg-tiktok" />
          </div>
        </div>
      )}

      <div className="container-plan grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="paper" />
          <p className="mt-4 max-w-[36ch] text-[0.9875rem] leading-relaxed text-paper/75">
            {site.fullName}. Kampanie w Meta, Google, YouTube i TikToku: strategia, konfiguracja, optymalizacja i przejrzyste
            raporty.
          </p>
          <p className="mt-4 text-[0.9375rem] font-[620]" style={{ fontVariationSettings: '"wdth" 112' }}>
            {site.tagline}
          </p>
        </div>

        <nav aria-label="Stopka: nawigacja" className="lg:col-span-2">
          <p className="t-col !text-paper/70">Strona</p>
          <ul className="mt-3 space-y-1.5">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={hrefFor(n.href)} className="text-[0.9375rem] text-paper/90 underline-offset-4 hover:underline">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="t-col !text-paper/70">Usługi</p>
          <ul className="mt-3 space-y-1.5">
            {services.map((s) => (
              <li key={s.id}>
                <a href={hrefFor(`#usluga-${s.id}`)} className="text-[0.9375rem] text-paper/90 underline-offset-4 hover:underline">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="t-col !text-paper/70">Kontakt</p>
          <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
            <li>
              {home ? (
                <ContactLink className="text-paper/90 underline underline-offset-4">Formularz kontaktowy</ContactLink>
              ) : (
                <Link href="/#kontakt" className="text-paper/90 underline underline-offset-4">
                  Formularz kontaktowy
                </Link>
              )}
            </li>
            {email && (
              <li>
                <a href={`mailto:${email}`} className="text-paper/90 underline-offset-4 hover:underline">
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-paper/90 underline-offset-4 hover:underline">
                  {phone}
                </a>
              </li>
            )}
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="text-paper/90 underline-offset-4 hover:underline" rel="noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-plan flex flex-col gap-3 border-t border-paper/15 py-6 text-sm text-paper/70 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {c.legalName ?? site.fullName}
          {c.nip ? ` · NIP ${c.nip}` : ""}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {legalLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="underline-offset-4 hover:text-paper hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

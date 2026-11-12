import Link from "next/link";
import { Suspense } from "react";
import { legalNav, mainNav, site } from "@/config/site";
import { getPublicData } from "@/lib/server/public-data";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TiktokIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

async function FooterContact() {
  const { settings } = await getPublicData();
  const phone = settings.contact_phone.trim();
  const email = settings.contact_email.trim();
  return (
    <ul className="grid gap-3 text-white/85">
      <li className="flex gap-3">
        <PhoneIcon className="mt-1 shrink-0 text-turq" />
        {phone ? (
          <a className="link" href={`tel:${phone.replace(/\s/g, "")}`}>
            {phone}
          </a>
        ) : (
          <span className="text-white/55">Telefon wkrótce</span>
        )}
      </li>
      <li className="flex gap-3">
        <MailIcon className="mt-1 shrink-0 text-turq" />
        {email ? (
          <a className="link break-all" href={`mailto:${email}`}>
            {email}
          </a>
        ) : (
          <span className="text-white/55">E-mail wkrótce</span>
        )}
      </li>
    </ul>
  );
}

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.tiktok, label: "TikTok", Icon: TiktokIcon },
].filter((s): s is { href: string; label: string; Icon: typeof InstagramIcon } => !!s.href);

export function SiteFooter() {
  return (
    <footer className="on-dark overflow-hidden bg-navy text-white">
      <div className="wrap pb-28 pt-20 md:pb-10 md:pt-28">
        <p className="display-xl max-w-[11ch] text-[clamp(3.2rem,9vw,8.5rem)]">Do zobaczenia na wodzie</p>
        <span className="wake mt-8 w-[min(46rem,92%)] rotate-[-3deg]" aria-hidden="true" />

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-white/70">Wynajem skuterów wodnych w Sopocie. Od godziny do pełnej doby.</p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center border border-slate-line transition-colors hover:border-white">
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="font-sans text-base font-bold normal-case tracking-normal">Przystań</h2>
            <p className="mt-3 flex gap-3 text-white/85">
              <PinIcon className="mt-1 shrink-0 text-turq" />
              <span>
                {site.address.street}
                <br />
                {site.address.postal} {site.address.city}
                {site.address.fictional && <span className="mt-1 block text-sm text-white/50">Adres przykładowy (projekt demonstracyjny)</span>}
              </span>
            </p>
          </div>
          <div>
            <h2 className="font-sans text-base font-bold normal-case tracking-normal">Kontakt</h2>
            <div className="mt-3">
              <Suspense fallback={<p className="text-white/55">Ładowanie…</p>}>
                <FooterContact />
              </Suspense>
            </div>
          </div>
          <nav aria-label="Na skróty">
            <h2 className="font-sans text-base font-bold normal-case tracking-normal">Na skróty</h2>
            <ul className="mt-3 grid gap-2 text-white/85">
              {mainNav.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/rezerwacja" className="link">
                  Rezerwacja online
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-slate-line pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {site.name}. Projekt demonstracyjny – dane firmy do uzupełnienia.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { LEGAL_LINKS, siteConfig } from "@/config/site";
import { Pattern } from "@/components/ui/Pattern";
import { Seal } from "@/components/ui/Seal";

const FOOTER_NAV = [
  { label: "About Us", href: "/#about" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Specialties", href: "/#specialties" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

function Todo({ children }: { children: string }) {
  return <span className="todo">{children}: do uzupełnienia</span>;
}

export function Footer() {
  const { contact, social } = siteConfig;
  const socials = [
    { label: "Instagram", href: social.instagram },
    { label: "Facebook", href: social.facebook },
    { label: "TikTok", href: social.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="on-dark relative isolate flex min-h-svh flex-col overflow-hidden bg-sumi pb-[var(--dock-space)] text-washi">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 text-washi/[0.08] [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" scale={1.1} strokeWidth={0.8} />
      </div>

      <div className="page-x relative flex flex-1 flex-col justify-end pt-36">
        <Seal size={64} className="mb-8" />
        {/* Wielkość dopasowana do długości nazwy, aby zawsze mieściła się w szerokości ekranu. */}
        <p
          aria-hidden="true"
          className="whitespace-nowrap font-mincho font-normal leading-[0.78] tracking-[0.04em] text-washi"
          style={{ fontSize: `min(30rem, ${(86 / (siteConfig.name.length * 0.86)).toFixed(2)}vw)` }}
        >
          {siteConfig.name}
        </p>
        <p className="mt-8 font-gothic text-sm font-medium tracking-[0.28em] text-kinari">{siteConfig.tagline}</p>
      </div>

      <div className="page-x relative mt-16 grid gap-12 border-t border-washi/15 pt-12 sm:grid-cols-2 lg:grid-cols-12">
        <nav aria-label="Stopka" className="lg:col-span-3">
          <h2 className="font-gothic text-xs text-usuzumi">Studio</h2>
          <ul className="mt-5 space-y-2.5 font-mincho text-lg">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-kinari">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div id="contact" className="scroll-mt-10 lg:col-span-4">
          <h2 className="font-gothic text-xs text-usuzumi">Contact</h2>
          <address className="mt-5 space-y-2.5 font-mincho text-lg not-italic">
            <p>{contact.address || <Todo>Adres studia</Todo>}</p>
            <p>
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="ink-link">
                  {contact.email}
                </a>
              ) : (
                <Todo>E-mail</Todo>
              )}
            </p>
            <p>
              {contact.phone ? (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="ink-link">
                  {contact.phone}
                </a>
              ) : (
                <Todo>Telefon</Todo>
              )}
            </p>
            <p className="font-gothic text-sm text-usuzumi">{contact.hours || <Todo>Godziny pracy</Todo>}</p>
            {contact.mapUrl && (
              <p>
                <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="ink-link font-gothic text-sm">
                  Open in maps
                </a>
              </p>
            )}
          </address>
          <Link href="/rezerwacja" className="btn btn-paper mt-8">
            Book your tattoo
          </Link>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-gothic text-xs text-usuzumi">Social</h2>
          <ul className="mt-5 space-y-2.5 font-mincho text-lg">
            {socials.length ? (
              socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-kinari">
                    {s.label}
                  </a>
                </li>
              ))
            ) : (
              <li>
                <Todo>Profile społecznościowe</Todo>
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-gothic text-xs text-usuzumi">Informacje</h2>
          <ul className="mt-5 space-y-2.5 font-mincho text-lg">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-kinari">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="page-x relative mt-14 flex flex-col gap-2 border-t border-washi/15 py-6 font-gothic text-xs text-usuzumi sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.legal.companyName || siteConfig.name}. Wszelkie prawa zastrzeżone.
        </p>
        <p>Projekty i zdjęcia prac chronione prawem autorskim.</p>
      </div>
    </footer>
  );
}

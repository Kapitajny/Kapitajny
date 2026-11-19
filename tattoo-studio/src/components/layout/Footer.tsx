"use client";

import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { BrandTagline } from "@/components/ui/BrandTagline";
import { Pattern } from "@/components/ui/Pattern";
import { Seal } from "@/components/ui/Seal";

function Todo({ label, suffix }: { label: string; suffix: string }) {
  return (
    <span className="todo">
      {label}: {suffix}
    </span>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  const f = t.footer;
  const { contact, social } = siteConfig;
  const hours = contact.hours[lang];
  const socials = [
    { label: "Instagram", href: social.instagram },
    { label: "Facebook", href: social.facebook },
    { label: "TikTok", href: social.tiktok },
  ].filter((s) => s.href);

  const nav = [
    { label: f.links.about, hash: "about" },
    { label: f.links.gallery, hash: "gallery" },
    { label: f.links.specialties, hash: "specialties" },
    { label: f.links.pricing, hash: "pricing" },
    { label: f.links.faq, hash: "faq" },
    { label: f.links.contact, hash: "contact" },
  ];

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
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <span aria-hidden="true" className="h-px w-10 bg-kin" />
          <BrandTagline className="font-gothic text-xs font-medium tracking-[0.28em] text-kinari sm:text-sm" />
        </div>
      </div>

      <div className="page-x relative mt-16 grid gap-12 border-t border-washi/12 pt-12 sm:grid-cols-2 lg:grid-cols-12">
        <nav aria-label={f.navLabel} className="lg:col-span-3">
          <h2 className="font-gothic text-xs text-usuzumi">{f.studio}</h2>
          <ul className="mt-5 space-y-2.5 font-mincho text-lg">
            {nav.map((item) => (
              <li key={item.hash}>
                <LocalizedLink route="home" hash={item.hash} className="hover:text-kin">
                  {item.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </nav>

        <div id="contact" className="scroll-mt-10 lg:col-span-4">
          <h2 className="font-gothic text-xs text-usuzumi">{f.contact}</h2>
          <address className="mt-5 space-y-2.5 font-mincho text-lg not-italic">
            <p>{contact.address || <Todo label={f.todo.address} suffix={t.common.todo} />}</p>
            <p>
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="ink-link">
                  {contact.email}
                </a>
              ) : (
                <Todo label={f.todo.email} suffix={t.common.todo} />
              )}
            </p>
            <p>
              {contact.phone ? (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="ink-link">
                  {contact.phone}
                </a>
              ) : (
                <Todo label={f.todo.phone} suffix={t.common.todo} />
              )}
            </p>
            <p className="font-gothic text-sm text-usuzumi">{hours || <Todo label={f.todo.hours} suffix={t.common.todo} />}</p>
            {contact.mapUrl && (
              <p>
                <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="ink-link font-gothic text-sm">
                  {f.openMaps}
                </a>
              </p>
            )}
          </address>
          <LocalizedLink route="booking" className="btn btn-paper mt-8">
            {t.nav.bookLong}
          </LocalizedLink>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-gothic text-xs text-usuzumi">{f.social}</h2>
          <ul className="mt-5 space-y-2.5 font-mincho text-lg">
            {socials.length ? (
              socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-kin">
                    {s.label}
                  </a>
                </li>
              ))
            ) : (
              <li>
                <Todo label={f.todo.socials} suffix={t.common.todo} />
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-gothic text-xs text-usuzumi">{f.info}</h2>
          <ul className="mt-5 space-y-2.5 font-mincho text-lg">
            <li>
              <LocalizedLink route="terms" className="hover:text-kin">
                {t.legal.links.terms}
              </LocalizedLink>
            </li>
            <li>
              <LocalizedLink route="privacy" className="hover:text-kin">
                {t.legal.links.privacy}
              </LocalizedLink>
            </li>
          </ul>
          <div className="mt-8">
            <p className="mb-3 font-gothic text-xs text-usuzumi">{t.common.language.label}</p>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="page-x relative mt-14 flex flex-col gap-2 border-t border-washi/12 py-6 font-gothic text-xs text-usuzumi sm:flex-row sm:justify-between">
        <p>{f.rights(new Date().getFullYear(), siteConfig.legal.companyName || siteConfig.name)}</p>
        <p>{f.copyright}</p>
      </div>
    </footer>
  );
}

import { site } from "@/config/site";
import { services } from "@/data/services";
import { localePath, type Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { legalHref, type SectionId } from "@/i18n/routes";
import { ArrowUpIcon, socialIcons } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

const navIds: SectionId[] = ["brzmienia", "o-nas", "uslugi", "realizacje", "cennik", "rezerwacja", "faq"];

/** SEKCJA 9 – stopka jako panel rack 19": śruby, linia sygnału, diody. */
export function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const f = t.footer;
  const home = localePath(lang, "/");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.rack}>
          <span className={`${styles.screw} ${styles.tl}`} aria-hidden="true" />
          <span className={`${styles.screw} ${styles.tr}`} aria-hidden="true" />
          <span className={`${styles.screw} ${styles.bl}`} aria-hidden="true" />
          <span className={`${styles.screw} ${styles.br}`} aria-hidden="true" />

          <div className={styles.top}>
            <div className={styles.brand}>
              <Logo size="lg" uid="logo-ftr" />
              <p className={styles.tagline}>{f.tagline}</p>
            </div>
            <div className={styles.status}>
              <span className={styles.led} aria-hidden="true" />
              {f.status}
              <span className={styles.meter} aria-hidden="true">
                {Array.from({ length: 16 }, (_, i) => (
                  <span key={i} data-level={i < 10 ? "ok" : i < 13 ? "warm" : "hot"} data-lit={i < 11 || undefined} />
                ))}
              </span>
            </div>
          </div>

          {/* linia sygnału ze szczeliną */}
          <svg className={styles.signal} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 20 H520 C 540 20, 545 4, 560 4 S 580 36, 595 36 S 615 8, 630 8 S 650 28, 665 20 H1200" />
          </svg>

          <div className={styles.cols}>
            <nav aria-label={f.nav}>
              <h2 className={styles.colTitle}>{f.nav}</h2>
              <ul role="list">
                {navIds.map((id) => (
                  <li key={id}>
                    <a href={`${home}#${id}`}>{t.nav.items[id]}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className={styles.colTitle}>{f.services}</h2>
              <ul role="list">
                {services.map((s) => (
                  <li key={s.id}>
                    <a href={`${home}#uslugi`}>{s.name[lang]}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={styles.colTitle}>{f.contact}</h2>
              <ul role="list">
                <li>
                  <a href={site.contact.phoneHref}>{site.contact.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </li>
                <li>
                  <address>
                    {site.address.street}, {site.address.postalCode} {site.address.city}
                  </address>
                </li>
              </ul>
              <ul role="list" className={styles.social} aria-label={f.social}>
                {site.social.map((s) => {
                  const Icon = socialIcons[s.id];
                  return (
                    <li key={s.id}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                          <Icon size={18} />
                        </a>
                      ) : (
                        <span title={fmt(t.contact.socialPending, { name: s.label })}>
                          <Icon size={18} />
                          <span className="sr-only">{fmt(t.contact.socialPending, { name: s.label })}</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2 className={styles.colTitle}>{f.legal}</h2>
              <ul role="list">
                <li>
                  <a href={legalHref(lang, "privacy")}>{f.privacy}</a>
                </li>
                <li>
                  <a href={legalHref(lang, "cookies")}>{f.cookies}</a>
                </li>
                <li>
                  <a href={legalHref(lang, "terms")}>{f.terms}</a>
                </li>
                <li>
                  <a href={legalHref(lang, "booking")}>{f.bookingTerms}</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.bottom}>
            <p>{fmt(f.copyright, { year })}</p>
            <p className={styles.credits}>{f.credits}</p>
            <a href="#main" className={styles.top2}>
              <ArrowUpIcon size={16} />
              {f.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

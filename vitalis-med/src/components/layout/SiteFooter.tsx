import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icons";
import { legalNav, mainNav, siteConfig } from "@/config/site";
import { services } from "@/data/services";

export function SiteFooter() {
  const { contact } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-graphite text-white/75">
      <div className="container-x grid gap-12 pb-14 pt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label={`${siteConfig.name} – strona główna`} className="inline-block">
            <Logo tone="dark" withTagline className="h-14 w-auto" />
          </Link>
          <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed">
            Prywatne pogotowie ratunkowe: transport sanitarny i medyczny, przewozy pacjentów leżących, zabezpieczenie medyczne wydarzeń oraz obsługa
            placówek medycznych i instytucji.
          </p>
          <div className="mt-8 rounded-[6px] border border-white/12 p-5">
            <p className="text-sm font-semibold text-white">Usługi prywatne i świadczenia NFZ</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Usługi komercyjne realizujemy odpłatnie według cennika. Świadczenia finansowane przez NFZ wykonujemy wyłącznie w zakresie zawartej umowy i na
              podstawie zlecenia lekarza.{" "}
              <Link href="/nfz" className="link-quiet text-white">
                Zasady NFZ
              </Link>
            </p>
          </div>
        </div>

        <nav aria-labelledby="footer-nav" className="lg:col-span-2">
          <h2 id="footer-nav" className="text-sm font-semibold uppercase tracking-[0.14em] text-white" style={{ fontFamily: "var(--font-sans)" }}>
            Na skróty
          </h2>
          <ul className="mt-5 space-y-2.5 text-[0.98rem]">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services" className="lg:col-span-3">
          <h2 id="footer-services" className="text-sm font-semibold uppercase tracking-[0.14em] text-white" style={{ fontFamily: "var(--font-sans)" }}>
            Usługi
          </h2>
          <ul className="mt-5 space-y-2.5 text-[0.98rem]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/uslugi#${s.slug}`} className="transition-colors hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white" style={{ fontFamily: "var(--font-sans)" }}>
            Kontakt
          </h2>
          <ul className="mt-5 space-y-4 text-[0.98rem]">
            <li>
              <a href={contact.phoneHref} className="group flex items-start gap-3">
                <Icon name="phone" size={20} className="mt-0.5 shrink-0 text-[#ff4d55]" />
                <span>
                  <span className="block font-display text-xl font-semibold text-white group-hover:underline" style={{ fontStretch: "92%" }}>
                    {contact.phoneDisplay}
                  </span>
                  <span className="text-sm text-white/60">Dyspozytornia 24/7</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-start gap-3 break-all hover:text-white">
                <Icon name="mail" size={20} className="mt-0.5 shrink-0 text-white/50" />
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="pin" size={20} className="mt-0.5 shrink-0 text-white/50" />
              <address className="not-italic">
                {contact.street}
                <br />
                {contact.postalCode} {contact.city}
              </address>
            </li>
            <li className="flex items-start gap-3 text-sm text-white/60">
              <Icon name="alert" size={20} className="shrink-0 text-[#ff4d55]" />
              W stanie zagrożenia życia dzwoń 112 lub 999.
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-5 py-7 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Dokumenty">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>
            © {year} {siteConfig.name}. Projekt demonstracyjny – dane przykładowe.
          </p>
        </div>
      </div>
    </footer>
  );
}

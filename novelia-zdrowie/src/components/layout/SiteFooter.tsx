import Link from "next/link";
import { legalNav, seller } from "@/config/site";
import { Filled } from "@/components/legal/Pending";
import { CardIcon, DownloadIcon, LockIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-cream/85">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-cream/70">
            Wydawnictwo cyfrowe o zdrowym odżywianiu. Przystępna wiedza i praktyczne przepisy na co dzień.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-cream/70">
            <li className="flex items-center gap-3">
              <LockIcon size={18} className="text-gold" /> Bezpieczne płatności online
            </li>
            <li className="flex items-center gap-3">
              <DownloadIcon size={18} className="text-gold" /> Plik PDF do pobrania po opłaceniu
            </li>
            <li className="flex items-center gap-3">
              <CardIcon size={18} className="text-gold" /> Karta, BLIK, szybki przelew*
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow !text-sage">Kontakt</h2>
          <address className="mt-5 space-y-2 text-[0.95rem] not-italic leading-relaxed">
            <p>
              <Filled value={seller.name} label="nazwa sprzedawcy" tone="dark" />
            </p>
            <p>
              <Filled value={seller.address} label="adres" tone="dark" />
            </p>
            <p>
              E-mail:{" "}
              {seller.email ? (
                <a href={`mailto:${seller.email}`} className="link">
                  {seller.email}
                </a>
              ) : (
                <Filled value="" label="e-mail" tone="dark" />
              )}
            </p>
            {seller.phone && <p>Tel.: {seller.phone}</p>}
          </address>
          <Link href="/kontakt" className="link mt-5 inline-block text-sm text-gold-soft">
            Formularz kontaktowy
          </Link>
        </div>

        <nav aria-label="Dokumenty i informacje" className="md:col-span-5">
          <h2 className="eyebrow !text-sage">Informacje</h2>
          <ul className="mt-5 grid gap-x-8 gap-y-3 text-[0.95rem] sm:grid-cols-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link inline-flex min-h-8 items-center text-cream/85 hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/pobieranie" className="link inline-flex min-h-8 items-center text-cream/85 hover:text-cream">
                Ponowne pobranie pliku
              </Link>
            </li>
            <li>
              <Link href="/sklep" className="link inline-flex min-h-8 items-center text-cream/85 hover:text-cream">
                Sklep
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NOVELIA ZDROWIE. Wszelkie prawa zastrzeżone.</p>
          <p>* Dostępne metody płatności zależą od konfiguracji operatora płatności. Publikacje mają charakter edukacyjny.</p>
        </div>
      </div>
    </footer>
  );
}

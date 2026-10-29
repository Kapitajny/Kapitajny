import Link from "next/link";
import { bakeryLocations, morelowa, morelowaNav } from "@/data/morelowa";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-linia-ciemna bg-braz">
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-[24rem] text-[0.95rem] text-mgla">
            Rodzinna piekarnia i cukiernia od 1991 roku. Codzienne pieczywo, chleb na zakwasie, torty i desery przygotowywane ręcznie — w Grodzisku
            Mazowieckim i w Warszawie.
          </p>
          <p className="mt-6 font-serif text-[1.1rem] text-krem italic">{morelowa.tagline}</p>
        </div>

        <nav aria-label="Na skróty" className="lg:col-span-3 lg:col-start-6">
          <h2 className="font-sans text-[0.7rem] font-semibold tracking-[0.26em] text-zloto uppercase">Na skróty</h2>
          <ul className="mt-5 space-y-2.5">
            {morelowaNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="podkreslenie text-[0.95rem] text-krem">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="font-sans text-[0.7rem] font-semibold tracking-[0.26em] text-zloto uppercase">Nasze lokale</h2>
          <ul className="mt-5 space-y-5">
            {bakeryLocations.map((location) => (
              <li key={location.id}>
                <p className="font-serif text-[1.45rem] leading-tight text-krem">
                  {location.city} <span className="font-sans text-[0.72rem] tracking-[0.16em] text-mgla uppercase">{location.since}</span>
                </p>
                <address className="mt-1 text-[0.92rem] text-mgla">
                  {location.street}, {location.postalCode}
                </address>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.8rem] text-mgla">Adresy demonstracyjne — marka jest fikcyjna.</p>
        </div>
      </div>

      <div className="border-t border-linia-ciemna">
        <div className="shell flex flex-col gap-4 py-7 text-[0.8rem] text-mgla lg:flex-row lg:items-center lg:justify-between">
          <p>{morelowa.demoNotice}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p>Website concept by ComputerIT · koncepcja 2</p>
            <Link href="/morelowa" prefetch={false} className="text-krem underline underline-offset-4 hover:text-zloto">
              Zobacz koncepcję 1
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

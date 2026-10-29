import Link from "next/link";
import { bakeryLocations, morelowa, morelowaNav } from "@/data/morelowa";

export function Footer() {
  return (
    <footer className="on-dark bg-braz text-krem">
      <div className="wrap pt-16 lg:pt-20">
        {/* Duży wordmark – podpis marki na całą szerokość */}
        <a href="#start" aria-label="Morelowa – wróć na początek strony" className="block">
          <span aria-hidden="true" className="block text-center font-serif text-[clamp(2.6rem,12vw,12.5rem)] leading-[0.85] tracking-[0.06em]">
            MORELOWA
          </span>
          <span aria-hidden="true" className="mt-4 block text-center text-[0.62rem] font-medium tracking-[0.42em] text-zloto sm:text-[0.72rem]">
            PIEKARNIA • CUKIERNIA • OD 1991
          </span>
        </a>

        <div className="mt-16 grid gap-12 border-t border-krem/15 pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <p className="max-w-[24rem] text-[0.98rem] text-krem/80 sm:col-span-2 lg:col-span-1">
            Rodzinna piekarnia i cukiernia od 1991 roku. Codzienne pieczywo, chleb na zakwasie, torty i desery przygotowywane ręcznie — w Grodzisku
            Mazowieckim i w Warszawie.
          </p>

          <nav aria-label="Na skróty">
            <h2 className="font-sans text-[0.7rem] font-medium tracking-[0.26em] text-zloto uppercase">Na skróty</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {morelowaNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[0.95rem] text-krem/85 underline-offset-4 hover:text-krem hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-[0.7rem] font-medium tracking-[0.26em] text-zloto uppercase">Nasze lokale</h2>
            <ul className="mt-5 space-y-5">
              {bakeryLocations.map((location) => (
                <li key={location.id}>
                  <p className="font-serif text-[1.4rem] leading-tight">{location.city}</p>
                  <address className="mt-1 text-[0.92rem] text-krem/75">
                    {location.street}, {location.postalCode}
                  </address>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.8rem] text-krem/60">Adresy demonstracyjne — marka jest fikcyjna.</p>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-krem/15">
        <div className="wrap flex flex-col gap-4 py-7 text-[0.8rem] text-krem/65 lg:flex-row lg:items-center lg:justify-between">
          <p>{morelowa.demoNotice}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p>Website concept by ComputerIT · koncepcja 2</p>
            <Link href="/morelowa" prefetch={false} className="text-krem/85 underline underline-offset-4 hover:text-krem">
              Zobacz koncepcję 1
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

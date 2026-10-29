import { bakeryLocations, morelowa, morelowaNav } from "@/data/morelowa";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="on-dark bg-braz text-krem">
      <div className="container-m grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-[22rem] text-[0.92rem] text-krem/75">
            Rodzinna piekarnia i cukiernia od 1991 roku. Codzienne pieczywo, chleb na zakwasie, torty i desery przygotowywane ręcznie — w Grodzisku
            Mazowieckim i w Warszawie.
          </p>
        </div>

        <nav aria-label="Na skróty" className="lg:col-span-3 lg:col-start-6">
          <h2 className="font-sans text-[0.7rem] font-semibold tracking-[0.24em] text-zloto uppercase">Na skróty</h2>
          <ul className="mt-5 space-y-2.5">
            {morelowaNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-line text-[0.92rem] text-krem/85 hover:text-krem">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="font-sans text-[0.7rem] font-semibold tracking-[0.24em] text-zloto uppercase">Nasze lokale</h2>
          <ul className="mt-5 space-y-6">
            {bakeryLocations.map((location) => (
              <li key={location.id}>
                <p className="font-serif text-[1.35rem] leading-tight">
                  {location.city} <span className="font-sans text-[0.72rem] tracking-[0.16em] text-krem/60 uppercase">{location.since}</span>
                </p>
                <address className="mt-1 text-[0.9rem] text-krem/75">
                  {location.street}, {location.postalCode}
                </address>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.78rem] text-krem/60">Adresy demonstracyjne — marka jest fikcyjna.</p>
        </div>
      </div>

      <div className="border-t border-krem/15">
        <div className="container-m flex flex-col gap-4 py-7 text-[0.78rem] text-krem/65 lg:flex-row lg:items-center lg:justify-between">
          <p>{morelowa.demoNotice}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <p>Website concept by ComputerIT</p>
            <a href="#start" className="link-line text-krem/85 hover:text-krem">
              Wróć na górę ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { company } from "@/content/company";
import { Photo } from "@/components/ui/Photo";

const routes = [
  { href: "/siec-sprzedazy", who: "Kupuję do domu", what: "Hurtownie i sklepy firmowe" },
  { href: "/dla-biznesu", who: "Prowadzę firmę", what: "Oferta dla hurtu, gastronomii i stołówek" },
  { href: "/dla-biznesu#hodowcy", who: "Hoduję trzodę lub bydło", what: "Skontaktuj się z Działem Skupu Żywca" },
  { href: "/kariera", who: "Szukam pracy", what: "Produkcja, magazyn, sklepy firmowe" },
];

/**
 * Sekcja otwierająca w wariancie „Marka”: szerokie zdjęcie produktu na łupku i czerwony panel z hasłem –
 * jak czerwone pasy z białym tekstem na okładkach katalogów firmy.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="container-x pb-14 pt-6 lg:pb-20 lg:pt-10">
        <div className="relative lg:grid lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate sm:aspect-[16/9] lg:col-span-8 lg:col-start-5 lg:aspect-[16/10]">
            <Photo media="hero" sizes="(min-width: 1024px) 64vw, 100vw" preload tone="dark" />
          </div>

          <div className="relative z-[1] -mt-14 bg-red px-6 pb-8 pt-7 text-on-dark sm:mx-8 sm:-mt-20 sm:px-10 sm:pb-10 sm:pt-9 lg:absolute lg:left-0 lg:top-1/2 lg:mx-0 lg:mt-0 lg:w-[50%] lg:-translate-y-1/2 lg:px-12 lg:py-12">
            <p className="hero-fade">
              <span className="ribbon">Rodzinny zakład od {company.foundedYear}</span>
            </p>
            <h1 id="hero-title" className="display-xl mt-6 text-on-dark">
              <span className="hero-line" style={{ ["--i" as string]: 0 }}>
                Smak, który
              </span>
              <span className="hero-line" style={{ ["--i" as string]: 1 }}>
                ma swoje korzenie.
              </span>
            </h1>
            <p className="hero-fade lead mt-6 max-w-[32rem] text-on-dark/90">
              Ubój, rozbiór i przetwórstwo mięsa w zakładzie w Płudach. Mięso, wędliny i wyroby garmażeryjne trafiają do sklepów firmowych i
              odbiorców hurtowych.
            </p>
            <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/produkty" className="btn btn-light">
                Poznaj naszą ofertę
              </Link>
              <Link href="/dla-biznesu" className="btn btn-outline-light">
                Współpraca handlowa
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Na skróty" className="border-y border-line bg-surface">
        <ul className="container-x grid sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r, i) => (
            <li
              key={r.href}
              className={`border-line ${i > 0 ? "border-t sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""} ${i === 2 ? "sm:border-t lg:border-t-0 lg:border-l" : ""} ${i === 3 ? "sm:border-t lg:border-t-0" : ""}`}
            >
              <Link href={r.href} className="group flex h-full flex-col gap-1 py-5 transition-colors sm:px-5 lg:py-6">
                <span className="display-sm text-[1.25rem] group-hover:text-red">{r.who}</span>
                <span className="ui text-[0.9375rem] text-muted">{r.what}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

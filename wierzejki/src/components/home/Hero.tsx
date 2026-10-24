import Link from "next/link";
import { company } from "@/content/company";
import { Photo } from "@/components/ui/Photo";
import { Seal } from "@/components/ui/Seal";

const routes = [
  { href: "/siec-sprzedazy", who: "Kupuję do domu", what: "Znajdź hurtownię lub sklep firmowy" },
  { href: "/dla-biznesu", who: "Prowadzę firmę", what: "Oferta dla hurtu, gastronomii i stołówek" },
  { href: "/dla-biznesu#hodowcy", who: "Hoduję trzodę lub bydło", what: "Skontaktuj się z Działem Skupu Żywca" },
  { href: "/kariera", who: "Szukam pracy", what: "Produkcja, magazyn, sklepy firmowe" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid gap-10 pb-14 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-14">
        <div className="flex flex-col justify-center lg:col-span-7 lg:pr-6">
          <p className="hero-fade ui text-[0.9375rem] font-medium text-muted">
            Rodzinny zakład mięsny z Płud na Lubelszczyźnie
          </p>
          <h1 id="hero-title" className="display-xl mt-5 text-ink">
            <span className="hero-line" style={{ ["--i" as string]: 0 }}>
              Smak, który
            </span>
            <span className="hero-line" style={{ ["--i" as string]: 1 }}>
              ma swoje
            </span>
            <span className="hero-line text-red" style={{ ["--i" as string]: 2 }}>
              korzenie.
            </span>
          </h1>
          <p className="hero-fade lead mt-8 max-w-[34rem] text-ink/85">
            Od {company.foundedYear} roku zajmujemy się ubojem, rozbiorem i przetwórstwem mięsa. Z zakładu w Płudach mięso, wędliny i wyroby
            garmażeryjne trafiają do sklepów firmowych i do odbiorców hurtowych.
          </p>
          <div className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/produkty" className="btn btn-red">
              Poznaj naszą ofertę
            </Link>
            <Link href="/dla-biznesu" className="btn btn-outline">
              Współpraca handlowa
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative ml-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden bg-linen lg:max-w-none">
            <Photo media="hero" sizes="(min-width: 1024px) 38vw, 100vw" preload tone="dark" />
          </div>
          <Seal className="hero-fade absolute -left-2 -top-8 w-36 rotate-[-8deg] sm:w-44 lg:-left-20 lg:top-12 lg:w-52" />
        </div>
      </div>

      <nav aria-label="Na skróty" className="border-y border-line bg-surface">
        <ul className="container-x grid sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((r, i) => (
            <li key={r.href} className={`border-line ${i > 0 ? "border-t sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""} ${i === 2 ? "sm:border-t lg:border-t-0 lg:border-l" : ""} ${i === 3 ? "sm:border-t lg:border-t-0" : ""}`}>
              <Link href={r.href} className="group flex h-full flex-col gap-1 py-5 transition-colors sm:px-5 lg:py-6">
                <span className="display-sm text-[1.25rem] group-hover:text-red">{r.who}</span>
                <span className="ui text-[0.875rem] text-muted">{r.what}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

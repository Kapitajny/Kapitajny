import { siteConfig } from "@/config/site";
import { CONDITION_GROUPS } from "@/data/conditions";
import { BookingLink } from "@/components/ui/BookingLink";

const STRENGTHS = [
  { title: "Indywidualne podejście", text: "Na pierwszej wizycie mamy czas, żeby wysłuchać, z czym przychodzisz." },
  { title: "Plan terapii dopasowany do potrzeb", text: "Ćwiczenia i tempo dobieramy do tego, co możesz dziś zrobić." },
  { title: "Jasne zasady współpracy", text: "Przed rozpoczęciem terapii wiesz, ile potrwa wizyta i ile kosztuje." },
];

/**
 * Hero zaczyna od pytania, z którym pacjent wchodzi na stronę: „co mnie boli?”.
 * Lista okolic ciała prowadzi prosto do opisu w sekcji „Z czym możesz przyjść?”.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="container-x grid gap-12 pb-14 pt-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20 lg:pb-20 lg:pt-20">
        <div>
          <h1 id="hero-title" className="h1 max-w-[13ch]">
            Odzyskaj swobodę ruchu. Zadbaj o siebie.
          </h1>
          <p className="mt-6 max-w-xl text-[1.2rem] leading-relaxed text-graphite">
            Indywidualnie dopasowana rehabilitacja i fizjoterapia, które wspierają powrót do sprawności i pomagają zadbać o komfort codziennego życia.
            {siteConfig.city ? ` Gabinet w ${siteConfig.city}.` : ""}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BookingLink />
            <a href="#uslugi" className="btn btn-outline">
              Poznaj nasze usługi
            </a>
          </div>
        </div>

        <nav aria-labelledby="hero-regions" className="hidden lg:block lg:pt-3">
          <h2 id="hero-regions" className="font-sans text-xl font-bold tracking-normal">
            Co Ci dolega?
          </h2>
          <ul className="mt-3 border-t border-graphite/20">
            {CONDITION_GROUPS.map((group) => (
              <li key={group.id} className="border-b border-graphite/20">
                <a
                  href={`#dolegliwosci-${group.id}`}
                  className="group flex min-h-12 items-center justify-between gap-4 py-2.5 text-[1.05rem] text-ink hover:text-forest"
                >
                  {group.label}
                  <span aria-hidden="true" className="text-sm text-muted group-hover:text-forest">
                    zobacz
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ul className="container-x grid gap-8 pb-12 md:grid-cols-3 md:gap-10 lg:pb-16">
        {STRENGTHS.map((item) => (
          <li key={item.title}>
            <p className="font-bold text-ink">{item.title}</p>
            <p className="mt-1 text-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

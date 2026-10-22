import { siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

const STRENGTHS = [
  { title: "Indywidualne podejście", text: "Czas na rozmowę i uważne wysłuchanie, z czym przychodzisz." },
  { title: "Plan terapii dopasowany do potrzeb", text: "Ćwiczenia i tempo dobrane do Twoich możliwości i celów." },
  { title: "Jasne zasady współpracy", text: "Wiesz, co robimy, dlaczego i ile to kosztuje – bez niedomówień." },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pb-16 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow rise">Gabinet rehabilitacji i fizjoterapii{siteConfig.city ? ` · ${siteConfig.city}` : ""}</p>
          <h1 id="hero-title" className="display-1 rise mt-6" style={{ ["--rise-delay" as string]: "80ms" }}>
            Odzyskaj swobodę ruchu. <em className="italic text-forest">Zadbaj o siebie.</em>
          </h1>
          <p className="lead rise mt-7 max-w-xl" style={{ ["--rise-delay" as string]: "160ms" }}>
            Indywidualnie dopasowana rehabilitacja i fizjoterapia, które wspierają powrót do sprawności i pomagają zadbać o komfort codziennego życia.
          </p>
          <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--rise-delay" as string]: "240ms" }}>
            <BookingLink />
            <a href="#uslugi" className="btn btn-secondary">
              Poznaj nasze usługi <ArrowRightIcon size={18} />
            </a>
          </div>
        </div>

        <div className="rise relative lg:col-span-6 xl:col-span-5 xl:col-start-8" style={{ ["--rise-delay" as string]: "200ms" }}>
          {/* Szałwiowe tło przesunięte względem zdjęcia */}
          <div aria-hidden="true" className="arch absolute -right-4 top-8 bottom-[-1rem] left-10 bg-sage md:-right-8" />
          <div className="arch relative mx-auto aspect-[1/1.04] w-full max-w-[34rem] overflow-hidden bg-sage">
            <Photo image="hero" preload sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 45vw, 92vw" />
          </div>
        </div>
      </div>

      <div className="border-y border-line bg-paper">
        <ul className="container-x grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {STRENGTHS.map((item, i) => (
            <li key={item.title} className={`flex gap-4 py-6 md:py-8 ${i === 0 ? "md:pr-8" : i === 1 ? "md:px-8" : "md:pl-8"}`}>
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-forest" />
              <div>
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

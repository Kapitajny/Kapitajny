import Link from "next/link";
import { recognitions } from "@/content/history";
import { productionSteps } from "@/content/production";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: "Jakość i produkcja",
  description:
    "Jak pracuje Zakład Mięsny Wierzejki w Płudach: rzeźnia trzody i bydła, rozbiór, przetwórstwo wędlin i garmażerki oraz sprzedaż w jednym zakładzie.",
  path: "/jakosc-i-produkcja",
});

export default function QualityPage() {
  return (
    <>
      <PageIntro
        variant="split"
        media="production"
        crumbs={[{ href: "/jakosc-i-produkcja", label: "Jakość i produkcja" }]}
        title="Cały proces pod jednym dachem"
        lead={
          <p>
            Ubój, rozbiór i przetwórstwo odbywają się w zakładzie w Płudach. Każdy etap prowadzi ten sam zakład – od przyjęcia żywca po
            wydanie gotowych wyrobów.
          </p>
        }
      />

      <section aria-label="Etapy produkcji">
        {productionSteps.map((step, i) => (
          <article key={step.id} className={`border-b border-line ${i % 2 === 1 ? "bg-surface" : ""}`}>
            <div className="container-x grid gap-6 py-14 md:grid-cols-12 md:items-baseline lg:py-20">
              <p
                aria-hidden="true"
                className="text-[clamp(4rem,3rem+5vw,8rem)] font-extrabold leading-[0.85] text-red md:col-span-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {i + 1}
              </p>
              <div className="md:col-span-4">
                <h2 className="display-lg">
                  <span className="sr-only">Etap {i + 1}: </span>
                  {step.name}
                </h2>
                <p className="ui mt-3 text-[0.9375rem] font-medium text-muted">{step.building}</p>
              </div>
              <p className="lead md:col-span-5 md:col-start-8">{step.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="wedzarnia" className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="grid grid-cols-2 gap-4 lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-linen">
              <Photo media="whiteSausage" sizes="(min-width: 1024px) 24vw, 50vw" />
            </div>
            <div className="relative mt-12 aspect-[4/5] overflow-hidden bg-linen">
              <Photo media="aboutCraft" sizes="(min-width: 1024px) 24vw, 50vw" />
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 id="wedzarnia" className="display-lg">
              Ludzie i rzemiosło
            </h2>
            <p className="mt-5">
              Za każdym etapem stoją pracownicy zakładu – rozbieracze, wykrawacze, jeliciarze, magazynierzy i kierowcy. To ich praca decyduje
              o tym, jak wyglądają wyroby na ladzie.
            </p>
            <Link href="/kariera" className="btn btn-outline mt-8">
              Praca w Wierzejkach
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="wyroznienia-jakosc" className="on-dark bg-green py-20 text-on-dark lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="wyroznienia-jakosc" className="display-lg lg:col-span-4">
            Wyróżnienia
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {recognitions.map((r) => (
              <li key={r.title} className="border-t border-on-dark/25 pt-4">
                <p className="display-sm">{r.title}</p>
                {r.year && <p className="ui mt-1 text-[0.875rem] text-on-dark/90">{r.year}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {siteConfig.demoMode && (
        <section aria-labelledby="do-uzupelnienia" className="py-16 lg:py-20">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <h2 id="do-uzupelnienia" className="display-md lg:col-span-4">
              Miejsce na systemy jakości
            </h2>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="border border-dashed border-linen-deep bg-surface p-6">
                <p>
                  Ta sekcja jest przygotowana na informacje, które może potwierdzić wyłącznie firma: wdrożone systemy jakości i bezpieczeństwa
                  żywności, certyfikaty, nadzór weterynaryjny i audyty odbiorców.
                </p>
                <p className="mt-3 text-muted">Do czasu ich otrzymania koncepcja celowo nie wymienia żadnych certyfikatów ani parametrów.</p>
              </div>
              <DemoNote className="mt-6">Sekcja jest widoczna tylko w trybie demonstracyjnym.</DemoNote>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

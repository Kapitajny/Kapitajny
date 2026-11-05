import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PricingCards, PricingNote } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { ServicesOverview } from "@/components/sections/Services";
import { Faq, FaqJsonLd } from "@/components/ui/Faq";
import { ArrowRight } from "@/components/ui/Icons";
import { PageHero, SectionHeading } from "@/components/ui/SectionHeading";
import { generalFaq } from "@/data/faq";

export const metadata: Metadata = {
  title: "Usługi – strony i sklepy internetowe",
  description: "Projektowanie i tworzenie stron internetowych od 1 300 zł netto oraz sklepów internetowych od 2 000 zł netto. Zakres, proces i cennik.",
  alternates: { canonical: "/uslugi" },
};

const included = [
  { title: "Projekt pod Twoją markę", text: "Układ, kolory i typografia dobrane do firmy i jej klientów – bez gotowych szablonów." },
  { title: "Responsywność", text: "Każdy widok sprawdzamy na telefonie, tablecie i komputerze." },
  { title: "Podstawowe SEO", text: "Tytuły i opisy stron, poprawna struktura nagłówków, mapa strony i dane dla wyszukiwarek." },
  { title: "Dostępność", text: "Czytelny kontrast, obsługa klawiatury i opisy dla czytników ekranu." },
  { title: "Wydajność", text: "Zoptymalizowane obrazy i lekki kod, żeby strona szybko się ładowała." },
  { title: "Wdrożenie", text: "Uruchomienie strony pod uzgodnionym adresem i przekazanie dostępów." },
];

const individual = [
  "Domena i hosting",
  "Płatne licencje, wtyczki i usługi zewnętrzne",
  "Integracje (np. płatności online, systemy magazynowe, wysyłki)",
  "Przygotowanie tekstów i zdjęć",
  "Dodatkowe podstrony i funkcje spoza ustalonego zakresu",
  "Opieka techniczna po wdrożeniu",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Usługi"
        title="Strony i sklepy internetowe, które sprzedają Twoją ofertę"
        lead="Robimy dwie rzeczy i robimy je dokładnie: strony internetowe dla firm oraz sklepy online. Każdy projekt zaczyna się od rozmowy o Twoich klientach."
      >
        <Link href="/kontakt" className="btn btn-primary">
          Porozmawiajmy o projekcie
          <ArrowRight />
        </Link>
        <Link href="/realizacje" className="btn btn-secondary">
          Zobacz realizacje
        </Link>
      </PageHero>

      <section className="section container-x" aria-labelledby="kategorie">
        <SectionHeading eyebrow="Kategorie" id="kategorie" title="Wybierz, czego potrzebujesz" />
        <div className="mt-12">
          <ServicesOverview />
        </div>
      </section>

      <section className="section border-y border-line bg-white/60" aria-labelledby="w-kazdym">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            eyebrow="W każdym projekcie"
            id="w-kazdym"
            title="Standard, który dostajesz zawsze"
            lead="Niezależnie od tego, czy zamawiasz stronę, czy sklep – te elementy są częścią każdej realizacji."
          />
          <ul className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2">
            {included.map((item) => (
              <li key={item.title} className="reveal bg-white p-6 sm:p-7">
                <h3 className="text-[1.1rem] tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] text-steel">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="indywidualnie">
        <SectionHeading
          eyebrow="Ustalane indywidualnie"
          id="indywidualnie"
          title="Uczciwie o tym, czego cena nie obejmuje"
          lead="Te elementy zależą od projektu i Twoich potrzeb. Omawiamy je przy wycenie, żeby nic nie zaskoczyło Cię później."
        />
        <ul className="ticks reveal grid content-start gap-4 text-[1.025rem] sm:grid-cols-2">
          {individual.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section border-y border-line bg-white/60" aria-labelledby="proces">
        <div className="container-x">
          <SectionHeading eyebrow="Proces" id="proces" title="Jak pracujemy" align="center" />
          <div className="mt-14">
            <Process />
          </div>
        </div>
      </section>

      <section className="on-dark relative overflow-hidden bg-ink text-white" aria-labelledby="cennik">
        <div className="grid-bg-dark fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="section container-x relative">
          <SectionHeading eyebrow="Cennik" id="cennik" title="Ceny od początku na stole" />
          <div className="mt-12">
            <PricingCards />
          </div>
          <PricingNote />
        </div>
      </section>

      <section className="section container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="faq">
        <SectionHeading eyebrow="Pytania" id="faq" title="Najczęstsze pytania" />
        <Faq items={generalFaq} />
        <FaqJsonLd items={generalFaq} />
      </section>

      <CtaBand secondary={{ href: "/realizacje", label: "Zobacz realizacje" }} />
    </>
  );
}

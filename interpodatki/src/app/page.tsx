import type { Metadata } from "next";
import Link from "next/link";
import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { HeroPanel } from "@/components/home/HeroPanel";
import { CtaBand } from "@/components/ui/CtaBand";
import { Faq } from "@/components/ui/Faq";
import {
  IconArrowRight,
  IconBuilding,
  IconChart,
  IconChat,
  IconLedger,
  IconPeople,
  IconScale,
  IconShield,
} from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/Section";
import { serviceNav } from "@/config/site";
import { generalFaq } from "@/data/faq";
import { formatPLN } from "@/lib/format";
import { packages } from "@/lib/pricing/packages";

export const metadata: Metadata = {
  title: { absolute: "InterPodatki – księgowość, która nadąża za Twoim biznesem (demo)" },
  description:
    "Księgowość JDG i spółek, obsługa podatkowa, kadry i płace. Dopasuj zakres współpracy i sprawdź szacunkowy miesięczny abonament. Projekt demonstracyjny.",
  alternates: { canonical: "/" },
};

const serviceIcons = [IconLedger, IconBuilding, IconScale, IconPeople];
const serviceSummaries = [
  "Ewidencja przychodów i kosztów, rozliczenia VAT i bieżący kontakt dla jednoosobowych działalności.",
  "Pełna księgowość spółek, zamknięcia miesięcy i współpraca przy sprawozdawczości.",
  "Wsparcie uprawnionego doradcy w sprawach wymagających analizy i opinii.",
  "Listy płac, dokumentacja pracownicza i rozliczenia związane z zatrudnieniem.",
];

const monthlyCycle = [
  { title: "Przekazujesz dokumenty", text: "Faktury, rachunki i wyciągi trafiają do biura uzgodnionym kanałem – w ustalonym rytmie." },
  { title: "Księgujemy i weryfikujemy", text: "Sprawdzamy kompletność, dopytujemy o brakujące dokumenty i prowadzimy ewidencję." },
  { title: "Przygotowujemy rozliczenia", text: "Rozliczenia i deklaracje w zakresie umowy, z informacją o kwotach do zapłaty." },
  { title: "Dostajesz zestawienie", text: "Krótkie podsumowanie miesiąca: przychody, koszty i sprawy wymagające decyzji." },
];

const benefits = [
  {
    icon: IconChat,
    title: "Jedna osoba kontaktowa",
    text: "Wiesz, do kogo napisać. Opiekun zna historię Twojej firmy i nie musisz tłumaczyć wszystkiego od nowa.",
  },
  {
    icon: IconChart,
    title: "Przewidywalny koszt",
    text: "Abonament wynika z jawnych parametrów: liczby dokumentów, pracowników i zakresu usług. Widzisz, co wpływa na cenę.",
  },
  {
    icon: IconScale,
    title: "Jasny podział odpowiedzialności",
    text: "Oddzielamy bieżącą księgowość od doradztwa podatkowego, które świadczy wyłącznie osoba z uprawnieniami.",
  },
  {
    icon: IconShield,
    title: "Uporządkowany obieg dokumentów",
    text: "Ustalony kanał przekazywania dokumentów i ich statusy – zamiast rozproszonych wiadomości.",
  },
];

const onboarding = [
  { title: "Sprawdzasz szacunek", text: "Kalkulator pokazuje orientacyjny abonament i proponowany pakiet." },
  { title: "Rozmowa o zakresie", text: "Ustalamy formę opodatkowania, liczbę dokumentów i potrzeby kadrowe." },
  { title: "Oferta i umowa", text: "Otrzymujesz ofertę z zakresem usług. Po akceptacji podpisujemy umowę." },
  { title: "Przejęcie dokumentacji", text: "Konfigurujemy obieg dokumentów i przejmujemy dokumentację od poprzedniego biura." },
  { title: "Pierwszy miesiąc", text: "Pierwsze zamknięcie miesiąca omawiamy wspólnie, żeby dopracować współpracę." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-mist">
        <div className="shell grid gap-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="hero-enter">
            <p className="kicker">Biuro rachunkowe i obsługa podatkowa firm</p>
            <h1 className="mt-4 max-w-[13ch] text-[clamp(2.6rem,1.6rem+4vw,4.6rem)]">
              Księgowość, która nadąża za Twoim biznesem.
            </h1>
            <p className="lede mt-6">
              Od bieżących rozliczeń po kompleksową obsługę finansową przedsiębiorstwa. Dopasuj zakres współpracy do
              swojej firmy i poznaj szacunkowy miesięczny koszt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kalkulator" className="btn btn-primary">
                Oblicz abonament
              </Link>
              <Link href="#uslugi" className="btn btn-outline">
                Poznaj nasze usługi
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted">
              Abonament od {formatPLN(700)} netto miesięcznie. Ceny demonstracyjne.
            </p>
          </div>
          <HeroPanel />
        </div>
      </section>

      {/* Obszary obsługi */}
      <section aria-labelledby="uslugi" className="py-16 sm:py-24">
        <div className="shell">
          <SectionHeader
            id="uslugi"
            title="Obszary obsługi"
            lede="Wybierz obszar, w którym potrzebujesz wsparcia. Zakres każdej usługi ustalamy przed rozpoczęciem współpracy."
          />
          <ul className="mt-12 grid border-t border-line md:grid-cols-2">
            {serviceNav.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <li key={service.href} className="border-b border-line md:odd:border-r md:odd:pr-10 md:even:pl-10">
                  <Link href={service.href} className="group flex gap-5 py-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-sky text-blue-ink">
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-serif text-2xl text-navy group-hover:text-blue-ink">
                        {service.label}
                        <IconArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="mt-1 block text-sm font-medium text-muted">{service.description}</span>
                      <span className="mt-3 block text-ink">{serviceSummaries[index]}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Jak wygląda współpraca */}
      <section aria-labelledby="wspolpraca" className="bg-navy py-16 text-on-navy sm:py-24">
        <div className="shell">
          <div className="max-w-2xl">
            <h2 id="wspolpraca" className="text-white">
              Jak wygląda współpraca w każdym miesiącu
            </h2>
            <p className="mt-4 text-lg">
              Stały rytm pracy sprawia, że wiesz, czego i kiedy się spodziewać. Terminy przekazywania dokumentów
              określamy w umowie.
            </p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {monthlyCycle.map((step, index) => (
              <li key={step.title} className="bg-navy p-6">
                <span className="num font-serif text-3xl text-gold">{index + 1}</span>
                <h3 className="mt-3 font-sans text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kalkulator */}
      <section aria-labelledby="kalkulator" className="bg-mist py-16 sm:py-24">
        <div className="shell">
          <SectionHeader
            id="kalkulator"
            title="Policz orientacyjny abonament"
            lede="Zmieniaj parametry – szacunek aktualizuje się od razu. Pełny kalkulator pokaże rozbicie na usługi."
          />
          <div className="mt-10">
            <QuickCalculator />
          </div>
        </div>
      </section>

      {/* Pakiety */}
      <section aria-labelledby="pakiety" className="py-16 sm:py-24">
        <div className="shell">
          <SectionHeader
            id="pakiety"
            title="Przykładowe pakiety abonamentowe"
            lede="Pięć poziomów obsługi – od podstawowej księgowości po indywidualnie wyceniany zakres dla dużych organizacji."
            action={
              <Link href="/cennik" className="btn btn-outline shrink-0">
                Zobacz pełny cennik
              </Link>
            }
          />
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-panel)] border border-line">
            <table className="num w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">Przykładowe pakiety i ceny wyjściowe</caption>
              <thead className="bg-mist text-sm text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Pakiet
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Dla kogo
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Cena netto / mies.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className={pkg.id === "premium" ? "bg-[#fffdf8]" : undefined}>
                    <th scope="row" className="px-5 py-4 align-top">
                      <span className="font-serif text-xl font-normal text-navy">{pkg.name}</span>
                    </th>
                    <td className="max-w-md px-5 py-4 align-top text-[0.9375rem] text-ink">{pkg.audience}</td>
                    <td className="px-5 py-4 text-right align-top font-semibold whitespace-nowrap text-navy">
                      {pkg.priceFrom === null ? "wycena indywidualna" : `od ${formatPLN(pkg.priceFrom)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Ceny orientacyjne i demonstracyjne. Ostateczna oferta zależy od liczby dokumentów, rodzaju działalności,
            liczby pracowników, formy opodatkowania i zakresu usług.
          </p>
        </div>
      </section>

      {/* Korzyści */}
      <section aria-labelledby="korzysci" className="border-t border-line py-16 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="korzysci">Co zyskujesz, oddając księgowość w uporządkowane ręce</h2>
            <p className="lede mt-4">
              Dobra obsługa księgowa to nie tylko terminowe rozliczenia. To mniej pytań bez odpowiedzi i więcej
              czasu na prowadzenie firmy.
            </p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {benefits.map((b) => (
              <li key={b.title} className="flex gap-5 py-7">
                <b.icon size={24} className="mt-1 shrink-0 text-teal-ink" />
                <div>
                  <h3 className="font-sans text-lg font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-ink">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rozpoczęcie obsługi */}
      <section aria-labelledby="start" className="bg-mist py-16 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <h2 id="start">Jak rozpocząć obsługę</h2>
            <p className="lede mt-4">
              Pięć kroków od pierwszego szacunku do pierwszego zamkniętego miesiąca. Bez zobowiązań na etapie wyceny.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/wycena" className="btn btn-primary">
                Poproś o indywidualną wycenę
              </Link>
            </div>
          </div>
          <ol className="relative space-y-0">
            {onboarding.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                {index < onboarding.length - 1 && (
                  <span aria-hidden="true" className="absolute top-9 left-[1.0625rem] h-[calc(100%-2.25rem)] w-px bg-line-strong" />
                )}
                <span className="num relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy bg-white text-sm font-semibold text-navy">
                  {index + 1}
                </span>
                <div className="pt-1">
                  <h3 className="font-sans text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-ink">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="py-16 sm:py-24">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <h2 id="faq">Najczęstsze pytania</h2>
            <p className="lede mt-4">
              Nie znalazłeś odpowiedzi?{" "}
              <Link href="/kontakt" className="link">
                Napisz do nas
              </Link>{" "}
              lub zajrzyj do{" "}
              <Link href="/baza-wiedzy" className="link">
                bazy wiedzy
              </Link>
              .
            </p>
          </div>
          <Faq items={generalFaq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

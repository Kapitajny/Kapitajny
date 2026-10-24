import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { IconCalculator, IconChat, IconLedger, IconPeople, IconScale, IconShield } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { PageIntro } from "@/components/ui/PageIntro";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "O firmie",
  description:
    "InterPodatki – koncepcja biura rachunkowego, zasady pracy i informacje o projekcie demonstracyjnym przygotowanym przez ComputerIT.",
  path: "/o-nas",
});

const principles = [
  { icon: IconCalculator, title: "Jawna wycena", text: "Cena wynika z parametrów, które klient zna i może sprawdzić w kalkulatorze." },
  { icon: IconChat, title: "Prosty język", text: "Wyjaśniamy rozliczenia bez żargonu i mówimy, co wymaga decyzji klienta." },
  { icon: IconScale, title: "Granice kompetencji", text: "Księgowość, kadry i doradztwo podatkowe mają osobny zakres i osobne uprawnienia." },
  { icon: IconShield, title: "Ochrona danych", text: "Dokumenty firmy przetwarzamy tylko w uzgodnionym celu i bezpiecznymi kanałami." },
];

const roles = [
  { icon: IconLedger, title: "Księgowość", text: "Bieżąca ewidencja, zamknięcia miesięcy i rozliczenia." },
  { icon: IconPeople, title: "Kadry i płace", text: "Listy płac, dokumentacja pracownicza i rozliczenia zatrudnienia." },
  { icon: IconScale, title: "Doradztwo podatkowe", text: "Analizy i opinie – wyłącznie przez osobę z wymaganymi uprawnieniami." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/o-nas", label: "O firmie" }]}
        title="Finanse uporządkowane. Biznes gotowy na więcej."
        lede="InterPodatki to koncepcja biura rachunkowego dla firm, które chcą rozumieć swoje finanse – od jednoosobowych działalności po spółki zatrudniające pracowników."
      />

      <section aria-labelledby="zasady" className="py-16 sm:py-20">
        <div className="shell">
          <h2 id="zasady" className="max-w-2xl">
            Zasady, na których opiera się współpraca
          </h2>
          <ul className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title} className="flex gap-4 border-t border-line pt-6">
                <p.icon size={24} className="mt-1 shrink-0 text-blue-ink" />
                <div>
                  <h3 className="font-sans text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-ink">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="zespol" className="border-t border-line bg-mist py-16 sm:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h2 id="zespol">Zespół</h2>
            <p className="lede mt-4">
              W wersji produkcyjnej w tym miejscu przedstawia się rzeczywiste osoby, ich role oraz – w przypadku doradców
              podatkowych – numery wpisu na listę. W projekcie demonstracyjnym celowo nie podajemy fikcyjnych nazwisk ani
              uprawnień.
            </p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {roles.map((r) => (
              <li key={r.title} className="flex gap-4 py-6">
                <r.icon size={22} className="mt-1 shrink-0 text-teal-ink" />
                <div>
                  <h3 className="font-sans text-lg font-semibold">{r.title}</h3>
                  <p className="mt-1 text-ink">{r.text}</p>
                  <p className="mt-1 text-sm text-muted">Osoby i kwalifikacje: do uzupełnienia.</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="o-projekcie" aria-labelledby="projekt" className="scroll-mt-28 py-16 sm:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h2 id="projekt">O projekcie demonstracyjnym</h2>
            <p className="lede mt-4">
              Serwis przygotował {siteConfig.agency} jako przykład realizacji strony dla biura rachunkowego.
            </p>
          </div>
          <div className="space-y-6">
            <Notice tone="demo" title="InterPodatki nie jest istniejącą firmą">
              Marka, ceny, dane kontaktowe i dokumenty są fikcyjne lub przykładowe. Serwis nie świadczy usług, nie jest
              wpisany do rejestrów i nie posiada uprawnień doradcy podatkowego.
            </Notice>
            <div className="prose-body text-ink">
              <p>Projekt pokazuje działające elementy, które można wdrożyć w prawdziwym serwisie:</p>
              <ul>
                <li>kalkulator abonamentu oparty na konfigurowalnych stawkach,</li>
                <li>wieloetapowy formularz wyceny z walidacją po stronie przeglądarki i serwera,</li>
                <li>proces zamówienia i demonstracyjny checkout bez połączenia z operatorem płatności,</li>
                <li>panel klienta w trybie demonstracyjnym,</li>
                <li>bazę wiedzy z wyszukiwarką i kategoriami.</li>
              </ul>
              <p>
                Zobacz <Link href="/kalkulator">kalkulator</Link> albo przejdź przez{" "}
                <Link href="/zamowienie">zamówienie testowe</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

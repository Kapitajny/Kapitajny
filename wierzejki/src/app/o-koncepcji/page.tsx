import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { MEDIA } from "@/content/media";
import { sources } from "@/content/sources";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { resolveMedia } from "@/components/ui/Photo";
import { ExternalIcon } from "@/components/ui/Icons";

export const metadata = pageMetadata({
  title: "O tej koncepcji",
  description: "Informacja o niezależnej koncepcji redesignu witryny Zakładu Mięsnego Wierzejki przygotowanej przez ComputerIT.",
  path: "/o-koncepcji",
  noindex: true,
});

const pending = [
  "Potwierdzenie przez firmę wszystkich numerów telefonów, adresów e-mail i adresów hurtowni.",
  "Aktualna lista sklepów firmowych z adresami i godzinami otwarcia.",
  "Oficjalny znak firmy w wersji wektorowej (obecnie tymczasowy znak słowny).",
  "Autentyczne zdjęcia zakładu, ludzi i produktów wraz z prawami do publikacji.",
  "Informacje o systemach jakości i certyfikatach, jeśli firma chce je pokazać.",
  "Aktualne ogłoszenia o pracę oraz kontakt do działu kadr.",
  "Podłączenie formularza do skrzynki pocztowej lub systemu zgłoszeń.",
  "Weryfikacja polityki prywatności przez prawnika lub inspektora ochrony danych.",
];

export default function ConceptPage() {
  if (!siteConfig.demoMode) notFound();
  const mediaEntries = Object.entries(MEDIA) as [keyof typeof MEDIA, (typeof MEDIA)[keyof typeof MEDIA]][];

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/o-koncepcji", label: "O tej koncepcji" }]}
        title="Niezależna koncepcja redesignu"
        lead={
          <p>
            Propozycja nowej witryny przygotowana przez {siteConfig.agency.name} z własnej inicjatywy. Firma Wierzejki jej nie zamawiała ani nie
            zatwierdzała.
          </p>
        }
      />

      <div className="container-x space-y-20 py-14 lg:py-20">
        <section aria-labelledby="zalozenia" className="grid gap-8 lg:grid-cols-12">
          <h2 id="zalozenia" className="display-md lg:col-span-4">
            Założenia
          </h2>
          <div className="space-y-4 lg:col-span-7 lg:col-start-6">
            <p>
              Kierunek „Polska tradycja. Nowoczesna produkcja.”: wiśniowa czerwień zarezerwowana dla działań, jałowcowa zieleń dla sekcji
              biznesowych, wąskie nagłówki inspirowane szyldami hal i etykietami skrzynek oraz szeryfowy tekst ciągły.
            </p>
            <p>
              Architektura informacji rozdziela cztery grupy odbiorców: klientów detalicznych, odbiorców hurtowych i gastronomię, hodowców oraz
              kandydatów do pracy. Każda ma własną ścieżkę od pierwszego ekranu.
            </p>
            <p>
              Wszystkie dane pochodzą z publicznych źródeł wymienionych niżej. Gdzie informacji nie dało się potwierdzić, strona pokazuje
              uczciwy szablon zamiast wymyślonej treści.
            </p>
          </div>
        </section>

        <section aria-labelledby="zrodla" className="grid gap-8 lg:grid-cols-12">
          <h2 id="zrodla" className="display-md lg:col-span-4">
            Źródła danych
          </h2>
          <ul className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
            {sources.map((s) => (
              <li key={s.href} className="py-4">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="ui inline-flex items-center gap-1.5 font-semibold hover:text-red">
                  {s.label}
                  <ExternalIcon size={15} />
                  <span className="sr-only">(otwiera się w nowej karcie)</span>
                </a>
                <p className="mt-1 text-[1rem] text-muted">Wykorzystano: {s.usedFor}.</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="zdjecia" className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="zdjecia" className="display-md">
              Zdjęcia
            </h2>
            <p className="mt-3 text-muted">
              Plansze z opisem kadru zastępują zdjęcia, których jeszcze nie ma. Zdjęcia oznaczone „z zakładu” muszą być autentyczne.
            </p>
          </div>
          <div className="overflow-x-auto lg:col-span-7 lg:col-start-6">
            <table className="ui w-full min-w-[32rem] border-collapse text-left text-[0.875rem]">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="py-2 pr-3">
                    Plik
                  </th>
                  <th scope="col" className="py-2 pr-3">
                    Kadr
                  </th>
                  <th scope="col" className="py-2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {mediaEntries.map(([key, m]) => (
                  <tr key={key}>
                    <td className="py-2.5 pr-3 font-mono text-[0.8125rem]">{m.file}</td>
                    <td className="py-2.5 pr-3 text-muted">
                      {m.brief}
                      {"mustBeAuthentic" in m && m.mustBeAuthentic ? " (z zakładu)" : ""}
                    </td>
                    <td className="py-2.5">{resolveMedia(key) ? (m.credit ?? "plik dodany, brak opisu licencji") : "brak pliku"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="do-zrobienia" className="grid gap-8 lg:grid-cols-12">
          <h2 id="do-zrobienia" className="display-md lg:col-span-4">
            Przed publikacją
          </h2>
          <ul className="space-y-3 lg:col-span-7 lg:col-start-6">
            {pending.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-red" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

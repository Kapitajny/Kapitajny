import Link from "next/link";
import { getDepartment } from "@/content/company";
import { retailStores } from "@/content/locations";
import { telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { LocationFinder } from "@/components/locations/LocationFinder";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata = pageMetadata({
  title: "Sieć sprzedaży – hurtownie i sklepy firmowe",
  description: "Hurtownie firmowe Wierzejki w Siedlcach, Łukowie, Otwocku i Warszawie. Wyszukiwarka punktów sprzedaży z mapą.",
  path: "/siec-sprzedazy",
});

export default function SalesNetworkPage() {
  const secretariat = getDepartment("sekretariat");
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/siec-sprzedazy", label: "Sieć sprzedaży" }]}
        title="Gdzie kupić"
        lead={<p>Hurtownie firmowe na Mazowszu i Lubelszczyźnie oraz sklepy firmowe Wierzejki.</p>}
      />

      <section aria-label="Wyszukiwarka punktów sprzedaży" className="py-14 lg:py-20">
        <div className="container-x">
          <LocationFinder />
        </div>
      </section>

      <section aria-labelledby="sklepy-firmowe" className="border-t border-line bg-surface py-16 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <h2 id="sklepy-firmowe" className="display-lg lg:col-span-5">
            Sklepy firmowe
          </h2>
          <div className="lg:col-span-6 lg:col-start-7">
            {retailStores.length === 0 ? (
              <p>
                Firma prowadzi własną sieć sklepów mięsnych. Ich aktualna lista z adresami i godzinami otwarcia zostanie dodana do wyszukiwarki
                po potwierdzeniu przez firmę. O najbliższy sklep zapytaj w sekretariacie:{" "}
                <a href={telHref(secretariat.phones[0].display)} className="link font-semibold">
                  {secretariat.phones[0].display}
                </a>
                .
              </p>
            ) : (
              <p>Wszystkie sklepy firmowe znajdziesz w wyszukiwarce powyżej – wybierz rodzaj punktu „Sklep firmowy”.</p>
            )}
            <DemoNote className="mt-6">
              W katalogach internetowych są adresy sklepów Wierzejki, ale część wpisów ma kilka lat. Koncepcja nie przenosi ich bez
              potwierdzenia – listę uzupełnia się w pliku <code>src/content/locations.ts</code>.
            </DemoNote>
            <Link href="/dla-biznesu" className="btn btn-outline mt-8">
              Oferta dla biznesu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

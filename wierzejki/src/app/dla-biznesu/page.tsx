import Link from "next/link";
import { company, getDepartment } from "@/content/company";
import { categories } from "@/content/products";
import { wholesalePoints } from "@/content/locations";
import { listPl, mailHref, telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { isContactConfigured } from "@/lib/server/delivery";
import { PageIntro } from "@/components/layout/PageIntro";
import { ContactForm } from "@/components/forms/ContactForm";
import { DepartmentContact } from "@/components/ui/ContactCard";
import { DemoNote } from "@/components/ui/DemoNote";
import { Photo } from "@/components/ui/Photo";

export const metadata = pageMetadata({
  title: "Oferta dla biznesu – hurt, gastronomia, stołówki",
  description:
    "Współpraca handlowa z Zakładem Mięsnym Wierzejki: mięso, wędliny i garmażerka dla hurtowni, sklepów, hoteli, restauracji, szkół i stołówek. Dostawy w województwach lubelskim i mazowieckim.",
  path: "/dla-biznesu",
});

const segments = [
  {
    title: "Hurtownie i dystrybutorzy",
    text: "Mięso w tuszach i elementach, wędliny i garmażerka w ilościach hurtowych. Odbiór w hurtowniach firmowych lub dostawa.",
  },
  {
    title: "Sklepy i punkty sprzedaży",
    text: "Asortyment do lady mięsnej i chłodni – wędliny, mięso porcjowane i wyroby garmażeryjne.",
  },
  {
    title: "Hotele i restauracje",
    text: "Elementy kulinarne, wędliny do śniadań i garmażerka – kompleksowe zaopatrzenie z jednego zakładu.",
  },
  {
    title: "Szkoły i stołówki",
    text: "Mięso do dalszej obróbki i gotowe wyroby garmażeryjne dla żywienia zbiorowego.",
  },
];

const steps = [
  { title: "Kontakt", text: "Zadzwoń do Działu Zbytu lub wyślij zapytanie formularzem poniżej." },
  { title: "Dobór asortymentu", text: "Ustalamy, które produkty, w jakiej formie i w jakich ilościach są potrzebne." },
  { title: "Warunki", text: "Ceny, terminy i sposób dostawy ustalamy indywidualnie z każdym odbiorcą." },
  { title: "Dostawy", text: "Własny transport na terenie województw lubelskiego i mazowieckiego albo odbiór w hurtowni." },
];

export default function BusinessPage() {
  const sales = getDepartment("zbyt");
  const trade = getDepartment("handel-eksport");
  const farmers = getDepartment("skup");
  const secretariat = getDepartment("sekretariat");

  return (
    <>
      <PageIntro
        variant="green"
        crumbs={[{ href: "/dla-biznesu", label: "Oferta dla biznesu" }]}
        title="Zaopatrzenie dla firm i instytucji"
        lead={<p>Mięso, wędliny i garmażerka z jednego zakładu – dla hurtowni, sklepów, gastronomii i stołówek.</p>}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#zapytanie" className="btn btn-light">
            Porozmawiajmy o współpracy
          </a>
          <a href={telHref(sales.phones[0].display)} className="btn btn-outline-light">
            Dział Zbytu {sales.phones[0].display}
          </a>
        </div>
      </PageIntro>

      <section aria-labelledby="dla-kogo" className="py-20 lg:py-24">
        <div className="container-x">
          <h2 id="dla-kogo" className="display-lg max-w-[36rem]">
            Z kim współpracujemy
          </h2>
          <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
            {segments.map((s) => (
              <li key={s.title} className="bg-paper py-8 sm:p-8">
                <h3 className="display-md">{s.title}</h3>
                <p className="mt-3 max-w-[30rem] text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="jak-zaczac" className="bg-surface py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="jak-zaczac" className="display-lg">
              Jak zacząć współpracę
            </h2>
            <div className="relative mt-8 aspect-[3/2] overflow-hidden bg-linen">
              <Photo media="business" sizes="(min-width: 1024px) 30vw, 100vw" />
            </div>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-6 last:border-b">
                <span
                  className="text-[2.5rem] font-extrabold leading-none text-red"
                  style={{ fontFamily: "var(--font-sans)", fontVariationSettings: '"wdth" 64' }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="display-sm">{s.title}</h3>
                  <p className="mt-1.5 text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="asortyment-b2b" className="py-20 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="asortyment-b2b" className="display-lg">
              Asortyment i hurtownie
            </h2>
            <p className="mt-5 max-w-[30rem] text-muted">
              Hurtownie firmowe działają w {listPl(wholesalePoints.map((w) => w.cityLocative ?? w.city))}. Katalogi PDF zawierają pełną listę
              wyrobów.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-line">
              {categories.map((c) => (
                <li key={c.id} className="border-b border-line">
                  <Link href={`/produkty/${c.slug}`} className="display-sm flex min-h-14 items-center py-3 hover:text-red">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="border-t border-line">
              {wholesalePoints.map((w) => (
                <li key={w.slug} className="border-b border-line">
                  <Link href={`/siec-sprzedazy/${w.slug}`} className="flex min-h-14 flex-col justify-center py-3 hover:text-red">
                    <span className="display-sm">{w.city}</span>
                    <span className="ui text-[0.875rem] text-muted">{w.street}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="hodowcy" aria-labelledby="hodowcy-title" className="on-dark scroll-mt-28 bg-green py-20 text-on-dark lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 id="hodowcy-title" className="display-lg">
              Dla hodowców trzody i bydła
            </h2>
            <p className="lead mt-5 max-w-[36rem] text-on-dark/85">
              Zakład prowadzi własny skup żywca. Warunki skupu, terminy odbioru i ceny omówisz bezpośrednio z działem skupu.
            </p>
          </div>
          <div className="bg-on-dark p-7 text-ink lg:col-span-4 lg:col-start-9">
            <DepartmentContact department={farmers} />
          </div>
        </div>
      </section>

      <section id="zapytanie" aria-labelledby="zapytanie-title" className="scroll-mt-28 py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="zapytanie-title" className="display-lg">
              Zapytanie handlowe
            </h2>
            <p className="mt-5 text-muted">Opisz potrzeby Twojej firmy – zapytanie trafi do działu handlowego. Wolisz porozmawiać? Zadzwoń.</p>
            <div className="mt-10 space-y-8 border-t border-line pt-8">
              <DepartmentContact department={sales} />
              <DepartmentContact department={trade} />
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm
              variant="b2b"
              configured={isContactConfigured()}
              fallback={
                <p>
                  Dział Zbytu:{" "}
                  <a href={telHref(sales.phones[0].display)} className="link font-semibold">
                    {sales.phones[0].display}
                  </a>
                  , sekretariat:{" "}
                  <a href={mailHref(company.email, "Zapytanie handlowe")} className="link font-semibold">
                    {secretariat.email}
                  </a>
                </p>
              }
            />
          </div>
        </div>
      </section>

      <div className="container-x pb-16">
        <DemoNote>
          Treści o odbiorcach i obszarze dostaw pochodzą z zakładki „Hurtowy” dotychczasowej strony. Strona nie podaje warunków handlowych –
          te firma ustala indywidualnie.
        </DemoNote>
      </div>
    </>
  );
}

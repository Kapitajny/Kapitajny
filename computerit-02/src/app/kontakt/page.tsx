import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";
import { formatPrice, prices, type ServiceValue } from "@/data/offer";
import { getProject, kindLabel } from "@/data/projects";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Opowiedz nam o swoim projekcie. Wyślij zapytanie o stronę internetową lub sklep internetowy – odpowiemy z propozycją zakresu i wyceną.",
  alternates: { canonical: "/kontakt" },
};

const nextSteps = [
  { title: "Czytamy zapytanie", text: "Sprawdzamy, czego potrzebujesz, i w razie pytań dopytujemy mailowo lub telefonicznie." },
  { title: "Proponujemy zakres", text: "Przygotowujemy propozycję zakresu, terminu i ceny – bez zobowiązań." },
  { title: "Zaczynamy po akceptacji", text: "Prace ruszają dopiero, gdy zakres i warunki są ustalone." },
];

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function ContactPage({ searchParams }: PageProps<"/kontakt">) {
  const params = await searchParams;
  const usluga = first(params.usluga);
  const initialService: ServiceValue | undefined = usluga === "strona" || usluga === "sklep" || usluga === "inne" ? usluga : undefined;
  const project = getProject(first(params.projekt));
  const promo = first(params.pakiet) === "promocja";

  const initialMessage = promo
    ? `Interesuje mnie pakiet promocyjny – strona internetowa za ${formatPrice(prices.promo)} zł. `
    : project
      ? `Interesuje mnie ${project.kind === "sklep" ? "sklep internetowy podobny" : "strona internetowa podobna"} do koncepcji ${project.name}. `
      : "";

  const { email, phone } = siteConfig.contact;

  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg fade-mask pointer-events-none absolute inset-x-0 top-0 h-[36rem]" aria-hidden="true" />
      <div className="container-x relative grid gap-12 pt-[clamp(3rem,8vw,6rem)] pb-[clamp(4.5rem,10vw,8rem)] lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="hero-in">
          <p className="eyebrow">Kontakt</p>
          <h1 className="display mt-6">Porozmawiajmy o projekcie</h1>
          <p className="lead mt-6">
            Opisz firmę i to, czego potrzebujesz. Odpowiemy z propozycją zakresu i wyceną. Wysłanie zapytania niczego nie zobowiązuje.
          </p>

          <dl className="mt-10 space-y-5 border-t border-line pt-8">
            <div>
              <dt className="eyebrow">E-mail</dt>
              <dd className="mt-2 text-[1.1rem] font-semibold">
                {email ? (
                  <a href={`mailto:${email}`} className="link">
                    {email}
                  </a>
                ) : (
                  <span className="fill font-normal">do uzupełnienia</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Telefon</dt>
              <dd className="mt-2 text-[1.1rem] font-semibold">
                {phone ? (
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="link">
                    {phone}
                  </a>
                ) : (
                  <span className="fill font-normal">do uzupełnienia</span>
                )}
              </dd>
            </div>
          </dl>

          <h2 className="mt-12 text-[1.2rem] tracking-[-0.02em]">Co dzieje się po wysłaniu?</h2>
          <ol className="mt-5 space-y-5">
            {nextSteps.map((step, n) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-4">
                <span className="grid size-8 place-items-center rounded-full border border-gold font-mono text-[0.75rem]">{n + 1}</span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-[0.95rem] text-steel">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[0.9rem] text-steel">
            Płatności przyjmujemy wyłącznie przelewem bankowym – zobacz{" "}
            <Link href="/regulamin-platnosci" className="link">
              regulamin płatności
            </Link>
            .
          </p>
        </div>

        <div className="hero-in">
          <ContactForm
            initialService={initialService}
            initialMessage={initialMessage}
            reference={project?.slug}
            referenceName={project ? `${project.name} (${kindLabel[project.kind].toLowerCase()})` : undefined}
            fallbackEmail={email}
          />
        </div>
      </div>
    </section>
  );
}

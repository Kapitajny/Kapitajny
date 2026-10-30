import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHead } from "@/components/ui/PageHead";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Adres, godziny otwarcia, telefon i e-mail VÉRA Aesthetic Studio oraz formularz kontaktowy.",
  alternates: { canonical: "/kontakt" },
  openGraph: { title: "Kontakt | VÉRA Aesthetic Studio", url: "/kontakt" },
};

export default function ContactPage() {
  const { contact, address, hours } = siteConfig;
  const tiles = [
    { label: "Zadzwoń", value: contact.phone, href: contact.phoneHref },
    { label: "Napisz", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Instagram", value: contact.instagramHandle, href: contact.instagramUrl, external: true },
  ];
  return (
    <>
      <PageHead
        crumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/kontakt", label: "Kontakt" },
        ]}
        title="Porozmawiajmy"
        lede="Zadzwoń, napisz albo po prostu wpadnij. Odpowiadamy w godzinach otwarcia studia."
      />

      <section aria-label="Dane kontaktowe" className="shell pb-16">
        <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.label}>
              <a
                href={t.href}
                {...(t.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block h-full rounded-[2rem] bg-blush px-6 py-8 text-center transition-colors hover:bg-powder"
              >
                <span className="block text-xs text-rose-deep">{t.label}</span>
                <span className="script mt-2 block break-all text-2xl">{t.value}</span>
                {t.external && <span className="sr-only"> (otwiera się w nowej karcie)</span>}
              </a>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-4 grid max-w-5xl gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] bg-white/70 px-7 py-8 text-center">
            <h2 className="text-xs text-rose-deep">Adres</h2>
            <address className="script mt-2 text-2xl not-italic">
              {address.street}, {address.postalCode} {address.city}
            </address>
            <p className="mt-1 text-sm text-stone">{address.note}</p>
            <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="rose-link mt-4 inline-block text-sm font-medium">
              Wyznacz trasę<span className="sr-only"> (otwiera Mapy Google w nowej karcie)</span>
            </a>
          </div>
          <div className="rounded-[2rem] bg-white/70 px-7 py-8 text-center">
            <h2 className="text-xs text-rose-deep">Godziny otwarcia</h2>
            <dl className="mt-3 space-y-1.5">
              {hours.map((h) => (
                <div key={h.days} className="flex justify-center gap-3">
                  <dt className="text-stone">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="message-title" className="bg-blush py-20 sm:py-24">
        <div className="shell">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-ivory px-6 py-12 sm:rounded-[3.5rem] sm:px-12 sm:py-14">
            <h2 id="message-title" className="script text-center text-[clamp(2.2rem,5vw,3.2rem)]">
              Napisz do nas
            </h2>
            <p className="mx-auto mb-10 mt-3 max-w-md text-center text-sm font-light text-stone">
              W sprawie zabiegów, umówionej wizyty albo czegokolwiek innego. Pierwszą wizytę najwygodniej umówisz przez{" "}
              <Link href={bookingHref} className="rose-link text-burgundy">
                zapytanie o konsultację
              </Link>
              .
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

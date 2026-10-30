import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ConsultationFormFromUrl } from "@/components/forms/ConsultationFormFromUrl";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Rezerwacja konsultacji",
  description:
    "Wyślij zapytanie o konsultację w ÉLORIA Aesthetic Clinic. Wybierz obszar zabiegów i dogodne terminy – recepcja skontaktuje się z Tobą, aby potwierdzić wizytę.",
  alternates: { canonical: "/rezerwacja" },
  openGraph: { title: "Rezerwacja konsultacji | ÉLORIA Aesthetic Clinic", url: "/rezerwacja" },
};

const howItWorks = [
  { title: "Wysyłasz zapytanie", text: "Wybierasz obszar, dogodne dni i formę kontaktu." },
  { title: "Proponujemy termin", text: "Recepcja oddzwania lub odpisuje z wolnymi terminami." },
  { title: "Potwierdzamy wizytę", text: "Dopiero wtedy termin jest zarezerwowany – otrzymujesz potwierdzenie i informacje o przygotowaniu." },
];

export default function BookingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Rezerwacja konsultacji", path: "/rezerwacja" }])} />
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/rezerwacja", label: "Rezerwacja konsultacji" },
        ]}
        title="Umów konsultację"
        lede="Wypełnij krótki formularz, a koordynatorka pacjentek skontaktuje się z Tobą, aby zaproponować termin. To zapytanie – wizytę potwierdzamy indywidualnie."
      />

      <div className="frame grid gap-y-16 pb-24 lg:grid-cols-12 lg:gap-x-10 lg:pb-32">
        <aside aria-label="Jak to działa" className="lg:order-2 lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <div className="relative hidden aspect-[3/4] overflow-hidden rounded-t-full bg-blush lg:block">
              <Photo image="booking" sizes="30vw" />
            </div>
            <ol className="mt-10 space-y-6">
              {howItWorks.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3">
                  <span aria-hidden="true" className="font-serif text-xl italic text-champagne-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-serif text-xl">{step.title}</h2>
                    <p className="mt-1 text-sm text-taupe">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            {siteConfig.bookingUrl && (
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-serif text-2xl">Wolisz samodzielnie wybrać termin?</h2>
                <p className="mt-2 text-sm text-taupe">Wolne terminy konsultacji sprawdzisz w naszym kalendarzu online.</p>
                <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-5">
                  Otwórz kalendarz wizyt<span className="sr-only"> (otwiera się w nowej karcie)</span>
                </a>
              </div>
            )}

            <div className="mt-10 border-t border-line pt-8 text-sm text-taupe">
              <p>Wolisz porozmawiać?</p>
              <a href={siteConfig.contact.phoneHref} className="mt-2 inline-block font-serif text-2xl text-espresso hover:text-champagne-deep">
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </aside>

        <section aria-label="Formularz zapytania o konsultację" className="lg:order-1 lg:col-span-8">
          <ConsultationFormFromUrl />
        </section>
      </div>
    </>
  );
}

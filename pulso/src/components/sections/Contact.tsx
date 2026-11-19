import { site } from "@/config/site";
import { CONTACT_ID } from "@/lib/contact-intent";
import { ContactForm } from "@/components/form/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";

const next = [
  { title: "Czytamy zgłoszenie", body: "Sprawdzamy, czego potrzebujesz i czy możemy realnie pomóc." },
  { title: "Umawiamy rozmowę", body: "Kontaktujemy się, żeby ustalić termin konsultacji online lub telefonicznie." },
  { title: "Rozmawiamy o planie", body: "Na konsultacji omawiamy cel, kanały, budżet i dalsze kroki." },
];

export function Contact() {
  const { email, phone, hours } = site.contact;
  return (
    <section id={CONTACT_ID} aria-labelledby="kontakt-tytul" className="section scroll-mt-0 border-t border-rule">
      <div className="container-plan grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <h2 id="kontakt-tytul" className="t-h2 lg:col-span-7">
            Porozmawiajmy o Twoim planie.
          </h2>
          <p className="t-lead mt-5 lg:col-span-5 lg:mt-0">Sześć krótkich kroków. Na podstawie odpowiedzi przygotujemy się do konsultacji.</p>
        </div>
        <div className="lg:col-span-4">

          <ol className="space-y-6 border-l border-rule pl-6 lg:mt-2">
            {next.map((n, i) => (
              <li key={n.title} className="relative">
                <span className="absolute top-2 -left-[calc(1.5rem+4px)] h-2 w-2 rounded-full bg-ink" aria-hidden="true" />
                <p className="text-[1.0625rem] font-[640]">
                  <span className="tnum mr-2 text-ink-3">{i + 1}.</span>
                  {n.title}
                </p>
                <p className="mt-1 text-[0.9875rem] text-ink-2">{n.body}</p>
              </li>
            ))}
          </ol>

          {(email || phone) && (
            <div className="mt-10 border-t border-rule pt-6 text-[0.9875rem]">
              <p className="t-col">Wolisz bezpośrednio?</p>
              {email && <CopyEmail email={email} />}
              {phone && (
                <a className="link-ink mt-1 block text-[1.0625rem] font-[600]" href={`tel:${phone.replace(/\s/g, "")}`}>
                  {phone}
                </a>
              )}
              {hours && <p className="mt-1 text-ink-3">{hours}</p>}
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

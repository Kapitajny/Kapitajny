import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";
import { Photo } from "@/components/ui/Photo";

export function ContactBlock() {
  const { contact, hours } = siteConfig;
  return (
    <section aria-labelledby="kontakt" className="bg-blush">
      <div className="frame grid gap-y-14 py-24 md:grid-cols-12 md:gap-x-8 lg:py-32">
        <div className="md:col-span-6 lg:col-span-5">
          <h2 id="kontakt" className="text-[clamp(2.5rem,5vw,3.75rem)]">
            Porozmawiajmy o Twojej skórze
          </h2>
          <p className="mt-6 max-w-md text-taupe">
            Zadzwoń lub napisz – koordynatorka pacjentek pomoże wybrać konsultację i dopasować termin. Możesz też wysłać zapytanie przez formularz.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={bookingHref} className="btn btn-primary">
              Umów konsultację
            </Link>
            <a href={contact.phoneHref} className="btn btn-outline">
              Zadzwoń
              <span className="sr-only">: {contact.phoneDisplay}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="btn btn-outline">
              Napisz e-mail
            </a>
          </div>

          <div className="mt-14 grid gap-8 border-t border-espresso/15 pt-10 sm:grid-cols-2">
            <div>
              <h3 className="font-sans text-xs font-medium text-taupe">Adres</h3>
              <address className="mt-3 not-italic">
                {contact.street}
                <br />
                {contact.postalCode} {contact.city}
              </address>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-quiet mt-2 inline-block text-sm">
                Wyznacz trasę<span className="sr-only"> (otwiera się w nowej karcie)</span>
              </a>
            </div>
            <div>
              <h3 className="font-sans text-xs font-medium text-taupe">Godziny otwarcia</h3>
              <dl className="mt-3 space-y-1">
                {hours.map((h) => (
                  <div key={h.days}>
                    <dt className="sr-only">{h.days}</dt>
                    <dd>
                      <span aria-hidden="true" className="inline-block w-14 text-taupe">
                        {h.short}
                      </span>
                      {h.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-espresso">
            <Photo image="contactReception" sizes="(min-width: 768px) 38vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

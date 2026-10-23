import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";

/** Zakończenie podstrony: jedno działanie (umówienie wizyty) i dane kontaktowe, jeśli są uzupełnione. */
export function ContactStrip({ title = "Umów pierwszą wizytę" }: { title?: string }) {
  const { phone, email } = siteConfig.contact;
  const address = formatAddress();
  return (
    <section aria-labelledby="umow-sie" className="content pb-section">
      <div className="grid gap-8 rounded-photo bg-mint p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-12">
        <div>
          <h2 id="umow-sie" className="text-h2">
            {title}
          </h2>
          <p className="mt-4 max-w-prose">
            {phone ? "Zadzwoń albo wyślij prośbę o kontakt." : "Wyślij prośbę o kontakt."} Oddzwonimy lub odpiszemy, żeby razem ustalić termin.
          </p>
          {(phone || email || address) && (
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-small">
              {phone && (
                <li>
                  <a href={phoneHref(phone)} className="link">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="link break-all">
                    {email}
                  </a>
                </li>
              )}
              {address && <li>{address}</li>}
            </ul>
          )}
        </div>
        <BookingLink className="btn btn-primary" />
      </div>
    </section>
  );
}

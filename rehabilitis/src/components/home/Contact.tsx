import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { ContactForm } from "./ContactForm";
import { MapEmbed } from "./MapEmbed";

export function Contact() {
  const { phone, email } = siteConfig.contact;
  const address = formatAddress();
  const fallbackContact = phone ? `Telefon: ${phone}` : email ? `E-mail: ${email}` : null;
  const hours = siteConfig.openingHours.filter((row) => row.hours);

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="section-y bg-sand">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div>
          <h2 id="kontakt-title" className="h2">
            Kontakt i umawianie wizyt
          </h2>
          <p className="section-intro">Zadzwoń albo zostaw prośbę o kontakt. Oddzwonimy lub odpiszemy, żeby ustalić termin.</p>

          {phone || email || address || hours.length ? (
            <dl className="mt-8 space-y-5">
              {phone && (
                <div>
                  <dt className="text-muted">Telefon</dt>
                  <dd>
                    <a href={phoneHref(phone)} className="font-serif text-[2rem] text-forest hover:underline">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-muted">E-mail</dt>
                  <dd>
                    <a href={`mailto:${email}`} className="break-all font-bold text-forest hover:underline">
                      {email}
                    </a>
                  </dd>
                </div>
              )}
              {address && (
                <div>
                  <dt className="text-muted">Adres</dt>
                  <dd className="text-ink">
                    {address}
                    {siteConfig.address.note && <span className="block text-muted">{siteConfig.address.note}</span>}
                  </dd>
                </div>
              )}
              {hours.length > 0 && (
                <div>
                  <dt className="text-muted">Godziny otwarcia</dt>
                  <dd>
                    <table className="mt-1 w-full max-w-sm text-left">
                      <tbody>
                        {hours.map((row) => (
                          <tr key={row.days} className="border-b border-graphite/15">
                            <th scope="row" className="py-1.5 pr-4 font-normal text-graphite">
                              {row.days}
                            </th>
                            <td className="py-1.5 text-right font-bold text-ink">{row.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-8 text-muted">Telefon, adres i godziny otwarcia gabinetu pojawią się tutaj po uzupełnieniu danych.</p>
          )}

          {address && (
            <div className="mt-8">
              <MapEmbed address={address} />
            </div>
          )}
        </div>

        <div>
          {siteConfig.bookingUrl && (
            <p className="mb-8 flex flex-col gap-3 border-b border-graphite/20 pb-8 sm:flex-row sm:items-center sm:justify-between">
              <span>Wolne terminy sprawdzisz w kalendarzu online.</span>
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">
                Zarezerwuj termin<span className="sr-only"> (nowa karta)</span>
              </a>
            </p>
          )}
          <h3 className="text-[1.2rem]">Prośba o kontakt</h3>
          <ContactForm fallbackContact={fallbackContact} />
        </div>
      </div>
    </section>
  );
}

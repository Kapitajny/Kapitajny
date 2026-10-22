import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { PendingValue } from "@/components/ui/Pending";
import { ContactForm } from "./ContactForm";
import { MapEmbed } from "./MapEmbed";

export function Contact() {
  const { phone, email } = siteConfig.contact;
  const address = formatAddress();
  const fallbackContact = phone ? `Telefon: ${phone}` : email ? `E-mail: ${email}` : null;

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="section-y border-t border-line bg-sand">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
        <div>
          <h2 id="kontakt-title" className="h2">
            Kontakt i umawianie wizyt
          </h2>
          <p className="section-intro">Zadzwoń albo zostaw prośbę o kontakt – oddzwonimy lub odpiszemy, żeby ustalić termin.</p>

          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-sm text-muted">Telefon</dt>
              <dd className="mt-0.5">
                {phone ? (
                  <a href={phoneHref(phone)} className="text-2xl font-semibold text-forest hover:underline">
                    {phone}
                  </a>
                ) : (
                  <PendingValue />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">E-mail</dt>
              <dd className="mt-0.5">
                {email ? (
                  <a href={`mailto:${email}`} className="break-all text-lg font-semibold text-forest hover:underline">
                    {email}
                  </a>
                ) : (
                  <PendingValue />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Adres</dt>
              <dd className="mt-0.5 text-lg text-ink">
                {address ?? <PendingValue />}
                {siteConfig.address.note && <span className="block text-base text-muted">{siteConfig.address.note}</span>}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Godziny otwarcia</dt>
              <dd className="mt-1">
                <table className="w-full max-w-sm text-left">
                  <tbody>
                    {siteConfig.openingHours.map((row) => (
                      <tr key={row.days} className="border-b border-graphite/10">
                        <th scope="row" className="py-1.5 pr-4 font-normal text-graphite">
                          {row.days}
                        </th>
                        <td className="py-1.5 text-right font-semibold text-ink">{row.hours ?? <PendingValue />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            {address ? (
              <MapEmbed address={address} />
            ) : (
              <p className="rounded-lg border border-dashed border-graphite/25 p-5 text-sm text-muted">Mapa dojazdu pojawi się po uzupełnieniu adresu gabinetu.</p>
            )}
          </div>
        </div>

        <div>
          {siteConfig.bookingUrl && (
            <div className="mb-5 flex flex-col gap-4 rounded-lg bg-forest p-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="block text-lg font-semibold">Wolne terminy online</span>
                <span className="text-white/80">Zarezerwuj wizytę w kalendarzu – bez dzwonienia.</span>
              </p>
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn shrink-0 bg-white text-forest hover:bg-sage">
                Zarezerwuj termin<span className="sr-only"> (nowa karta)</span>
              </a>
            </div>
          )}
          <h3 className="mb-4 text-xl">Prośba o kontakt</h3>
          <ContactForm fallbackContact={fallbackContact} />
        </div>
      </div>
    </section>
  );
}

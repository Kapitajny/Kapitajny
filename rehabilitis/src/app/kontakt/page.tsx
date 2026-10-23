import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { ContactForm } from "@/components/sections/ContactForm";
import { MapEmbed } from "@/components/sections/MapEmbed";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt i umawianie wizyt",
  description: `Umów wizytę w gabinecie ${siteConfig.name}: telefon, e-mail, adres, godziny otwarcia i formularz prośby o kontakt.`,
  path: "/kontakt",
});

/** Kontakt: formularz jest głównym elementem strony (biały arkusz), dane gabinetu i wskazówki w jasnozielonej kolumnie obok. */
export default function ContactPage() {
  const { phone, email } = siteConfig.contact;
  const address = formatAddress();
  const fallbackContact = phone ? `Telefon: ${phone}` : email ? `E-mail: ${email}` : null;
  const hours = siteConfig.openingHours.filter((row) => row.hours);

  return (
    <div className="content pb-section pt-10 lg:pt-16">
      <Breadcrumb current="Kontakt" />
      <h1 className="mt-8 max-w-[18ch] text-h2">Kontakt i umawianie wizyt</h1>
      <p className="mt-5 max-w-prose text-lead">
        {phone ? "Zadzwoń albo wyślij prośbę o kontakt." : "Wyślij prośbę o kontakt."} Oddzwonimy lub odpiszemy, żeby razem ustalić termin.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-8">
        <section id="formularz" aria-labelledby="formularz-title" className="rounded-photo bg-white p-6 sm:p-8 lg:p-10">
          {siteConfig.bookingUrl && (
            <p className="mb-8 flex flex-col gap-3 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
              <span>Wolne terminy sprawdzisz w kalendarzu online.</span>
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">
                Zarezerwuj termin<span className="sr-only"> (nowa karta)</span>
              </a>
            </p>
          )}
          <h2 id="formularz-title" className="text-h3">
            Prośba o kontakt
          </h2>
          <ContactForm fallbackContact={fallbackContact} />
        </section>

        {/* Na telefonach dane gabinetu (telefon, adres) są nad formularzem. */}
        <div className="order-first space-y-6 lg:order-none">
          <section aria-labelledby="dane-title" className="rounded-photo bg-mint p-6 sm:p-8">
            <h2 id="dane-title" className="text-h3">
              Dane gabinetu
            </h2>
            {phone || email || address || hours.length ? (
              <dl className="mt-5 space-y-5">
                {phone && (
                  <div>
                    <dt className="text-small text-muted">Telefon</dt>
                    <dd>
                      <a href={phoneHref(phone)} className="text-h3 type-condensed hover:underline">
                        {phone}
                      </a>
                    </dd>
                  </div>
                )}
                {email && (
                  <div>
                    <dt className="text-small text-muted">E-mail</dt>
                    <dd>
                      <a href={`mailto:${email}`} className="link break-all">
                        {email}
                      </a>
                    </dd>
                  </div>
                )}
                {address && (
                  <div>
                    <dt className="text-small text-muted">Adres</dt>
                    <dd>
                      {address}
                      {siteConfig.address.note && <span className="block text-small text-muted">{siteConfig.address.note}</span>}
                    </dd>
                  </div>
                )}
                {hours.length > 0 && (
                  <div>
                    <dt className="text-small text-muted">Godziny otwarcia</dt>
                    <dd>
                      <table className="mt-1 w-full text-left text-small">
                        <tbody>
                          {hours.map((row) => (
                            <tr key={row.days} className="border-b border-mint-strong">
                              <th scope="row" className="py-1.5 pr-4 font-normal">
                                {row.days}
                              </th>
                              <td className="py-1.5 text-right font-semibold tabular-nums">{row.hours}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="mt-4 text-small">
                Telefon, adres i godziny otwarcia pojawią się tutaj po uzupełnieniu danych przez gabinet. Do tego czasu skorzystaj z formularza.
              </p>
            )}
          </section>

          {address && <MapEmbed address={address} />}

          <section aria-labelledby="przed-wizyta-title" className="px-1">
            <h2 id="przed-wizyta-title" className="text-h4 type-plain">
              Przed pierwszą wizytą
            </h2>
            <ul className="mt-3 divide-y divide-line border-y border-line text-small">
              {FIRST_VISIT?.duration && FIRST_VISIT.price && (
                <li className="py-3">
                  Konsultacja trwa {FIRST_VISIT.duration} i kosztuje {FIRST_VISIT.price}
                  {PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}.
                </li>
              )}
              <li className="py-3">Na wizytę prywatną nie potrzebujesz skierowania.</li>
              <li className="py-3">
                <Link href="/o-gabinecie#przebieg" className="link">
                  Jak wygląda pierwsza wizyta i co zabrać
                </Link>
              </li>
              <li className="py-3">
                <Link href="/faq" className="link">
                  Najczęstsze pytania
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { ContactForm } from "@/components/sections/ContactForm";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt i umawianie wizyt",
  description: `Umów wizytę w gabinecie ${siteConfig.name}: telefon, e-mail, adres, godziny otwarcia i formularz prośby o kontakt.`,
  path: "/kontakt",
});

export default function ContactPage() {
  const { phone, email } = siteConfig.contact;
  const address = formatAddress();
  const fallbackContact = phone ? `Telefon: ${phone}` : email ? `E-mail: ${email}` : null;
  const hours = siteConfig.openingHours.filter((row) => row.hours);

  return (
    <>
      <PageIntro
        title="Kontakt i umawianie wizyt"
        lead={
          phone
            ? "Zadzwoń albo wyślij prośbę o kontakt. Oddzwonimy lub odpiszemy, żeby razem ustalić termin."
            : "Wyślij prośbę o kontakt. Oddzwonimy lub odpiszemy, żeby razem ustalić termin."
        }
      />

      <div className="page grid gap-14 py-section lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
        <div>
          <h2 className="text-h2">Dane gabinetu</h2>
          {phone || email || address || hours.length ? (
            <dl className="mt-6 space-y-6">
              {phone && (
                <div>
                  <dt className="text-small text-muted">Telefon</dt>
                  <dd>
                    <a href={phoneHref(phone)} className="text-h2 font-bold text-brand hover:underline">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-small text-muted">E-mail</dt>
                  <dd>
                    <a href={`mailto:${email}`} className="break-all font-bold text-brand hover:underline">
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
                    <table className="mt-1 w-full max-w-sm text-left">
                      <tbody>
                        {hours.map((row) => (
                          <tr key={row.days} className="border-b border-line">
                            <th scope="row" className="py-1.5 pr-4 font-normal">
                              {row.days}
                            </th>
                            <td className="py-1.5 text-right font-bold tabular-nums">{row.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-6 max-w-prose text-muted">
              Telefon, adres i godziny otwarcia pojawią się tutaj po uzupełnieniu danych przez gabinet. Do tego czasu skorzystaj z formularza.
            </p>
          )}

          {address && (
            <div className="mt-10">
              <MapEmbed address={address} />
            </div>
          )}

          <div className="mt-12 border-t border-line pt-6">
            <h2 className="text-h3">Przed pierwszą wizytą</h2>
            <ul className="mt-3 space-y-2">
              {FIRST_VISIT?.duration && FIRST_VISIT.price && (
                <li>
                  Konsultacja trwa {FIRST_VISIT.duration} i kosztuje {FIRST_VISIT.price}
                  {PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}.
                </li>
              )}
              <li>Na wizytę prywatną nie potrzebujesz skierowania.</li>
              <li>
                <Link href="/o-gabinecie#pierwsza-wizyta" className="link">
                  Jak wygląda pierwsza wizyta i co zabrać
                </Link>
              </li>
              <li>
                <Link href="/faq" className="link">
                  Najczęstsze pytania
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <section id="formularz" aria-labelledby="formularz-title" className="scroll-mt-28 border-t-2 border-brand-strong pt-6">
          {siteConfig.bookingUrl && (
            <p className="mb-8 flex flex-col gap-3 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
              <span>Wolne terminy sprawdzisz w kalendarzu online.</span>
              <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">
                Zarezerwuj termin<span className="sr-only"> (nowa karta)</span>
              </a>
            </p>
          )}
          <h2 id="formularz-title" className="text-h2">
            Prośba o kontakt
          </h2>
          <ContactForm fallbackContact={fallbackContact} />
        </section>
      </div>
    </>
  );
}

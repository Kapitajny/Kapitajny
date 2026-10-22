import { formatAddress, phoneHref, siteConfig } from "@/config/site";
import { CalendarIcon, ClockIcon, ExternalIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { Pending } from "@/components/ui/Pending";
import { ContactForm } from "./ContactForm";
import { MapEmbed } from "./MapEmbed";
import { SectionHeading } from "./SectionHeading";

export function Contact() {
  const { phone, email } = siteConfig.contact;
  const address = formatAddress();
  const fallbackContact = phone ? `Telefon: ${phone}` : email ? `E-mail: ${email}` : null;

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="section-y bg-sand">
      <div className="container-x">
        <SectionHeading id="kontakt-title" eyebrow="Kontakt i rezerwacja" className="max-w-3xl">
          Umów wizytę – <em className="italic text-forest">pomożemy wybrać termin</em>
        </SectionHeading>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {siteConfig.bookingUrl && (
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 flex items-center justify-between gap-4 rounded-lg bg-forest p-6 text-paper transition-colors hover:bg-forest-deep"
              >
                <span className="flex items-center gap-4">
                  <CalendarIcon size={26} />
                  <span>
                    <span className="block font-serif text-xl">Zarezerwuj termin online</span>
                    <span className="block text-sm text-paper/80">Wolne terminy w kalendarzu rezerwacji (nowa karta)</span>
                  </span>
                </span>
                <ExternalIcon size={20} />
              </a>
            )}
            <ContactForm fallbackContact={fallbackContact} />
          </div>

          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            <InfoBlock icon={<PhoneIcon size={20} />} title="Telefon">
              {phone ? (
                <a href={phoneHref(phone)} className="font-serif text-2xl text-forest hover:underline">
                  {phone}
                </a>
              ) : (
                <Pending>numer telefonu</Pending>
              )}
              <p className="mt-1 text-sm text-muted">Najszybszy sposób, aby umówić lub przełożyć wizytę.</p>
            </InfoBlock>

            <InfoBlock icon={<MailIcon size={20} />} title="E-mail">
              {email ? (
                <a href={`mailto:${email}`} className="break-all text-lg text-forest hover:underline">
                  {email}
                </a>
              ) : (
                <Pending>adres e-mail</Pending>
              )}
            </InfoBlock>

            <InfoBlock icon={<PinIcon size={20} />} title="Adres gabinetu">
              {address ? <p className="text-lg text-ink">{address}</p> : <Pending>adres gabinetu</Pending>}
              {siteConfig.address.note && <p className="mt-1 text-sm text-muted">{siteConfig.address.note}</p>}
            </InfoBlock>

            <InfoBlock icon={<ClockIcon size={20} />} title="Godziny otwarcia">
              <dl className="space-y-1.5">
                {siteConfig.openingHours.map((row) => (
                  <div key={row.days} className="flex flex-wrap justify-between gap-x-4">
                    <dt className="text-graphite">{row.days}</dt>
                    <dd className="text-ink">{row.hours ?? <Pending>godziny</Pending>}</dd>
                  </div>
                ))}
              </dl>
            </InfoBlock>

            {address ? (
              <MapEmbed address={address} />
            ) : (
              <p className="rounded-lg border border-dashed border-moss/40 p-5 text-sm text-muted">
                Mapa dojazdu pojawi się automatycznie po uzupełnieniu adresu gabinetu w pliku <code className="text-graphite">src/config/site.ts</code>.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-forest/20 pt-5">
      <h3 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-moss">
        {icon}
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

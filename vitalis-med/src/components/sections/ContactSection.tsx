import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { contactChannel } from "@/lib/server/contact-delivery";
import { SectionHeading } from "./SectionHeading";

export function ContactDetails() {
  const { contact } = siteConfig;
  return (
    <div>
      <a href={contact.phoneHref} className="group block border-b border-line pb-6">
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Dyspozytornia 24/7</span>
        <span className="mt-2 flex items-center gap-3 font-display text-[2.1rem] font-semibold leading-none text-ink group-hover:text-red-dark" style={{ fontStretch: "88%" }}>
          <Icon name="phone" size={26} className="text-red" />
          {contact.phoneDisplay}
        </span>
      </a>
      <ul className="divide-y divide-line">
        <li className="flex gap-4 py-5">
          <Icon name="mail" size={22} className="mt-0.5 shrink-0 text-muted" />
          <div>
            <p className="text-sm text-muted">E-mail</p>
            <p>
              <a href={`mailto:${contact.email}`} className="link-quiet break-all font-semibold text-ink">
                {contact.email}
              </a>
            </p>
          </div>
        </li>
        <li className="flex gap-4 py-5">
          <Icon name="pin" size={22} className="mt-0.5 shrink-0 text-muted" />
          <div>
            <p className="text-sm text-muted">Adres bazy</p>
            <div className="font-semibold text-ink">
              <address className="not-italic">
                {contact.street}, {contact.postalCode} {contact.city}
              </address>
            </div>
          </div>
        </li>
        <li className="flex gap-4 py-5">
          <Icon name="clock" size={22} className="mt-0.5 shrink-0 text-muted" />
          <div>
            <p className="text-sm text-muted">Godziny</p>
            <p className="text-ink">{contact.dispatchHours}</p>
            <p className="text-ink">{contact.officeHours}</p>
          </div>
        </li>
      </ul>
      <p className="mt-2 flex gap-3 rounded-[4px] bg-red-soft p-4 text-[0.95rem] leading-relaxed text-ink">
        <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-red" />
        <span>
          <strong className="font-semibold">Stan zagrożenia życia?</strong> Nie wypełniaj formularza – zadzwoń pod numer alarmowy 112 lub 999.
        </span>
      </p>
    </div>
  );
}

export function ContactSection({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const configured = contactChannel() !== null;
  return (
    <section aria-labelledby="kontakt-title" className="section border-t border-line bg-mist">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            as={headingAs}
            eyebrow="Kontakt"
            title="Zamów transport lub zapytaj o usługę"
            id="kontakt-title"
            lead="Najszybciej ustalimy szczegóły telefonicznie. Możesz też wysłać zapytanie przez formularz – koordynator oddzwoni, aby potwierdzić termin i wycenę."
          />
        </Reveal>
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="flex flex-col gap-8 lg:col-span-5">
            <ContactDetails />
            <MapEmbed className="h-80 lg:h-[24rem]" />
          </Reveal>
          <Reveal id="formularz" className="scroll-mt-28 border border-line bg-white p-6 sm:p-9 lg:col-span-7 lg:p-11" delay={80}>
            <h3 className="text-[1.6rem]">Formularz zapytania</h3>
            <div className="mt-4">
              <ContactForm configured={configured} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

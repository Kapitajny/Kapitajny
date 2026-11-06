import { ContactSection } from "@/components/sections/ContactSection";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt – zamów transport medyczny",
  description: `Zamów transport medyczny lub zapytaj o usługę. Dyspozytornia 24/7: ${siteConfig.contact.phoneDisplay}. ${siteConfig.contact.street}, ${siteConfig.contact.city}.`,
  path: "/kontakt",
});

const placeholder = "[do uzupełnienia]";

export default function ContactPage() {
  const { company } = siteConfig;
  return (
    <>
      <ContactSection headingAs="h1" />
      <section aria-labelledby="dane-title" className="section">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="Dane firmy" title="Dane rejestrowe" id="dane-title" />
            <p className="mt-5 text-[1rem] text-muted">
              Dane rejestrowe zostaną uzupełnione przed publikacją strony. Projekt demonstracyjny nie zawiera fikcyjnych numerów rejestrowych.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={80}>
            <dl className="divide-y divide-line border-y border-line">
              {[
                ["Nazwa", siteConfig.legalName],
                ["Adres siedziby", `${siteConfig.contact.street}, ${siteConfig.contact.postalCode} ${siteConfig.contact.city}`],
                ["NIP", company.nip ?? placeholder],
                ["REGON", company.regon ?? placeholder],
                ["KRS", company.krs ?? placeholder],
                ["Nr księgi rejestrowej RPWDL", company.rpwdl ?? placeholder],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-3">
                  <dt className="text-sm text-muted sm:text-base">{k}</dt>
                  <dd className="font-semibold text-ink sm:col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}

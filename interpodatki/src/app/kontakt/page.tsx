import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { IconClock, IconMail, IconPhone } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { PageIntro } from "@/components/ui/PageIntro";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Skontaktuj się z InterPodatki: formularz kontaktowy, demonstracyjne dane kontaktowe i godziny pracy. Projekt demonstracyjny – wiadomości nie są wysyłane e-mailem.",
  path: "/kontakt",
});

export default function ContactPage() {
  const { contact } = siteConfig;
  return (
    <>
      <PageIntro
        crumbs={[{ href: "/kontakt", label: "Kontakt" }]}
        title="Kontakt"
        lede="Masz pytanie o zakres usług lub cennik? Napisz – a jeśli wiesz już, czego potrzebujesz, skorzystaj z formularza wyceny."
      />
      <section className="py-14 sm:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-[1.75rem]">Dane kontaktowe</h2>
              <p className="mt-2 text-sm text-muted">Dane demonstracyjne – nie działają.</p>
            </div>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <IconMail size={22} className="mt-0.5 shrink-0 text-blue-ink" />
                <div>
                  <p className="text-sm text-muted">E-mail</p>
                  <p className="font-medium text-navy">{contact.email}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <IconPhone size={22} className="mt-0.5 shrink-0 text-blue-ink" />
                <div>
                  <p className="text-sm text-muted">Telefon</p>
                  <p className="num font-medium text-navy">{contact.phoneDisplay}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <IconClock size={22} className="mt-0.5 shrink-0 text-blue-ink" />
                <div>
                  <p className="text-sm text-muted">Godziny pracy</p>
                  <p className="font-medium text-navy">{contact.hours}</p>
                </div>
              </li>
            </ul>
            <Notice tone="demo">
              Adres siedziby, dane rejestrowe i numer telefonu należy uzupełnić przed publikacją produkcyjną.
            </Notice>
            <div className="border-t border-line pt-6">
              <p className="font-medium text-navy">Potrzebujesz wyceny?</p>
              <p className="mt-1 text-sm text-muted">Formularz wyceny zbiera wszystkie informacje potrzebne do oferty.</p>
              <Link href="/wycena" className="btn btn-outline btn-sm mt-4">
                Przejdź do formularza wyceny
              </Link>
            </div>
          </div>
          <div className="panel p-5 sm:p-8">
            <h2 className="mb-6 text-[1.75rem]">Napisz wiadomość</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

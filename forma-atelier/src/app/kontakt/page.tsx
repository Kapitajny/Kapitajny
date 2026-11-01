import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { PageTransition } from "@/components/ui/PageTransition";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Porozmawiajmy o projekcie Twojego wnętrza. Wypełnij formularz zapytania — FORMA ATELIER odpowiada w ciągu dwóch dni roboczych.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-16 pt-[calc(var(--header-h)+5rem)] pb-[var(--section)] md:pt-[calc(var(--header-h)+8rem)]">
        <div className="col-span-12 lg:col-span-4">
          <h1 className="t-h2 max-w-[12ch] lg:text-[clamp(2.5rem,1.4rem+2.2vw,4rem)]">Porozmawiajmy o projekcie.</h1>
          <p className="t-body mt-8 max-w-[24rem] text-[1.0625rem]">
            Opowiedz nam o swoim wnętrzu. Odpowiadamy w ciągu dwóch dni roboczych i proponujemy termin pierwszej rozmowy — w pracowni, u Ciebie lub online.
          </p>
          <Reveal delay={0.15}>
            <address className="mt-14 space-y-6 border-t border-line pt-8 text-[0.9375rem] not-italic">
              <div>
                <p className="t-meta text-stone">Pracownia</p>
                <p className="mt-1.5">
                  {site.contact.street}, {site.contact.city}
                </p>
              </div>
              <div>
                <p className="t-meta text-stone">E-mail i telefon</p>
                <p className="mt-1.5">
                  <a href={`mailto:${site.contact.email}`} className="link-line">
                    {site.contact.email}
                  </a>
                  <br />
                  <a href={`tel:${site.contact.phoneHref}`} className="link-line">
                    {site.contact.phone}
                  </a>
                </p>
              </div>
              <div>
                <p className="t-meta text-stone">Godziny</p>
                <p className="mt-1.5">{site.contact.hours}</p>
              </div>
              <p className="t-meta text-stone">Dane kontaktowe są przykładowe — projekt demonstracyjny.</p>
            </address>
          </Reveal>
        </div>
        <div className="relative col-span-12 lg:col-span-7 lg:col-start-6">
          <Suspense fallback={<div className="h-[44rem]" aria-hidden="true" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
}

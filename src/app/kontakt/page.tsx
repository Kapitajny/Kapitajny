import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Pending } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Pytania o zamówienie, rozmiar, zwrot lub reklamację – napisz do nas.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  const { contact, seller } = siteConfig;
  return (
    <div className="wrap grid gap-14 pb-24 pt-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="display text-[clamp(3rem,1rem+7vw,7rem)]">Kontakt</h1>
        <p className="mt-6 max-w-md text-muted">Pytanie o rozmiar, zamówienie albo zwrot? Napisz – w wiadomości podaj numer zamówienia, jeśli go masz.</p>
        <dl className="mt-10 space-y-5 text-sm">
          <div>
            <dt className="font-bold">E-mail</dt>
            <dd className="mt-1 text-muted">{contact.email ? <a href={`mailto:${contact.email}`} className="link text-paper">{contact.email}</a> : <Pending>adres e-mail obsługi</Pending>}</dd>
          </div>
          <div>
            <dt className="font-bold">Telefon</dt>
            <dd className="mt-1 text-muted">{contact.phone ? <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="link text-paper">{contact.phone}</a> : <Pending>numer telefonu</Pending>}</dd>
          </div>
          <div>
            <dt className="font-bold">Sprzedawca</dt>
            <dd className="mt-1 space-y-1 text-muted">
              <p>{seller.company ?? <Pending>nazwa firmy</Pending>}</p>
              <p>{seller.address ?? <Pending>adres siedziby</Pending>}</p>
              <p>NIP: {seller.nip ?? <Pending>NIP</Pending>}</p>
            </dd>
          </div>
          <div>
            <dt className="font-bold">Adres do zwrotów</dt>
            <dd className="mt-1 text-muted">{seller.returnsAddress ?? <Pending>adres zwrotów</Pending>}</dd>
          </div>
        </dl>
      </div>
      <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
        <h2 className="display-sm mb-6 text-xl">Formularz kontaktowy</h2>
        <ContactForm />
      </div>
    </div>
  );
}

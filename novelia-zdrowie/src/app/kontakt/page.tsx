import type { Metadata } from "next";
import Link from "next/link";
import { seller } from "@/config/site";
import { ContactForm } from "@/components/legal/ContactForm";
import { Filled } from "@/components/legal/Pending";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z NOVELIA ZDROWIE – pytania o publikacje, zamówienia, płatności i pobieranie plików.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <section className="container-x py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Kontakt</p>
          <span className="gold-rule mt-5" />
          <h1 className="mt-6 text-[clamp(2.2rem,1.5rem+2.6vw,3.6rem)]">Napisz do nas</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">Masz pytanie o publikację, zamówienie lub pobieranie pliku? Odpowiadamy w dni robocze.</p>
          <dl className="mt-10 space-y-6 text-[1.02rem]">
            <div>
              <dt className="eyebrow">Sprzedawca</dt>
              <dd className="mt-2">
                <Filled value={seller.name} label="nazwa firmy / imię i nazwisko przedsiębiorcy" />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Adres</dt>
              <dd className="mt-2">
                <Filled value={seller.address} label="adres siedziby" />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">NIP / REGON</dt>
              <dd className="mt-2">
                <Filled value={seller.nip} label="NIP" /> / <Filled value={seller.regon} label="REGON" />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">E-mail</dt>
              <dd className="mt-2">
                {seller.email ? (
                  <a href={`mailto:${seller.email}`} className="link text-forest">
                    {seller.email}
                  </a>
                ) : (
                  <Filled value="" label="adres e-mail" />
                )}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Telefon</dt>
              <dd className="mt-2">
                <Filled value={seller.phone} label="numer telefonu (opcjonalnie)" />
              </dd>
            </div>
          </dl>
          <p className="mt-10 text-sm text-muted">
            Problem z pobraniem pliku? Skorzystaj najpierw ze strony{" "}
            <Link href="/pobieranie" className="link text-forest">
              Ponowne pobranie pliku
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

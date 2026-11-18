import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Informacje prawne",
  description: `Dane firmy i informacje prawne ${site.fullName}.`,
};

const fill = (v: string | null, placeholder: string) => v ?? `[${placeholder}]`;

export default function LegalInfo() {
  const c = site.company;
  return (
    <LegalPage title="Informacje prawne" updated="Wersja robocza">
      <h2>Dane firmy</h2>
      <dl>
        <dt>Nazwa</dt>
        <dd>{fill(c.legalName, "pełna nazwa firmy")}</dd>
        <dt>Adres</dt>
        <dd>{fill(c.address, "adres siedziby")}</dd>
        <dt>NIP</dt>
        <dd>{fill(c.nip, "NIP")}</dd>
        <dt>REGON</dt>
        <dd>{fill(c.regon, "REGON")}</dd>
        <dt>KRS</dt>
        <dd>{fill(c.krs, "KRS, jeśli dotyczy")}</dd>
        <dt>Kontakt</dt>
        <dd>{fill(site.contact.email, "adres e-mail")}</dd>
      </dl>

      <h2>Ceny</h2>
      <p>
        Ceny pakietów podane na stronie są cenami netto za jeden miesiąc obsługi i mają charakter informacyjny. Nie stanowią
        oferty w rozumieniu Kodeksu cywilnego. Zakres i cenę potwierdzamy na piśmie przed rozpoczęciem współpracy. Budżet
        reklamowy nie jest wliczony w cenę obsługi i jest opłacany bezpośrednio platformom reklamowym.
      </p>

      <h2>Projekty i dane demonstracyjne</h2>
      <p>
        Projekty w sekcji Portfolio oraz liczby w sekcji z raportami są demonstracyjne. Nie przedstawiają realizacji ani wyników
        klientów {site.name}.
      </p>

      <h2>Znaki towarowe</h2>
      <p>
        Meta, Facebook i Instagram są znakami towarowymi Meta Platforms, Inc. Google Ads i YouTube są znakami towarowymi Google
        LLC. TikTok jest znakiem towarowym ByteDance Ltd. Znaki zostały użyte wyłącznie w celu wskazania platform, na których
        prowadzimy kampanie. {site.name} nie jest powiązane z tymi firmami.
      </p>
    </LegalPage>
  );
}

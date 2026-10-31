import { seller, siteConfig } from "@/config/site";
import { Filled } from "./Pending";

/** Dane sprzedawcy do dokumentów – puste pola oznaczone „do uzupełnienia”. */
export function SellerBlock() {
  return (
    <ul>
      <li>
        Sprzedawca: <Filled value={seller.name} label="pełna nazwa firmy / imię i nazwisko przedsiębiorcy" />
      </li>
      <li>
        Adres: <Filled value={seller.address} label="adres siedziby / miejsca wykonywania działalności" />
      </li>
      <li>
        NIP: <Filled value={seller.nip} label="NIP" />, REGON: <Filled value={seller.regon} label="REGON" />
      </li>
      <li>
        Wpis do rejestru: <Filled value="" label="CEIDG lub KRS (numer, sąd rejestrowy)" />
      </li>
      <li>
        E-mail: <Filled value={seller.email} label="adres e-mail" />
        {seller.phone ? `, telefon: ${seller.phone}` : ""}
      </li>
      <li>Adres sklepu: {siteConfig.url}</li>
    </ul>
  );
}

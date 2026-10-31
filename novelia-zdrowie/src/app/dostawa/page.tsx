import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Dostawa produktów cyfrowych", alternates: { canonical: "/dostawa" } };

export default function DeliveryPage() {
  return (
    <LegalPage
      title="Dostawa produktów cyfrowych"
      path="/dostawa"
      intro={<p>Publikacje NOVELIA ZDROWIE są dostarczane wyłącznie elektronicznie, bez kosztów dostawy.</p>}
      sections={[
        {
          id: "sposob",
          title: "Sposób dostawy",
          content: (
            <ol>
              <li>Po potwierdzeniu płatności zostajesz przekierowany(-a) na stronę potwierdzenia zamówienia z przyciskiem „Pobierz PDF”.</li>
              <li>Jednocześnie wysyłamy wiadomość e-mail z linkami do pobrania na adres podany w zamówieniu.</li>
              <li>Plik pobierasz bezpośrednio na swoje urządzenie – nie musisz zakładać konta.</li>
            </ol>
          ),
        },
        {
          id: "czas",
          title: "Czas dostawy",
          content: <p>Dostęp do pliku jest udostępniany niezwłocznie po potwierdzeniu płatności przez operatora – zwykle w ciągu kilku sekund. W przypadku płatności wymagających dodatkowego potwierdzenia może to potrwać dłużej.</p>,
        },
        {
          id: "linki",
          title: "Ważność linków i limit pobrań",
          content: (
            <>
              <p>Linki są podpisane cyfrowo i indywidualne dla każdego zamówienia. Domyślnie link jest ważny 72 godziny i pozwala na 10 pobrań każdej publikacji.</p>
              <p>
                Gdy link wygaśnie, nowe linki wygenerujesz na stronie <Link href="/pobieranie">Ponowne pobranie pliku</Link> – wysyłamy je wyłącznie na adres e-mail z
                zamówienia.
              </p>
            </>
          ),
        },
        {
          id: "format",
          title: "Format i urządzenia",
          content: <p>Publikacje mają format PDF. Otworzysz je na telefonie, tablecie, komputerze i większości czytników e-booków obsługujących PDF. Format A4 pozwala wydrukować wybrane strony.</p>,
        },
        {
          id: "problem",
          title: "Problem z pobraniem",
          content: (
            <p>
              Jeśli wiadomość nie dotarła, sprawdź folder „Spam” lub „Oferty”. W razie problemów <Link href="/kontakt">skontaktuj się z nami</Link>, podając numer
              zamówienia.
            </p>
          ),
        },
      ]}
    />
  );
}

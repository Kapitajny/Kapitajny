import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych przesłanych przez formularz kontaktowy CLIMARO.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro title="Polityka prywatności" lead="Wzór dokumentu dla projektu demonstracyjnego. Przed uruchomieniem strony treść musi przygotować lub zatwierdzić prawnik." />
      <section className="theme-light section">
        <div className={`container ${styles.doc}`}>
          <h2>Administrator danych</h2>
          <p>
            Administratorem danych osobowych przesłanych przez formularz kontaktowy jest {site.legalName}, {site.city}. Kontakt w sprawie danych:{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <h2>Cel i podstawa przetwarzania</h2>
          <p>
            Dane (imię i nazwisko, numer telefonu, adres e-mail, treść zapytania) przetwarzamy wyłącznie po to, by odpowiedzieć na zapytanie i przygotować
            wycenę – na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO) oraz działań przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).
          </p>
          <h2>Okres przechowywania</h2>
          <p>Dane przechowujemy do czasu udzielenia odpowiedzi, a jeśli dojdzie do zawarcia umowy – przez okres wymagany przepisami.</p>
          <h2>Twoje prawa</h2>
          <p>
            Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz cofnięcia zgody w dowolnym momencie.
            Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
          </p>
          <h2>Pliki cookies</h2>
          <p>Strona nie używa plików cookies analitycznych ani marketingowych.</p>
        </div>
      </section>
    </>
  );
}

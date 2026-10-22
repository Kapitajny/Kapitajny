import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Regulamin zajęć i karnetów studia tańca Swoboda (wersja robocza, przykładowa).",
  alternates: { canonical: "/regulamin" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Regulamin zajęć" updated="21 października 2026 r.">
      <LegalSection title="1. Postanowienia ogólne">
        <p>
          Regulamin określa zasady uczestnictwa w zajęciach studia tańca Swoboda. <strong>[Do uzupełnienia: dane podmiotu prowadzącego studio.]</strong>
          Wszystkie zasady poniżej są propozycjami przykładowymi i wymagają akceptacji przez studio.
        </p>
      </LegalSection>

      <LegalSection title="2. Zapisy i lekcja próbna">
        <ul className="list-disc space-y-2 pl-6">
          <li>Na lekcję próbną można zapisać się przez formularz na stronie (po jego uruchomieniu), telefonicznie lub mailowo.</li>
          <li>Lekcja próbna obejmuje jedne zajęcia w grupie na poziomie „Od zera” lub „Podstawowy”.</li>
          <li>Zajęcia przeznaczone są dla osób dorosłych. [Do potwierdzenia: minimalny wiek uczestników i zasady udziału osób niepełnoletnich.]</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Karnety i płatności">
        <ul className="list-disc space-y-2 pl-6">
          <li>Ceny i okresy ważności karnetów podane na stronie mają charakter przykładowy.</li>
          <li>Pakiety 4 i 8 zajęć są ważne odpowiednio 30 i 45 dni od pierwszych zajęć; karnet miesięczny – 30 dni od zakupu.</li>
          <li>[Do uzupełnienia: formy płatności, wystawianie faktur, zasady przedłużania i zwrotów.]</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Odwoływanie zajęć">
        <ul className="list-disc space-y-2 pl-6">
          <li>Propozycja: nieobecność zgłoszona najpóźniej 6 godzin przed zajęciami nie zużywa wejścia z pakietu.</li>
          <li>Studio może odwołać lub przenieść zajęcia z ważnych przyczyn – uczestnicy zostaną poinformowani niezwłocznie, a wejście nie przepada.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Bezpieczeństwo">
        <ul className="list-disc space-y-2 pl-6">
          <li>Uczestnik powinien poinformować instruktora o kontuzjach i przeciwwskazaniach zdrowotnych przed zajęciami.</li>
          <li>W razie wątpliwości co do stanu zdrowia zalecamy konsultację z lekarzem przed rozpoczęciem zajęć.</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}

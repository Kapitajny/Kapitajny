import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Zasady wynajmu" };

export default function RulesPage() {
  return (
    <LegalPage title="Zasady wynajmu">
      <h2>Uprawnienia</h2>
      <p>
        Przy każdym skuterze podajemy, czy jego prowadzenie wymaga patentu sternika motorowodnego. Skutery oznaczone jako dostępne bez patentu można prowadzić bez tego
        dokumentu tylko na warunkach opisanych przy modelu. Brak wymogu patentu nie zwalnia z pozostałych zasad poniżej.
      </p>
      <p>
        Podstawa prawna i szczegółowe warunki: <Todo>przepisy i warunki zweryfikowane przez właściciela</Todo>.
      </p>
      <h2>Wiek i dokumenty</h2>
      <ul>
        <li>
          Minimalny wiek kierującego: <Todo>wiek</Todo>.
        </li>
        <li>Przy wydaniu skutera okazujesz dokument tożsamości, a w przypadku modeli wymagających uprawnień także patent.</li>
      </ul>
      <h2>Bezpieczeństwo</h2>
      <ul>
        <li>Każda osoba na skuterze płynie w kamizelce asekuracyjnej zapewnionej przez wypożyczalnię.</li>
        <li>Przed wypłynięciem przechodzisz instruktaż: obsługa skutera, zasady na wodzie, granice akwenu, postępowanie po wywrotce.</li>
        <li>Pływanie po alkoholu lub innych substancjach jest zabronione – w takim przypadku nie wydajemy skutera.</li>
        <li>Pływasz wyłącznie w wyznaczonym akwenie i z dala od kąpielisk, pomostów i innych jednostek.</li>
      </ul>
      <h2>Akwen</h2>
      <p>
        Granice akwenu i obowiązujące na nim ograniczenia: <Todo>opis akwenu i przepisów lokalnych</Todo>.
      </p>
      <h2>Zwrot i uszkodzenia</h2>
      <ul>
        <li>Skuter zwracasz o godzinie podanej w rezerwacji, w godzinach otwarcia przystani.</li>
        <li>Uszkodzenia zgłaszasz od razu po powrocie. Zasady rozliczenia szkód i kaucji opisuje regulamin.</li>
      </ul>
    </LegalPage>
  );
}

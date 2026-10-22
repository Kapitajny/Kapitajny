/**
 * ★ Z CZYM MOŻNA PRZYJŚĆ – dolegliwości pogrupowane według okolic ciała.
 *
 * Pacjenci szukają gabinetu po tym, co ich boli, a nie po nazwie zabiegu.
 * Treść ma charakter informacyjny: nie obiecuje wyleczenia, a o planie terapii
 * decyduje fizjoterapeuta po ocenie. Usuń okolice, z którymi gabinet nie pracuje.
 * `services` to slugi z data/services.ts – pokazują, która usługa zwykle pasuje.
 */

export interface ConditionGroup {
  id: string;
  label: string;
  problems: string[];
  approach: string;
  services: string[];
}

export const CONDITION_GROUPS: ConditionGroup[] = [
  {
    id: "kark",
    label: "Kark i odcinek szyjny",
    problems: [
      "ból karku przy pracy przy komputerze",
      "sztywność i ograniczony skręt głowy",
      "ból promieniujący do barku lub łopatki",
      "napięciowe bóle głowy związane z karkiem",
    ],
    approach:
      "Sprawdzamy ruchomość odcinka szyjnego, ustawienie głowy i barków oraz to, co nasila dolegliwości w ciągu dnia. Terapia łączy pracę manualną z ćwiczeniami, które łatwo wpleść w dzień pracy.",
    services: ["terapia-bolu-plecow-i-karku", "fizjoterapia-indywidualna"],
  },
  {
    id: "ledzwie",
    label: "Dolna część pleców",
    problems: [
      "ból krzyża przy siedzeniu, schylaniu lub po wstaniu z łóżka",
      "ból promieniujący do pośladka lub nogi",
      "nawracające „postrzały”",
      "dolegliwości po dłuższym wysiłku",
    ],
    approach:
      "Szukamy ruchów i pozycji, które zmniejszają i nasilają ból, a potem stopniowo przywracamy pełną aktywność – od ćwiczeń w odciążeniu po codzienne czynności.",
    services: ["terapia-bolu-plecow-i-karku", "cwiczenia-usprawniajace"],
  },
  {
    id: "bark",
    label: "Bark",
    problems: ["ból przy unoszeniu ręki", "ograniczony zakres ruchu", "stan po zwichnięciu lub urazie barku", "ból barku w nocy"],
    approach:
      "Oceniamy zakres ruchu i siłę mięśni obręczy barkowej. Plan obejmuje ćwiczenia przywracające ruch i kontrolę łopatki, dostosowane do etapu gojenia.",
    services: ["rehabilitacja-ortopedyczna", "fizjoterapia-indywidualna"],
  },
  {
    id: "lokiec",
    label: "Łokieć, nadgarstek i dłoń",
    problems: ["ból bocznej lub przyśrodkowej strony łokcia", "przeciążenia od pracy przy komputerze lub narzędziach", "stan po złamaniu w obrębie nadgarstka"],
    approach: "Pracujemy nad zmniejszeniem przeciążenia i stopniowym budowaniem tolerancji tkanek na wysiłek – z ćwiczeniami do wykonywania w domu.",
    services: ["rehabilitacja-ortopedyczna", "cwiczenia-usprawniajace"],
  },
  {
    id: "biodro",
    label: "Biodro",
    problems: ["ból biodra przy chodzeniu lub wchodzeniu po schodach", "sztywność biodra po siedzeniu", "stan po endoprotezoplastyce stawu biodrowego"],
    approach: "Skupiamy się na ruchomości, sile mięśni pośladkowych i pewnym chodzie. Po operacji postępujemy zgodnie z zaleceniami lekarza prowadzącego.",
    services: ["rehabilitacja-pooperacyjna", "cwiczenia-usprawniajace"],
  },
  {
    id: "kolano",
    label: "Kolano",
    problems: ["ból kolana przy schodach, kucaniu lub bieganiu", "stan po skręceniu kolana", "stan po rekonstrukcji więzadła lub artroskopii", "obrzęk i uczucie niestabilności"],
    approach:
      "Na podstawie badania i zaleceń lekarza ustalamy etapy powrotu do sprawności: od kontroli obrzęku i zakresu ruchu do siły i aktywności, którą chcesz wrócić.",
    services: ["rehabilitacja-ortopedyczna", "rehabilitacja-pooperacyjna"],
  },
  {
    id: "stopa",
    label: "Stopa i staw skokowy",
    problems: ["stan po skręceniu stawu skokowego", "ból pięty przy pierwszych krokach rano", "ból ścięgna Achillesa", "uczucie niestabilności kostki"],
    approach: "Przywracamy ruchomość i siłę, a następnie równowagę i kontrolę – tak, by stopa znów pewnie radziła sobie z chodzeniem, bieganiem czy pracą na stojąco.",
    services: ["rehabilitacja-ortopedyczna", "cwiczenia-usprawniajace"],
  },
  {
    id: "po-operacji",
    label: "Po operacji lub urazie",
    problems: ["rehabilitacja po zabiegach ortopedycznych", "powrót do sprawności po złamaniu", "osłabienie po dłuższym unieruchomieniu"],
    approach:
      "Pracujemy według zaleceń lekarza i karty informacyjnej z leczenia. Tempo i zakres ćwiczeń dostosowujemy do etapu gojenia i Twojego samopoczucia.",
    services: ["rehabilitacja-pooperacyjna", "rehabilitacja-ortopedyczna"],
  },
];

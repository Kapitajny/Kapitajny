import Link from "next/link";

const STEPS = [
  {
    title: "Wybierz interesujący Cię styl",
    text: "Przejrzyj opisy zajęć albo sprawdź, dla kogo są poszczególne grupy. Jeśli się wahasz, zaznacz w formularzu „Jeszcze nie wiem”.",
  },
  {
    title: "Zapisz się na zajęcia próbne",
    text: "Wypełnij krótki formularz lub zadzwoń. Odpowiemy z propozycją terminu i wszystkim, co warto wiedzieć przed pierwszą wizytą.",
  },
  {
    title: "Przyjdź do studia i zacznij tańczyć",
    text: "Przyjdź około 10 minut wcześniej. Instruktor przywita Cię przed zajęciami i zapyta o doświadczenie oraz ewentualne kontuzje.",
  },
];

const FIRST_VISIT = [
  "Rozgrzewka, która przygotowuje ciało i pozwala oswoić się z salą.",
  "Nauka krótkiej sekwencji ruchów krok po kroku, z wieloma powtórzeniami.",
  "Możesz w każdej chwili zrobić przerwę, napić się wody albo tańczyć w swoim tempie.",
  "Na koniec chwila na pytania: czy grupa Ci pasuje i co dalej.",
];

export function GettingStarted() {
  return (
    <section id="jak-zaczac" aria-labelledby="jak-zaczac-title" className="on-dark band section-y bg-cocoa text-ivory">
      <div className="container-x">
        <h2 id="jak-zaczac-title" className="h2 max-w-[16ch]">
          Jak zacząć? Trzy kroki do pierwszych zajęć
        </h2>

        {/* Kroki to prawdziwa sekwencja, więc numerujemy je – cyframi z odliczania. */}
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t-2 border-blush pt-6">
              <span className="block text-[5rem] font-bold leading-[0.8] tracking-[-0.04em] text-blush [font-stretch:75%]" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="h3 mt-5">{step.title}</h3>
              <p className="mt-3 max-w-[38ch] text-ivory/90">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-8 rounded-[1.75rem] bg-ivory p-7 text-cocoa sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="h3">Co wydarzy się na pierwszych zajęciach?</h3>
            <p className="mt-3">Wiemy, że pierwsza wizyta bywa stresująca. Oto, czego możesz się spodziewać.</p>
          </div>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {FIRST_VISIT.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-rose" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="#zapis" className="btn btn-light mt-10">
          Przejdź do formularza zapisu
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";

const STEPS = [
  {
    title: "Wybierz interesujący Cię styl",
    text: "Przejrzyj opisy zajęć albo sekcję „Dla kogo”. Jeśli się wahasz, zaznacz w formularzu „Jeszcze nie wiem” – podpowiemy.",
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
  "Nauka krótkiej sekwencji ruchów – krok po kroku, z wieloma powtórzeniami.",
  "Możesz w każdej chwili zrobić przerwę, napić się wody albo tańczyć w swoim tempie.",
  "Na koniec chwila na pytania: czy grupa Ci pasuje i co dalej.",
];

export function GettingStarted() {
  return (
    <section id="jak-zaczac" aria-labelledby="jak-zaczac-title" className="section-y bg-blush">
      <div className="container-x">
        <p className="eyebrow">Jak zacząć?</p>
        <h2 id="jak-zaczac-title" className="h2 mt-5 max-w-[18ch] text-wine">
          Trzy kroki do pierwszych zajęć
        </h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="font-serif text-[5.5rem] leading-none text-wine" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="mt-4 font-serif text-[1.85rem] leading-tight">{step.title}</h3>
              <p className="mt-3 max-w-[38ch]">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-8 border-t border-cocoa/20 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-3xl leading-tight">Co wydarzy się na pierwszych zajęciach?</h3>
            <p className="mt-3">Wiemy, że pierwsza wizyta bywa stresująca. Oto, czego możesz się spodziewać.</p>
          </div>
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-8">
            {FIRST_VISIT.map((item) => (
              <li key={item} className="flex gap-4">
                <span className="mt-3 h-px w-6 shrink-0 bg-wine" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="#zapis" className="btn btn-primary mt-12">
          Przejdź do formularza zapisu
        </Link>
      </div>
    </section>
  );
}

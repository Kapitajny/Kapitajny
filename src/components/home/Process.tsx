const STEPS = [
  { title: "Wybierz skuter", text: "Porównaj modele, moc i ceny." },
  { title: "Wybierz datę i godzinę", text: "Widzisz tylko wolne terminy." },
  { title: "Określ czas wynajmu", text: "Od 1 do 24 godzin." },
  { title: "Zarezerwuj termin", text: "Dostajesz numer i link do rezerwacji." },
  { title: "Przyjedź na przystań", text: "Z dokumentem tożsamości, kwadrans wcześniej." },
  { title: "Przejdź instruktaż", text: "Obsługa skutera, zasady, granice akwenu." },
  { title: "Wypłyń", text: "Zatoka Gdańska jest Twoja." },
];

export function Process() {
  return (
    <ol className="relative grid gap-0 md:grid-cols-7 md:gap-4">
      <span aria-hidden="true" className="process-wake absolute bottom-6 left-[1.6rem] top-6 w-1 bg-turq md:bottom-auto md:left-0 md:right-0 md:top-[1.6rem] md:h-1 md:w-auto md:-skew-y-1" />
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 pb-8 md:block md:pb-0">
          <span className="relative grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full bg-graphite font-display text-2xl font-extrabold text-white" aria-hidden="true">
            {i + 1}
          </span>
          <div className="pt-2 md:pt-5">
            <h3 className="font-sans text-lg font-bold normal-case leading-snug tracking-normal">
              <span className="sr-only">Krok {i + 1}: </span>
              {s.title}
            </h3>
            <p className="mt-1 text-[0.98rem] text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

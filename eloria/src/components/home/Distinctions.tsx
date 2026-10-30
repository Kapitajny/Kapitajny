const items = [
  {
    title: "Lekarz przy każdym zabiegu medycznym",
    text: "Zabiegi z zakresu medycyny estetycznej wykonuje wyłącznie lekarz – zawsze po konsultacji i kwalifikacji.",
  },
  {
    title: "Czas na wizytę",
    text: "Konsultacje planujemy z zapasem, tak żeby było miejsce na pytania i rozmowę bez zerkania na zegarek.",
  },
  {
    title: "Lekarz i kosmetolog w jednym zespole",
    text: "Terapie łączone prowadzimy wspólnie, na podstawie jednej dokumentacji i jednego planu.",
  },
  {
    title: "Jasne zasady przed zabiegiem",
    text: "Znasz przebieg, możliwe działania niepożądane i koszt. Zgodę podpisujesz po rozmowie, nigdy w pośpiechu.",
  },
  {
    title: "Kameralne wnętrze",
    text: "Kilka gabinetów w kamienicy w Śródmieściu. Wizyty planujemy tak, by nie mijać się w zatłoczonej poczekalni.",
  },
];

export function Distinctions() {
  return (
    <section aria-labelledby="wyrozniki" data-surface="dark" className="bg-espresso text-ivory">
      <div className="frame grid gap-y-14 py-24 lg:grid-cols-12 lg:gap-x-8 lg:py-32">
        <div className="lg:col-span-4">
          <h2 id="wyrozniki" className="text-[clamp(2.5rem,5vw,3.75rem)] text-ivory lg:sticky lg:top-32">
            Na czym nam zależy
          </h2>
        </div>
        <dl className="lg:col-span-7 lg:col-start-6">
          {items.map((item) => (
            <div key={item.title} className="grid gap-3 border-t border-ivory/15 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-10">
              <dt className="font-serif text-2xl leading-tight text-ivory">{item.title}</dt>
              <dd className="text-ivory/75">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

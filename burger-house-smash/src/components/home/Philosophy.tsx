import Image from "next/image";

const STEPS = [
  {
    title: "Kula",
    img: { src: "/images/kule.jpg", alt: "Kule świeżo mielonej wołowiny ułożone na stalowej tacy" },
    text: "Codziennie rano mielimy łopatkę z mostkiem w proporcji 80/20 i formujemy kule po 75 g. Mięso, które nie zejdzie do zamknięcia, nie trafia na blachę następnego dnia.",
  },
  {
    title: "Docisk",
    img: { src: "/images/docisk.jpg", alt: "Dłoń kucharza dociska stalową prasą kulę wołowiny do gorącej blachy" },
    text: "Kula ląduje na blasze rozgrzanej do 230°C i od razu dociskamy ją stalową prasą. Mięso dotyka metalu całą powierzchnią, więc brzegi robią się chrupiące i koronkowe.",
  },
  {
    title: "Ser i bułka",
    img: { src: "/images/ser.jpg", alt: "Cienkie kotlety z plastrami topiącego się cheddaru na blasze, obok przypiekane bułki" },
    text: "Po 90 sekundach odwracamy kotlet, kładziemy cheddar i na chwilę przykrywamy. Obok na maśle przypieka się bułka ziemniaczana.",
  },
];

const SOURCES = [
  { name: "Wołowina", text: "Z polskich hodowli, mielona na miejscu każdego ranka." },
  { name: "Bułki", text: "Ziemniaczane. Pieczemy je sami w Grodzisku i rozwozimy do obu lokali." },
  { name: "Ogórki", text: "Kisimy sami: trzy tygodnie w beczce z czosnkiem i koprem." },
  { name: "Frytki", text: "Z całych ziemniaków. Kroimy rano, smażymy dwa razy." },
];

export function Philosophy() {
  return (
    <section id="filozofia" className="philo" aria-labelledby="philo-title">
      <div className="wrap">
        <div className="philo__head">
          <h2 id="philo-title" className="h2" data-reveal="">
            Nasza filozofia
          </h2>
          <p className="philo__lead">
            Smash burger to prosta rzecz zrobiona porządnie: świeża wołowina, gorąca blacha i mocny docisk. W kuchni nie mamy mikrofali, lamp grzewczych ani
            zamrażarki na mięso.
          </p>
        </div>

        <ol className="steps" aria-label="Jak powstaje burger">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step" data-reveal="" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <div className="step__shot">
                <Image src={s.img.src} alt={s.img.alt} width={1136} height={1408} sizes="(max-width: 760px) 34vw, 30vw" />
              </div>
              <div className="step__text">
                <p className="step__n" aria-hidden="true">
                  {i + 1}
                </p>
                <h3 className="step__title">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="sources">
          <h3 className="sources__title">Skąd to mamy</h3>
          <dl className="sources__list">
            {SOURCES.map((s) => (
              <div key={s.name}>
                <dt>{s.name}</dt>
                <dd>{s.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

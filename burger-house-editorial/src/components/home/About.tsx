import Image from "next/image";

const STEPS = [
  { year: "2019", text: "Food truck na placu w Śródmieściu. Jedna płyta grillowa, kilka burgerów naraz, każdy dopiero po zamówieniu." },
  { year: "2021", text: "Marszałkowska 25. Otwarta kuchnia, a wołowinę z polskich gospodarstw mielimy na miejscu przed otwarciem." },
  { year: "2023", text: "Grodzisk Mazowiecki i własna piekarnia. Stąd każdego ranka wyjeżdżają bułki brioche do obu kuchni." },
];

export function About() {
  return (
    <section id="o-nas" className="section frame" aria-labelledby="about-title">
      <div className="grid">
        <h2 id="about-title" className="big about__title">
          Od jednej
          <br />
          płyty
        </h2>
        <div className="about__text">
          <p className="prose prose--lg">Karta jest krótka, bo przy każdej pozycji chcemy stać osobiście.</p>
          <p className="prose grey">
            Mięso mielimy rano, warzywa przyjeżdżają codziennie, sosy i lemoniadę robimy sami w małych partiach. Kotlet trafia na płytę, kiedy przyjmujemy
            zamówienie. Od płyty do lady mija około siedmiu minut.
          </p>
        </div>
        <figure className="about__tall reveal">
          <Image
            src="/images/patty.jpg"
            alt="Dłonie formują gruby kotlet ze świeżo mielonej wołowiny na stalowym blacie posypanym solą"
            width={1136}
            height={1408}
            sizes="(max-width: 760px) 100vw, 34vw"
          />
        </figure>
        <figure className="about__small">
          <div className="reveal">
            <Image
              src="/images/buns.jpg"
              alt="Rzędy świeżo upieczonych bułek brioche stygnące na kratce w porannym świetle"
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 100vw, 25vw"
            />
          </div>
          <figcaption className="label grey">Bułki z piekarni w Grodzisku, pieczone codziennie od 5:00.</figcaption>
        </figure>
        <blockquote className="about__quote">
          <p>Mniej pozycji w karcie, więcej uwagi przy każdej z nich.</p>
          <cite className="label grey">Zasada zapisana na ścianie obu kuchni</cite>
        </blockquote>
        <figure className="about__wide reveal">
          <Image
            src="/images/grill.jpg"
            alt="Kucharz w czarnym fartuchu dociska kotlet szpatułą na stalowej płycie, unosi się para"
            width={1680}
            height={944}
            sizes="100vw"
          />
        </figure>
        <ol className="timeline">
          {STEPS.map((s) => (
            <li key={s.year}>
              <b className="num">{s.year}</b>
              <p className="prose grey">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

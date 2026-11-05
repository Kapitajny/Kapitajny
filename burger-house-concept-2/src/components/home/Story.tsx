import Image from "next/image";

const STEPS = [
  {
    year: "2019",
    title: "Food truck i jedna płyta",
    text: "Zaczęliśmy od przyczepy na placu w centrum Warszawy. Kilka burgerów naraz, każdy smażony dopiero po zamówieniu, bo inaczej nie umieliśmy.",
    image: { src: "/images/c2-o-nas-foodtruck.jpg", alt: "Food truck BUŁA wieczorem na placu, kilka osób czeka przy okienku", w: 600, h: 400 },
  },
  {
    year: "2021",
    title: "Marszałkowska 25",
    text: "Pierwszy stały lokal z otwartą kuchnią. Wołowinę z polskich gospodarstw zaczęliśmy mielić na miejscu, każdego ranka przed otwarciem.",
    image: { src: "/images/c2-o-nas-rzeznik.jpg", alt: "Wołowina mielona w stalowej maszynce w kuchni restauracji", w: 484, h: 600 },
  },
  {
    year: "2023",
    title: "Grodzisk i własna piekarnia",
    text: "Drugi lokal przy 11 Listopada, a w nim piecownia. Stąd każdego ranka wyjeżdżają bułki brioche do obu kuchni.",
    image: { src: "/images/c2-o-nas-piekarnia.jpg", alt: "Piekarz wyjmuje z pieca blachę złotych bułek brioche", w: 600, h: 400 },
  },
];

const VALUES = [
  { title: "Świeże składniki", text: "Mięso mielone rano, warzywa dostarczane codziennie, sery od jednego dostawcy z Mazowsza." },
  { title: "Własne receptury", text: "Sos BUŁA, majonez truflowy, sos z habanero i lemoniadę robimy sami, w małych partiach." },
  { title: "Na bieżąco", text: "Nie trzymamy gotowych kotletów pod lampą. Burger powstaje w około siedem minut od zamówienia." },
];

export function Story() {
  return (
    <section id="o-nas" className="section stone" aria-labelledby="story-title">
      <div className="wrap">
        <div className="story">
          <div className="story__intro">
            <h2 id="story-title" className="display h2">
              Krótka karta, długa lista dostawców
            </h2>
            <p className="lead">
              Od pierwszego dnia trzymamy się jednej zasady: mniej pozycji w karcie, więcej uwagi przy każdej z nich. Tak wyglądała droga od przyczepy do
              dwóch lokali.
            </p>
          </div>
          <ol className="timeline">
            {STEPS.map((s) => (
              <li key={s.year} className="step">
                <span className="step__year">{s.year}</span>
                <div className="step__body">
                  <h3 className="h3">{s.title}</h3>
                  <p className="muted">{s.text}</p>
                  <div className="step__photo">
                    <Image src={s.image.src} alt={s.image.alt} width={s.image.w} height={s.image.h} sizes="(max-width: 1000px) 100vw, 40vw" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="values">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="h3">{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

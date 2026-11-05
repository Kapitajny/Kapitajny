import Image from "next/image";
import { SITE } from "@/data/site";

const VALUES = [
  {
    title: "Świeże składniki",
    text: "Wołowinę z polskich gospodarstw mielimy na miejscu każdego ranka. Warzywa przyjeżdżają codziennie, a bułki pieczemy w naszej piekarni w Grodzisku.",
  },
  {
    title: "Własne receptury",
    text: "Sos BUŁA, majonez truflowy, sos z habanero i lemoniadę robimy sami, w małych partiach. Receptur nie kupujemy w wiaderkach.",
  },
  {
    title: "Na bieżąco, nie na zapas",
    text: "Nie trzymamy kotletów pod lampą. Mięso trafia na płytę, kiedy przyjmujemy zamówienie – od płyty do lady mija około siedmiu minut.",
  },
];

export function About() {
  return (
    <section id="o-nas" className="section on-cream" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          <div className="about__text" data-reveal>
            <h2 id="about-title" className="display h2">
              Jedna płyta, jedna zasada
            </h2>
            <p className="lead">
              BUŁA zaczęła się w {SITE.founded} roku od food trucka i jednej płyty grillowej. Smażyliśmy kilka burgerów naraz, każdy dopiero po
              zamówieniu, bo inaczej nie umieliśmy.
            </p>
            <p>
              Kolejki rosły, więc otworzyliśmy lokal przy Marszałkowskiej, a potem drugi – w Grodzisku Mazowieckim, gdzie dziś pieczemy bułki dla
              obu kuchni. Zasada została ta sama: karta jest krótka, składniki świeże, a burger powstaje w chwili, gdy go zamawiasz.
            </p>
            <blockquote className="about__quote">
              <p>Mniej pozycji w karcie, więcej uwagi przy każdej z nich.</p>
              <cite>Filozofia, którą zapisaliśmy na ścianie obu kuchni</cite>
            </blockquote>
          </div>

          <div className="about__photos" data-reveal style={{ ["--reveal-delay" as string]: "0.12s" }}>
            <div className="about__photo-main">
              <Image
                src="/images/o-nas-grill.jpg"
                alt="Kucharz dociska szpatułą kotlety na gorącej płycie grillowej, na części z nich topi się cheddar"
                width={1136}
                height={1408}
                sizes="(max-width: 960px) 78vw, 40vw"
              />
            </div>
            <div className="about__photo-side">
              <Image
                src="/images/o-nas-skladanie.jpg"
                alt="Dłonie w czarnych rękawiczkach nakładają górną bułkę na świeżo złożonego cheeseburgera"
                width={1136}
                height={1408}
                sizes="(max-width: 960px) 48vw, 24vw"
              />
            </div>
          </div>
        </div>

        <div className="about__band" data-reveal>
          <div className="about__band-media">
            <Image
              src="/images/o-nas-skladniki.jpg"
              alt="Świeże składniki na desce: uformowane kotlety z wołowiny, pomidory, sałata, czerwona cebula, ogórki, cheddar i bułki"
              fill
              sizes="(max-width: 960px) 100vw, 56vw"
            />
          </div>
          <div className="about__values">
            {VALUES.map((v) => (
              <div key={v.title}>
                <h3 className="h3">{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

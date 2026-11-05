import Image from "next/image";
import { formatPrice, getItem } from "@/data/menu";

const PICKS = [
  { id: "double-cheese", src: "/images/double-cheese.jpg", w: 1136, h: 1408, alt: "Double Cheese z chrupiącymi brzegami kotletów, cheddarem, ogórkiem i białą cebulą na białym papierze" },
  { id: "bbq-bacon", src: "/images/bbq-bacon.jpg", w: 1088, h: 1456, alt: "BBQ Bacon z bekonem, krążkami cebuli i sosem BBQ na kamiennym postumencie w bocznym świetle" },
  { id: "big-house", src: "/images/big-house.jpg", w: 1024, h: 1536, alt: "Big House z trzema kotletami, cheddarem i bekonem, przebity drewnianym patyczkiem, na tle szarej ściany" },
];

export function Picks() {
  return (
    <section className="section frame" aria-labelledby="picks-title">
      <div className="grid shead">
        <h2 id="picks-title" className="big shead__title">
          Zamawiane najczęściej
        </h2>
        <p className="prose grey shead__note">Trzy burgery, które co tydzień wychodzą z obu kuchni w największej liczbie.</p>
      </div>
      <ul className="grid spread">
        {PICKS.map((p) => {
          const item = getItem(p.id);
          return (
            <li key={p.id} className="pick">
              <a href={`#${p.id}`} className="pick__link">
                <div className="zoom reveal">
                  <Image className="pick__img" src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 760px) 90vw, 40vw" />
                </div>
                <div className="pick__row">
                  <h3 className="title">{item.name}</h3>
                  <span className="pick__price num">{formatPrice(item.price)}</span>
                </div>
                <p className="pick__desc">{item.description}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

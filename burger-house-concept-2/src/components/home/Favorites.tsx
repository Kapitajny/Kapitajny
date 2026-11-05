import Image from "next/image";
import { formatPrice, getItem } from "@/data/menu";

const FAVS = [
  { id: "double-cheese", image: "/images/c2-double-cheese.jpg", alt: "Double Cheese na papierze na stalowym blacie, cheddar spływa z kotletów" },
  { id: "bbq-bacon", image: "/images/c2-bbq-bacon.jpg", alt: "BBQ Bacon z bekonem i krążkami cebuli na drewnianym stole w popołudniowym słońcu, obok frytki" },
  { id: "fire-burger", image: "/images/c2-fire-burger.jpg", alt: "Fire Burger z jalapeño i ostrym sosem na papierze w czerwono-białą kratkę, obok papryczki chili" },
  { id: "big-house", image: "/images/c2-big-house.jpg", alt: "Wysoki Big House z trzema kotletami na drewnianej desce przy oknie" },
];

export function Favorites() {
  return (
    <section className="section" aria-labelledby="fav-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="fav-title" className="display h2">
            Cztery, po które wracacie najczęściej
          </h2>
          <p className="lead muted">Najczęściej zamawiane w obu lokalach. Cenę znajdziesz na naklejce, skład pod zdjęciem.</p>
        </div>
        <ul className="favs">
          {FAVS.map((f) => {
            const item = getItem(f.id);
            const [zl, gr] = formatPrice(item.price).replace(" zł", "").split(",");
            return (
              <li key={f.id}>
                <a className="fav" href={`#${f.id}`}>
                  <div className="fav__media">
                    <Image src={f.image} alt={f.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 25vw" />
                    <span className="sticker" aria-hidden="true">
                      <b>
                        {zl},{gr}
                      </b>
                      <small>zł</small>
                    </span>
                  </div>
                  <div className="fav__name">
                    <h3 className="h3">{item.name}</h3>
                    <span className="sr-only">{formatPrice(item.price)}</span>
                  </div>
                  <p className="fav__desc">{item.description}</p>
                  <span className="fav__more">Zobacz w menu</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

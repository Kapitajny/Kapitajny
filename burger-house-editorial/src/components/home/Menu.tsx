import Image from "next/image";
import { CATEGORIES, formatPrice, MENU } from "@/data/menu";
import { SITE } from "@/data/site";

const SHORT: Record<string, string> = {
  klasyczne: "Klasyczne",
  premium: "Premium",
  ostre: "Ostre",
  zestawy: "Zestawy",
  dodatki: "Dodatki",
  napoje: "Napoje",
};

export function Menu() {
  return (
    <section id="menu" className="section frame" aria-labelledby="menu-title">
      <div className="grid shead">
        <h2 id="menu-title" className="mega menu-title shead__title">
          Menu
        </h2>
        <p className="prose grey shead__note">
          {MENU.length} pozycje w sześciu kategoriach. Ceny brutto, takie same w Warszawie i w Grodzisku Mazowieckim.
        </p>
      </div>
      <nav className="menu-index" aria-label="Kategorie menu">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`#kat-${c.id}`}>
            {c.label}
            <sup className="num">{MENU.filter((m) => m.category === c.id).length}</sup>
          </a>
        ))}
      </nav>

      {CATEGORIES.map((c) => {
        const items = MENU.filter((m) => m.category === c.id);
        return (
          <section key={c.id} id={`kat-${c.id}`} className="cat" data-layout={c.layout} aria-labelledby={`kat-${c.id}-h`}>
            <div className="cat__head">
              <h3 id={`kat-${c.id}-h`} className="mega cat__name">
                {SHORT[c.id]}
              </h3>
              <span className="cat__count num" aria-label={`${items.length} pozycje`}>
                {items.length}
              </span>
            </div>
            <div className="grid cat__body">
              <figure className="cat__media">
                <div className="reveal">
                  <Image src={c.photo.src} alt={c.photo.alt} width={c.photo.w} height={c.photo.h} sizes="(max-width: 760px) 90vw, 50vw" />
                </div>
              </figure>
              <div className="cat__text">
                <p className="cat__note">{c.note}</p>
                <ul className="cat__list">
                  {items.map((m) => (
                    <li key={m.id} id={m.id} className="dish">
                      <h4 className="dish__name">{m.name}</h4>
                      <span className="dish__price num">{formatPrice(m.price)}</span>
                      <p className="dish__desc">{m.description}</p>
                      {(m.tag || m.heat) && (
                        <p className="dish__meta">
                          {m.tag && <span>{m.tag}</span>}
                          {m.heat && <span className="dish__heat">Ostrość {m.heat}/3</span>}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <div className="grid menu-foot">
        <p className="prose grey">
          Burgery podajemy w maślanej bułce brioche, bułka bezglutenowa kosztuje 4 zł więcej. O alergeny w konkretnej pozycji zapytaj obsługę lokalu.
        </p>
        <a className="btn" href={SITE.phone.href}>
          Zamów teraz
        </a>
      </div>
    </section>
  );
}

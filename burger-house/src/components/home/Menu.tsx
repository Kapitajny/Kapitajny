"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CATEGORIES, MENU, type CategoryId } from "@/data/menu";
import { SITE } from "@/data/site";
import { PhoneIcon } from "../Icons";
import { ProductCard } from "../ProductCard";

const itemCategory = new Map(MENU.map((m) => [m.id, m.category]));
const categoryIds = new Set<string>(CATEGORIES.map((c) => c.id));

export function Menu() {
  const [active, setActive] = useState<CategoryId>("klasyczne");
  const [entering, setEntering] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const select = useCallback((id: CategoryId, focus = false) => {
    setActive(id);
    setEntering(true);
    if (focus) document.getElementById(`tab-${id}`)?.focus();
    document.getElementById(`tab-${id}`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  // linki typu /#fire-burger (z bestsellerów) lub /#menu-ostre przełączają kategorię
  useEffect(() => {
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      const cat = itemCategory.get(hash) ?? (hash.startsWith("menu-") && categoryIds.has(hash.slice(5)) ? (hash.slice(5) as CategoryId) : null);
      if (!cat) return;
      select(cat);
      if (itemCategory.has(hash)) {
        setTarget(hash);
      } else {
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [select]);

  useEffect(() => {
    if (!entering) return;
    const t = window.setTimeout(() => setEntering(false), 700);
    return () => window.clearTimeout(t);
  }, [entering, active]);

  // po wyrenderowaniu właściwej kategorii przewijamy do wskazanej pozycji i na chwilę ją podświetlamy
  useEffect(() => {
    if (!target) return;
    const el = document.getElementById(target);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    const t = window.setTimeout(() => setTarget(null), 2400);
    return () => window.clearTimeout(t);
  }, [target]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = CATEGORIES.findIndex((c) => c.id === active);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % CATEGORIES.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + CATEGORIES.length) % CATEGORIES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = CATEGORIES.length - 1;
    else return;
    e.preventDefault();
    select(CATEGORIES[next].id, true);
  };

  const category = CATEGORIES.find((c) => c.id === active)!;
  const items = MENU.filter((m) => m.category === active);

  return (
    <section id="menu" className="section" aria-labelledby="menu-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div className="section-head__text">
            <h2 id="menu-title" className="display h2">
              Menu
            </h2>
            <p className="lead muted">Sześć kategorii, 22 pozycje. Wszystko przygotowujemy na bieżąco, w obu lokalach według tych samych receptur.</p>
          </div>
        </div>

        <div className="menu-tabs" role="tablist" aria-label="Kategorie menu" ref={tabsRef} onKeyDown={onKeyDown}>
          {CATEGORIES.map((c) => {
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                id={`tab-${c.id}`}
                type="button"
                role="tab"
                className="menu-tab"
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(c.id)}
              >
                {c.label}
                <span className="menu-tab__count" aria-hidden="true">
                  {MENU.filter((m) => m.category === c.id).length}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          className={`menu-panel${entering ? " is-entering" : ""}`}
        >
          <p className="menu-note muted">{category.note}</p>
          <div className="menu-grid">
            {items.map((item) => (
              <ProductCard key={item.id} id={item.id} item={item} className={target === item.id ? "is-target" : undefined} />
            ))}
          </div>
        </div>

        <p className="menu-allergens muted">
          Burgery podajemy w maślanej bułce brioche; bułka bezglutenowa za dopłatą 4 zł. Informację o alergenach w każdej pozycji przekaże obsługa lokalu.
        </p>

        <div className="menu-cta on-dark" data-reveal>
          <p>
            Wiesz już, co zamawiasz?
            <small>Zadzwoń, a zamówienie odbierzesz po około 15 minutach.</small>
          </p>
          <a className="btn" href={SITE.phone.href}>
            <PhoneIcon />
            Zadzwoń i zamów
          </a>
        </div>
      </div>
    </section>
  );
}

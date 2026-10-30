"use client";

import { useState } from "react";
import type { ResolvedImage } from "@/config/images";
import type { CategoryId, PortfolioItem } from "@/data/portfolio";
import { Lightbox } from "./Lightbox";
import { Photo } from "./Photo";
import { Unveil } from "./Unveil";
import styles from "./Gallery.module.css";

export interface GalleryItem extends PortfolioItem {
  photo: ResolvedImage;
}

type Filter = CategoryId | "all";

/**
 * Galeria w asymetrycznym rytmie: sześć różnych pozycji w siatce 12 kolumn powtarza się,
 * a proporcje kadrów pochodzą ze zdjęć. Po kliknięciu kadru otwiera się lightbox.
 */
export function Gallery({ items, categories }: { items: GalleryItem[]; categories: { id: CategoryId; label: string; count: number }[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);
  const labelOf = (id: CategoryId) => categories.find((category) => category.id === id)?.label ?? id;
  const filters: { id: Filter; label: string; count: number }[] = [{ id: "all", label: "All work", count: items.length }, ...categories];

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter the portfolio by category">
        {filters.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.filter}
            aria-pressed={filter === option.id}
            onClick={() => {
              setFilter(option.id);
              setOpenIndex(null);
            }}
          >
            {option.label}
            <sup className={styles.count}>
              <span className="visually-hidden">, </span>
              {option.count}
              <span className="visually-hidden"> photographs</span>
            </sup>
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {filter === "all" ? `Showing all ${visible.length} photographs.` : `Showing ${visible.length} ${labelOf(filter)} photographs.`}
      </p>

      <ul role="list" className={styles.grid} key={filter} data-filter={filter}>
        {visible.map((item, index) => (
          <li key={item.image} className={`${styles.item} ${item.photo.aspect === "2/3" ? styles.tall : ""}`} style={{ ["--n" as string]: index }}>
            <figure className={styles.figure}>
              <button type="button" className={styles.open} onClick={() => setOpenIndex(index)} aria-label={`Open “${item.title}” in full view`}>
                <Unveil className={styles.frame} style={{ aspectRatio: item.photo.aspect }}>
                  <Photo
                    image={item.photo}
                    label={labelOf(item.category)}
                    sizes="(min-width: 1200px) 50vw, (min-width: 600px) 66vw, 92vw"
                  />
                </Unveil>
              </button>
              <figcaption className={styles.caption}>
                <span className={styles.captionTitle}>{item.title}</span>
                <span className={styles.captionMeta}>
                  {filter === "all" && <span className={styles.captionCategory}>{labelOf(item.category)}</span>}
                  <span>
                    {item.place}, {item.year}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Lightbox
        items={visible.map((item) => ({ photo: item.photo, title: item.title, meta: `${labelOf(item.category)}, ${item.place}, ${item.year}` }))}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}

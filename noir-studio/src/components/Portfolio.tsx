import type { ImageKey, ResolvedImage } from "@/config/images";
import { CATEGORIES, PORTFOLIO } from "@/data/portfolio";
import { resolveImage } from "@/lib/images.server";
import { Gallery, type GalleryItem } from "./Gallery";
import styles from "./Portfolio.module.css";

export function Portfolio() {
  const items: GalleryItem[] = PORTFOLIO.map((item) => ({ ...item, photo: resolveImage(item.image as ImageKey) satisfies ResolvedImage }));
  const categories = CATEGORIES.map((category) => ({ ...category, count: PORTFOLIO.filter((item) => item.category === category.id).length }));

  return (
    <section id="portfolio" tabIndex={-1} className={styles.section} aria-labelledby="portfolio-title">
      <div className="container">
        <header className={styles.intro}>
          <h2 id="portfolio-title" className={styles.title}>
            Selected work
          </h2>
          <p className={styles.lead}>
            Weddings, portraits, fashion, commercial commissions and the quieter stories of families at home. Choose a field to see the photographs we made
            there, then open any frame to view it large.
          </p>
        </header>
        <Gallery items={items} categories={categories} />
      </div>
    </section>
  );
}

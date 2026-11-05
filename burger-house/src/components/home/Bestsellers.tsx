import Link from "next/link";
import { BESTSELLER_IDS, getItem } from "@/data/menu";
import { ArrowIcon } from "../Icons";
import { ProductCard } from "../ProductCard";

export function Bestsellers() {
  const items = BESTSELLER_IDS.map(getItem);
  return (
    <section id="bestsellery" className="section on-cream bestsellers" aria-labelledby="bestsellers-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div className="section-head__text">
            <h2 id="bestsellers-title" className="display h2">
              Najczęściej zamawiane
            </h2>
            <p className="lead muted">Cztery burgery, które co tydzień wychodzą z naszych kuchni najczęściej.</p>
          </div>
          <Link className="text-link" href="/#menu">
            Całe menu
            <ArrowIcon width={18} height={18} />
          </Link>
        </div>
        <div className="bestsellers__grid">
          {items.map((item, i) => (
            <div key={item.id} data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.08}s` }}>
              <ProductCard
                item={item}
                sizes="(max-width: 760px) 78vw, (max-width: 1024px) 50vw, 25vw"
                action={
                  <a className="text-link" href={`#${item.id}`} aria-label={`${item.name} w menu`}>
                    W menu
                  </a>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

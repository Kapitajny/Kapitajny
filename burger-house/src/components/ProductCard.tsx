import Image from "next/image";
import type { ReactNode } from "react";
import { formatPrice, type MenuItem } from "@/data/menu";
import { ChiliIcon } from "./Icons";

interface Props {
  item: MenuItem;
  headingLevel?: "h3" | "h4";
  action?: ReactNode;
  sizes?: string;
  className?: string;
  id?: string;
}

export function Heat({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="heat" role="img" aria-label={`Ostrość ${level} na 3`}>
      {[1, 2, 3].map((n) => (
        <ChiliIcon key={n} className={n > level ? "is-off" : undefined} />
      ))}
    </span>
  );
}

export function ProductCard({ item, headingLevel: H = "h3", action, sizes, className, id }: Props) {
  return (
    <article className={["product", className].filter(Boolean).join(" ")} id={id}>
      <div className="product__media">
        <Image
          src={`/images/${item.image}`}
          alt={item.alt}
          width={640}
          height={640}
          sizes={sizes ?? "(max-width: 760px) 116px, (max-width: 1024px) 50vw, 25vw"}
          quality={75}
        />
        {item.tag && <span className="product__tag">{item.tag}</span>}
      </div>
      <div className="product__body">
        <H className="product__name">{item.name}</H>
        <p className="product__desc">{item.description}</p>
        <div className="product__foot">
          <span className="price">
            <span className="sr-only">Cena: </span>
            {formatPrice(item.price)}
          </span>
          {item.heat ? <Heat level={item.heat} /> : null}
          {action}
        </div>
      </div>
    </article>
  );
}

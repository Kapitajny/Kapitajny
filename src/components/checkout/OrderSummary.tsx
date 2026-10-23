import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";
import type { PublicOrder } from "./useOrderStatus";

export function OrderSummary({ order }: { order: PublicOrder }) {
  return (
    <div className="border border-line bg-graphite p-6">
      <h2 className="display-sm text-lg">Zamówienie {order.number}</h2>
      <ul className="mt-4 divide-y divide-line">
        {order.items.map((item) => (
          <li key={`${item.slug}-${item.colorName}-${item.size}`} className="flex gap-3 py-3">
            <span className="studio relative block h-20 w-16 shrink-0 overflow-hidden">
              <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <Link href={`/produkt/${item.slug}`} className="block font-semibold hover:underline">
                {item.name}
              </Link>
              <span className="block text-muted">
                {item.colorName}, {item.size}, {item.quantity} szt.
              </span>
            </span>
            <span className="text-sm tabular-nums">{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Produkty</dt>
          <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Dostawa: {order.shippingMethod}</dt>
          <dd className="tabular-nums">{formatPrice(order.shippingCost)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
          <dt>Razem</dt>
          <dd className="tabular-nums">{formatPrice(order.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted">Wysyłka: {order.shippingTo}</p>
    </div>
  );
}

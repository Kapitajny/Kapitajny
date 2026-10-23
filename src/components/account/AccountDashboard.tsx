import Link from "next/link";
import { redirect } from "next/navigation";
import { getShippingMethod } from "@/data/shipping";
import { formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { listOrdersForUser, type OrderStatus } from "@/lib/server/orders";
import { currentUser } from "@/lib/server/session";
import { LogoutButton } from "./LogoutButton";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Oczekuje na płatność",
  paid: "Opłacone",
  cancelled: "Anulowane",
  failed: "Płatność nieudana",
  demo: "Demo – bez płatności",
};

/** Panel konta – czyta ciasteczko sesji, więc renderuje się przy każdym żądaniu (w granicy Suspense). */
export async function AccountDashboard() {
  const user = await currentUser();
  if (!user) redirect("/logowanie?next=/konto");
  const orders = listOrdersForUser(user.id);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h1 className="display text-[clamp(2.8rem,1rem+5vw,5.5rem)]">Cześć, {user.firstName}</h1>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="text-muted">E-mail</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Konto od</dt>
            <dd>{formatDateTime(user.createdAt)}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/ulubione" className="btn btn-outline">
            Ulubione
          </Link>
          <LogoutButton />
        </div>
      </div>

      <section aria-labelledby="orders-title" className="lg:col-span-7 lg:col-start-6">
        <h2 id="orders-title" className="display-sm text-2xl">
          Historia zamówień
        </h2>
        {orders.length === 0 ? (
          <div className="mt-6 border border-line p-8">
            <p>Nie masz jeszcze zamówień złożonych na tym koncie.</p>
            <p className="mt-2 text-sm text-muted">Zamówienia złożone przed zalogowaniem nie są przypisywane do konta.</p>
            <Link href="/sklep" className="btn btn-light mt-6">
              Przejdź do sklepu
            </Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <li key={order.id} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-bold">
                    {order.number}{" "}
                    <span className={`ml-2 border px-2 py-0.5 text-xs font-semibold ${order.status === "paid" ? "border-paper" : "border-line text-muted"}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTime(order.createdAt)}, {order.items.reduce((n, i) => n + i.quantity, 0)} szt., {getShippingMethod(order.shippingMethod)?.name ?? order.shippingMethod}
                  </p>
                  <p className="mt-1 text-sm text-muted">{order.items.map((i) => `${i.name} (${i.colorName}, ${i.size})`).join(", ")}</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <span className="font-semibold tabular-nums">{formatPrice(order.total)}</span>
                  <Link href={`/zamowienie/sukces?order=${order.id}`} className="link text-sm">
                    Szczegóły
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

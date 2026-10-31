"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { AlertIcon, CheckIcon, DownloadIcon, MailIcon } from "@/components/ui/Icons";

interface PublicOrder {
  id: string;
  number: string;
  status: "pending" | "paid" | "cancelled" | "failed";
  emailHint: string;
  items: { slug: string; title: string; price: number }[];
  total: number;
  emailSent: boolean;
  downloads: { slug: string; title: string; url: string; expiresAt: string; remaining: number }[];
  resumeUrl: string | null;
}

export function StatusShell({ eyebrow, title, children, tone = "neutral" }: { eyebrow: string; title: string; children?: ReactNode; tone?: "neutral" | "success" | "warning" }) {
  return (
    <section className="container-x py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          {tone === "success" && (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-cream">
              <CheckIcon size={22} />
            </span>
          )}
          {tone === "warning" && (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-beige text-forest">
              <AlertIcon size={20} />
            </span>
          )}
          <p className="eyebrow">{eyebrow}</p>
        </div>
        <h1 className="mt-6 text-[clamp(2.2rem,1.5rem+2.6vw,3.6rem)]">{title}</h1>
        <div className="mt-6 text-lg leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

const fmtDate = (iso: string) => new Intl.DateTimeFormat("pl-PL", { dateStyle: "long", timeStyle: "short" }).format(new Date(iso));

export function OrderSuccessView() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const cart = useCart();
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const cleared = useRef(false);

  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;
    let attempts = 0;
    async function poll() {
      attempts++;
      try {
        const res = await fetch(`/api/orders/status?session_id=${encodeURIComponent(sessionId!)}`, { cache: "no-store" });
        if (res.status === 404) {
          setError("Nie znaleźliśmy tego zamówienia. Jeśli płatność została pobrana, skontaktuj się z nami.");
          return;
        }
        const data = (await res.json()) as PublicOrder;
        if (stopped) return;
        setOrder(data);
        if (data.status !== "pending") return;
      } catch {
        /* chwilowy błąd sieci – ponawiamy */
      }
      if (attempts >= 60) {
        setTimedOut(true);
        return;
      }
      setTimeout(() => !stopped && poll(), attempts < 10 ? 1500 : 4000);
    }
    poll();
    return () => {
      stopped = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (order?.status === "paid" && !cleared.current) {
      cleared.current = true;
      cart.clear();
      try {
        window.sessionStorage.removeItem("novelia-checkout-attempt");
      } catch {
        /* brak sessionStorage */
      }
    }
  }, [order?.status, cart]);

  if (!sessionId || error) {
    return (
      <StatusShell eyebrow="Zamówienie" title="Nie można wyświetlić zamówienia" tone="warning">
        <p className="text-muted">{error ?? "Brak identyfikatora płatności w adresie strony."}</p>
        <Link href="/kontakt" className="btn btn-outline mt-8">
          Kontakt
        </Link>
      </StatusShell>
    );
  }

  if (!order || order.status === "pending") {
    return (
      <StatusShell eyebrow={order ? `Zamówienie ${order.number}` : "Zamówienie"} title={timedOut ? "Czekamy na potwierdzenie płatności" : "Sprawdzamy status płatności…"}>
        <p className="text-muted">
          {timedOut
            ? "Operator płatności nie potwierdził jeszcze transakcji (niektóre metody, np. przelew, mogą potrwać dłużej). Gdy płatność zostanie potwierdzona, wyślemy link do pobrania na Twój adres e-mail. Możesz też odświeżyć tę stronę później."
            : "To zwykle trwa kilka sekund. Nie zamykaj tej strony."}
        </p>
        {!timedOut && <div className="mt-8 h-1 w-40 overflow-hidden bg-beige"><div className="h-full w-1/3 animate-pulse bg-forest" /></div>}
      </StatusShell>
    );
  }

  if (order.status !== "paid") {
    return (
      <StatusShell eyebrow={`Zamówienie ${order.number}`} title={order.status === "failed" ? "Płatność nie powiodła się" : "Zamówienie zostało anulowane"} tone="warning">
        <p className="text-muted">Środki nie zostały pobrane albo zostaną zwrócone przez operatora płatności. Możesz złożyć zamówienie ponownie.</p>
        <Link href="/koszyk" className="btn btn-primary mt-8">
          Wróć do koszyka
        </Link>
      </StatusShell>
    );
  }

  return (
    <StatusShell eyebrow={`Zamówienie ${order.number}`} title="Dziękujemy! Twoje e-booki są gotowe" tone="success">
      <p className="text-muted">Płatność została potwierdzona. Pobierz pliki poniżej – linki są ważne do wskazanej daty i pozwalają na kilkukrotne pobranie.</p>
      <ul className="mt-8 space-y-4">
        {order.downloads.map((d) => (
          <li key={d.slug} className="flex flex-col gap-4 bg-cream p-5 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-serif text-xl text-forest">{d.title}</p>
              <p className="mt-1 text-sm text-muted">
                PDF · link ważny do {fmtDate(d.expiresAt)} · pozostało pobrań: {d.remaining}
              </p>
            </div>
            {d.remaining > 0 ? (
              <a href={d.url} className="btn btn-primary shrink-0" download>
                <DownloadIcon size={18} /> Pobierz PDF
              </a>
            ) : (
              <Link href="/kontakt" className="btn btn-outline shrink-0">
                Limit pobrań wykorzystany – napisz do nas
              </Link>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6 flex gap-3 text-base text-muted">
        <MailIcon size={20} className="mt-1 shrink-0 text-olive" />
        <span>
          {order.emailSent
            ? `Wysłaliśmy też wiadomość z linkami na adres ${order.emailHint}. Jeśli jej nie widzisz, sprawdź folder „Oferty” lub „Spam”.`
            : `Wiadomość z linkami wyślemy na adres ${order.emailHint}. Jeśli nie dotrze w ciągu kilku minut, pobierz pliki z tej strony lub skorzystaj z formularza ponownego pobrania.`}
        </span>
      </p>
      <div className="mt-8 border-t border-line pt-6 text-base">
        <p className="text-muted">
          Zapłacono: <strong className="text-forest">{formatPrice(order.total)}</strong> · Numer zamówienia: <strong className="text-forest">{order.number}</strong> – zachowaj go, aby w przyszłości pobrać plik ponownie.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/pobieranie" className="btn btn-outline">
            Ponowne pobranie pliku
          </Link>
          <Link href="/sklep" className="btn btn-outline">
            Wróć do sklepu
          </Link>
        </div>
      </div>
    </StatusShell>
  );
}

export function OrderCancelledView() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [state, setState] = useState<"working" | "cancelled" | "paid" | "unknown">("working");

  useEffect(() => {
    if (!orderId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("unknown");
      return;
    }
    fetch("/api/orders/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }) })
      .then((r) => r.json())
      .then((d: { status?: string }) => setState(d.status === "paid" ? "paid" : d.status ? "cancelled" : "unknown"))
      .catch(() => setState("unknown"));
  }, [orderId]);

  if (state === "paid") {
    return (
      <StatusShell eyebrow="Zamówienie" title="To zamówienie zostało już opłacone" tone="success">
        <p className="text-muted">Link do pobrania wysłaliśmy e-mailem. Możesz też wygenerować nowe linki na stronie ponownego pobrania.</p>
        <Link href="/pobieranie" className="btn btn-primary mt-8">
          Ponowne pobranie pliku
        </Link>
      </StatusShell>
    );
  }
  return (
    <StatusShell eyebrow="Zamówienie" title={state === "working" ? "Anulujemy płatność…" : "Płatność została przerwana"} tone="warning">
      <p className="text-muted">Nie pobraliśmy żadnych środków. Publikacje czekają w koszyku – możesz wrócić do zamówienia w dowolnej chwili.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/koszyk" className="btn btn-primary">
          Wróć do koszyka
        </Link>
        <Link href="/kontakt" className="btn btn-outline">
          Potrzebujesz pomocy?
        </Link>
      </div>
    </StatusShell>
  );
}

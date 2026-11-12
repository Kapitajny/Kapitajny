"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartLines } from "@/components/cart/CartLines";
import { cart, useCartLines, useHydrated } from "@/components/cart/cart-store";
import { formatAmount, formatPrice } from "@/lib/money";
import {
  FREE_SHIPPING_FROM,
  orderTotal,
  paymentMethods,
  resolveLines,
  shippingMethods,
  type PaymentId,
  type ShippingId,
} from "@/lib/order";
import { createOrderNumber, saveOrder } from "./order-storage";
import styles from "./checkout.module.css";

type FieldName = "name" | "email" | "phone" | "street" | "zip" | "city" | "terms";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP = /^\d{2}-\d{3}$/;

function validate(data: FormData, shipping: ShippingId): Errors {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const errors: Errors = {};
  if (value("name").length < 3) errors.name = "Wpisz imię i nazwisko.";
  if (!EMAIL.test(value("email"))) errors.email = "Wpisz poprawny adres e-mail, np. jan@example.com.";
  if (value("phone").replace(/\D/g, "").length < 9) errors.phone = "Wpisz numer telefonu, co najmniej 9 cyfr.";
  if (shipping === "kurier") {
    if (value("street").length < 3) errors.street = "Wpisz ulicę i numer domu.";
    if (!ZIP.test(value("zip"))) errors.zip = "Wpisz kod pocztowy w formacie 00-000.";
    if (value("city").length < 2) errors.city = "Wpisz miejscowość.";
  }
  if (!data.get("terms")) errors.terms = "Zaakceptuj regulamin, żeby złożyć zamówienie.";
  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const lines = useCartLines();
  const hydrated = useHydrated();
  const [shipping, setShipping] = useState<ShippingId>("kurier");
  const [payment, setPayment] = useState<PaymentId>("przelew");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const resolved = resolveLines(lines);
  const totals = orderTotal(lines, shipping);

  if (!hydrated) {
    return <p className="demo-note">Wczytuję zamówienie…</p>;
  }

  if (resolved.length === 0 && !submitting) {
    return (
      <div className={styles.emptyState}>
        <h2>Nie ma jeszcze czego zamawiać.</h2>
        <p>Koszyk jest pusty. Dodaj soki w sklepie i wróć tutaj, żeby dokończyć zamówienie.</p>
        <Link href="/sklep" className="btn">
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found = validate(data, shipping);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Wersja demonstracyjna: nic nie trafia na serwer. Tu podłącza się API zamówień i operatora płatności.
    setSubmitting(true);
    saveOrder({
      number: createOrderNumber(),
      lines,
      shipping,
      payment,
      subtotal: totals.subtotal,
      shippingCost: totals.shipping,
      total: totals.total,
      firstName: String(data.get("name") ?? "").trim().split(/\s+/)[0] ?? "",
      city: String(data.get("city") ?? "").trim(),
    });
    cart.clear();
    router.push("/zamowienie/potwierdzenie");
  };

  const err = (field: FieldName) =>
    errors[field] ? (
      <p id={`checkout-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null;
  const aria = (field: FieldName) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `checkout-${field}-error` : undefined,
  });

  return (
    <form className={styles.layout} onSubmit={onSubmit} noValidate aria-label="Formularz zamówienia">
      <div className={styles.steps}>
        <p className="notice">
          <strong>Zamówienie demonstracyjne.</strong> Formularz sprawdza dane i pokazuje pełny przebieg zakupu, ale
          zamówienie nie zostanie nigdzie wysłane, a płatność nie zostanie pobrana.
        </p>

        <fieldset className={styles.step}>
          <legend>Dane klienta</legend>
          <div className="field">
            <label htmlFor="checkout-name">Imię i nazwisko</label>
            <input id="checkout-name" name="name" className="input" autoComplete="name" required {...aria("name")} />
            {err("name")}
          </div>
          <div className={styles.cols}>
            <div className="field">
              <label htmlFor="checkout-email">Adres e-mail</label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                inputMode="email"
                className="input"
                autoComplete="email"
                required
                {...aria("email")}
              />
              {err("email")}
            </div>
            <div className="field">
              <label htmlFor="checkout-phone">Telefon</label>
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                className="input"
                autoComplete="tel"
                required
                {...aria("phone")}
              />
              {err("phone")}
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.step}>
          <legend>Sposób dostawy</legend>
          <div className={styles.choices}>
            {shippingMethods.map((method) => {
              const free = method.price === 0 || totals.subtotal >= FREE_SHIPPING_FROM;
              return (
                <label key={method.id} className={styles.choice}>
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shipping === method.id}
                    onChange={() => setShipping(method.id)}
                  />
                  <span className={styles.choiceBody}>
                    <span className={styles.choiceTitle}>{method.label}</span>
                    <span className={styles.choiceNote}>{method.note}</span>
                  </span>
                  <span className={styles.choicePrice}>{free ? "bezpłatnie" : formatPrice(method.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {shipping === "kurier" ? (
          <fieldset className={styles.step}>
            <legend>Adres dostawy</legend>
            <div className="field">
              <label htmlFor="checkout-street">Ulica i numer</label>
              <input
                id="checkout-street"
                name="street"
                className="input"
                autoComplete="street-address"
                required
                {...aria("street")}
              />
              {err("street")}
            </div>
            <div className={`${styles.cols} ${styles.colsZip}`}>
              <div className="field">
                <label htmlFor="checkout-zip">Kod pocztowy</label>
                <input
                  id="checkout-zip"
                  name="zip"
                  className="input"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  placeholder="00-000"
                  maxLength={6}
                  required
                  {...aria("zip")}
                />
                {err("zip")}
              </div>
              <div className="field">
                <label htmlFor="checkout-city">Miejscowość</label>
                <input
                  id="checkout-city"
                  name="city"
                  className="input"
                  autoComplete="address-level2"
                  required
                  {...aria("city")}
                />
                {err("city")}
              </div>
            </div>
          </fieldset>
        ) : null}

        <fieldset className={styles.step}>
          <legend>Metoda płatności</legend>
          <div className={styles.choices}>
            {paymentMethods.map((method) => (
              <label key={method.id} className={styles.choice}>
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={payment === method.id}
                  onChange={() => setPayment(method.id)}
                />
                <span className={styles.choiceBody}>
                  <span className={styles.choiceTitle}>{method.label}</span>
                  <span className={styles.choiceNote}>{method.note}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="demo-note">
            Płatności online (BLIK, karta, szybki przelew) nie są w tej wersji podłączone, dlatego nie ma ich na liście.
          </p>
        </fieldset>

        <fieldset className={styles.step}>
          <legend>Uwagi do zamówienia</legend>
          <div className="field">
            <label htmlFor="checkout-notes">
              Wiadomość dla nas <span className="optional">(opcjonalnie)</span>
            </label>
            <textarea id="checkout-notes" name="notes" className="textarea" rows={3} />
          </div>
        </fieldset>
      </div>

      <aside className={styles.summary} aria-labelledby="checkout-summary-title">
        <h2 id="checkout-summary-title">Twoje zamówienie</h2>
        <CartLines lines={resolved} editable={false} />
        <Link href="/koszyk" className={`text-link ${styles.edit}`}>
          Zmień zawartość koszyka
        </Link>
        <dl className={styles.totals}>
          <div>
            <dt>Wartość produktów</dt>
            <dd>{formatAmount(totals.subtotal)}</dd>
          </div>
          <div>
            <dt>Dostawa</dt>
            <dd>{totals.shipping === 0 ? "bezpłatnie" : formatAmount(totals.shipping)}</dd>
          </div>
          <div className={styles.grand}>
            <dt>Do zapłaty</dt>
            <dd>{formatAmount(totals.total)}</dd>
          </div>
        </dl>

        <div className="field">
          <label className="check">
            <input type="checkbox" name="terms" required {...aria("terms")} />
            <span>
              Akceptuję{" "}
              <Link href="/regulamin" className="text-link">
                regulamin sklepu
              </Link>{" "}
              i{" "}
              <Link href="/polityka-prywatnosci" className="text-link">
                politykę prywatności
              </Link>
              .
            </span>
          </label>
          {err("terms")}
        </div>

        <button type="submit" className="btn btn--block" disabled={submitting}>
          Złóż zamówienie demonstracyjne
        </button>
      </aside>
    </form>
  );
}

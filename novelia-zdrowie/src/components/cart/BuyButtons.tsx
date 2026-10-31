"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { BagIcon, CheckIcon } from "@/components/ui/Icons";

/** „KUP TERAZ” – dodaje publikację do koszyka i od razu przechodzi do zamówienia. */
export function BuyNowButton({ slug, label = "Kup teraz", className = "btn btn-primary" }: { slug: string; label?: string; className?: string }) {
  const cart = useCart();
  const router = useRouter();
  const unavailable = cart.available[slug] === false;
  return (
    <button
      type="button"
      className={className}
      disabled={unavailable}
      onClick={() => {
        if (cart.add(slug, { open: false })) router.push("/koszyk");
      }}
    >
      {unavailable ? "Wkrótce dostępny" : label}
    </button>
  );
}

/** „Dodaj do koszyka” – z informacją, gdy publikacja już jest w koszyku. */
export function AddToCartButton({ slug, className = "btn btn-outline" }: { slug: string; className?: string }) {
  const cart = useCart();
  const unavailable = cart.available[slug] === false;
  const inCart = cart.hydrated && cart.has(slug);
  if (unavailable) {
    return (
      <button type="button" className={className} disabled aria-disabled="true">
        W przygotowaniu
      </button>
    );
  }
  return (
    <button type="button" className={className} onClick={() => (inCart ? cart.open() : cart.add(slug))} aria-label={inCart ? "Publikacja jest w koszyku – pokaż koszyk" : "Dodaj do koszyka"}>
      {inCart ? <CheckIcon size={18} /> : <BagIcon size={18} />}
      {inCart ? "W koszyku" : "Dodaj do koszyka"}
    </button>
  );
}

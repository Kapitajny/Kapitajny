import type { Metadata } from "next";
import { FavoritesView } from "@/components/shop/FavoritesView";

export const metadata: Metadata = { title: "Ulubione", robots: { index: false, follow: true } };

export default function FavoritesPage() {
  return (
    <div className="wrap pb-24 pt-10">
      <h1 className="display mb-10 text-[clamp(3rem,1rem+7vw,7rem)]">Ulubione</h1>
      <FavoritesView />
    </div>
  );
}

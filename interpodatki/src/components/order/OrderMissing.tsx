import Link from "next/link";
import { Notice } from "@/components/ui/Notice";

export function OrderMissing() {
  return (
    <div className="max-w-2xl space-y-6">
      <Notice tone="warning" title="Nie znaleziono zamówienia testowego" role="alert">
        Zamówienia demonstracyjne są widoczne tylko w przeglądarce, w której je utworzono, i wygasają po kilku godzinach
        lub po restarcie serwera demo.
      </Notice>
      <div className="flex flex-wrap gap-3">
        <Link href="/zamowienie" className="btn btn-primary">
          Złóż nowe zamówienie testowe
        </Link>
        <Link href="/cennik" className="btn btn-outline">
          Przejdź do cennika
        </Link>
      </div>
    </div>
  );
}

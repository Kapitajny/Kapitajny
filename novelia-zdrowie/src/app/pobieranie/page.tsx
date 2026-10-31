import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResendForm } from "@/components/checkout/ResendForm";

export const metadata: Metadata = {
  title: "Ponowne pobranie pliku",
  description: "Wygeneruj nowe linki do pobrania zakupionych e-booków NOVELIA ZDROWIE.",
  alternates: { canonical: "/pobieranie" },
};

export default function DownloadAgainPage() {
  return (
    <section className="container-x py-14 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Pobieranie</p>
          <span className="gold-rule mt-5" />
          <h1 className="mt-6 text-[clamp(2.2rem,1.5rem+2.6vw,3.6rem)]">Ponowne pobranie pliku</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Linki do pobrania są ważne przez ograniczony czas i pozwalają na kilka pobrań. Jeśli link wygasł albo nie możesz znaleźć wiadomości, podaj adres e-mail i numer zamówienia – wyślemy nowe linki na adres użyty przy zakupie.
          </p>
          <ul className="mt-8 space-y-3 text-[0.98rem] leading-relaxed">
            <li>• Ze względów bezpieczeństwa linki wysyłamy wyłącznie na adres e-mail z zamówienia.</li>
            <li>• Wiadomość może trafić do folderu „Oferty” lub „Spam”.</li>
            <li>
              • Nie pamiętasz numeru zamówienia?{" "}
              <Link href="/kontakt" className="link text-forest">
                Napisz do nas
              </Link>
              .
            </li>
          </ul>
        </div>
        <div>
          <Suspense fallback={null}>
            <ResendForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

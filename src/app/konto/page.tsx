import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata: Metadata = { title: "Moje konto", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <div className="wrap pb-24 pt-10">
      <Suspense fallback={<p className="py-16 text-muted">Wczytywanie konta…</p>}>
        <AccountDashboard />
      </Suspense>
    </div>
  );
}

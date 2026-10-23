import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/account/AuthForm";
import { AuthLayout } from "@/components/account/AuthLayout";

export const metadata: Metadata = { title: "Odzyskiwanie hasła", robots: { index: false, follow: true } };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Nowe hasło"
      intro="Podaj e-mail konta – wyślemy link do ustawienia nowego hasła, ważny 60 minut."
      footer={
        <p>
          <Link href="/logowanie" className="link text-paper">
            Wróć do logowania
          </Link>
        </p>
      }
    >
      <AuthForm mode="forgot" />
    </AuthLayout>
  );
}

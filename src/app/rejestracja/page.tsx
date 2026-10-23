import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/account/AuthForm";
import { AuthLayout } from "@/components/account/AuthLayout";

export const metadata: Metadata = { title: "Załóż konto", robots: { index: false, follow: true } };

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Załóż konto"
      intro="Konto nie jest wymagane do zakupów. Daje historię zamówień i szybsze wypełnianie formularza."
      footer={
        <p>
          Masz już konto?{" "}
          <Link href="/logowanie" className="link text-paper">
            Zaloguj się
          </Link>
        </p>
      }
    >
      <AuthForm mode="register" />
    </AuthLayout>
  );
}

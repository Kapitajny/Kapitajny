import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/account/AuthForm";
import { AuthLayout } from "@/components/account/AuthLayout";

export const metadata: Metadata = { title: "Logowanie", robots: { index: false, follow: true } };

export default function LoginPage() {
  return (
    <AuthLayout
      title="Logowanie"
      intro="Po zalogowaniu zamówienia trafiają do historii na Twoim koncie, a formularz zamówienia uzupełni się Twoimi danymi."
      footer={
        <>
          <p>
            Nie masz konta?{" "}
            <Link href="/rejestracja" className="link text-paper">
              Załóż konto
            </Link>
          </p>
          <p>
            <Link href="/odzyskiwanie-hasla" className="link text-paper">
              Nie pamiętam hasła
            </Link>
          </p>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthLayout>
  );
}

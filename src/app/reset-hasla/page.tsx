import type { Metadata } from "next";
import { AuthForm } from "@/components/account/AuthForm";
import { AuthLayout } from "@/components/account/AuthLayout";

export const metadata: Metadata = { title: "Ustaw nowe hasło", robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Ustaw hasło" intro="Po zmianie hasła wylogujemy Cię ze wszystkich urządzeń.">
      <AuthForm mode="reset" />
    </AuthLayout>
  );
}

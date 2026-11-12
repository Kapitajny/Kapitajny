import type { Metadata } from "next";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";
import { adminConfigState, SESSION_COOKIE, verifySession } from "@/lib/server/auth";
import { AdminApp } from "@/components/admin/AdminApp";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Panel administratora", robots: { index: false, follow: false } };

async function Gate() {
  // konfigurację panelu czytamy przy każdym żądaniu (zmienne mogą być ustawione dopiero na serwerze)
  await connection();
  const state = adminConfigState();
  if (state !== "ready") {
    return (
      <div className="mx-auto max-w-xl px-5 py-24">
        <h1 className="font-display text-5xl font-extrabold uppercase">Panel wyłączony</h1>
        <p className="mt-4 text-muted">
          Aby włączyć panel, ustaw na serwerze zmienne <code className="bg-sand px-1">ADMIN_PASSWORD</code> (min. 10 znaków) i{" "}
          <code className="bg-sand px-1">ADMIN_SESSION_SECRET</code> (min. 32 losowe znaki), a następnie uruchom stronę ponownie. Instrukcja jest w pliku README.
        </p>
      </div>
    );
  }
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(session) ? <AdminApp /> : <LoginForm />;
}

export default function PanelPage() {
  return (
    <Suspense fallback={<p className="p-10 text-muted">Ładowanie panelu…</p>}>
      <Gate />
    </Suspense>
  );
}

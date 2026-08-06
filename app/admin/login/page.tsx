import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (isAuthed()) redirect("/admin");

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-3 text-center">
          Администрирование
        </p>
        <h1
          className="font-cormorant font-light text-[var(--ink)] mb-8 text-center"
          style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}
        >
          Вход в админку
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}

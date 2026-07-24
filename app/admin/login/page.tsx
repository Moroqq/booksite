import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { loginAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (isAuthed()) redirect("/admin");

  const inputClass =
    "w-full font-inter text-sm bg-white/70 border border-[var(--line)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--gold)] transition-colors duration-300";

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

        <form action={loginAction} className="space-y-4">
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            autoFocus
            className={inputClass}
            aria-label="Пароль"
          />
          {searchParams.error && (
            <p className="font-inter text-xs text-[var(--rose-color)] text-center">
              Неверный пароль.
            </p>
          )}
          <button
            type="submit"
            className="btn-gold w-full font-inter text-sm uppercase tracking-widest rounded-full px-6 py-3 transition-all duration-300"
          >
            Войти
          </button>
        </form>
      </div>
    </main>
  );
}

"use client";

import { FormEvent, useState, useTransition } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputClass =
    "w-full font-inter text-sm bg-white/70 border border-[var(--line)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--gold)] transition-colors duration-300";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (!result.ok) { setError(true); return; }
      window.location.href = "/admin";
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        name="password"
        type="password"
        placeholder="Пароль"
        autoFocus
        className={inputClass}
        aria-label="Пароль"
      />
      {error && (
        <p className="font-inter text-xs text-[var(--rose-color)] text-center">
          Неверный пароль.
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="btn-gold w-full font-inter text-sm uppercase tracking-widest rounded-full px-6 py-3 transition-all duration-300 disabled:opacity-60"
      >
        {isPending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}

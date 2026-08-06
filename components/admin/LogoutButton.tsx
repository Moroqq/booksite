"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/admin/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        await logoutAction();
        window.location.href = "/admin/login";
      })}
      className="font-inter text-xs uppercase tracking-widest border border-[var(--line)] rounded-full px-4 py-2 text-[var(--ink-soft)] hover:border-[var(--gold)] disabled:opacity-60"
    >
      {isPending ? "Выходим…" : "Выйти"}
    </button>
  );
}

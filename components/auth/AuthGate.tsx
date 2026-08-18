import { ShieldCheck } from "lucide-react";
import LoginOptions from "./LoginOptions";

/** Экран «сначала войдите»: показывается вместо формы заказа или записи на семинар. */
export default function AuthGate({
  next,
  title,
  description,
}: {
  next: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-6 sm:p-8">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
        <ShieldCheck size={20} />
      </span>
      <h2 className="mt-4 font-cormorant text-3xl text-[var(--ink)]">{title}</h2>
      <p className="mt-2 font-inter text-sm leading-relaxed text-[var(--ink-soft)]">{description}</p>

      <LoginOptions next={next} className="mt-6" />

      <ul className="mt-6 space-y-2 border-t border-[var(--line)] pt-5 font-inter text-sm text-[var(--ink-soft)]">
        <li>— Пароль придумывать не нужно: вход по вашему аккаунту.</li>
        <li>— Имя и телефон подставятся в форму автоматически.</li>
        <li>— Заказы и записи будут видны с любого устройства в личном кабинете.</li>
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { PROFESSION_LABELS } from "@/lib/schema";
import type { SiteUser } from "@/lib/users-db";
import { submitSeminarSignup } from "./actions";

type Values = { firstName: string; lastName: string; email: string; phone: string; profession: string; motivation: string };

function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);
  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length) out += ` ${rest.slice(0, 3)}`;
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-inter text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none";

export default function SignupForm({ seminarId, user }: { seminarId: string; user: SiteUser | null }) {
  const [values, setValues] = useState<Values>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone ? formatPhone(user.phone) : "",
    profession: "",
    motivation: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [token, setToken] = useState("");
  const [isPending, startTransition] = useTransition();

  const update = (name: keyof Values, value: string) => setValues((current) => ({ ...current, [name]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await submitSeminarSignup({ seminarId, ...values });
        if (result.ok) { setToken(result.token || ""); setDone(result.number || ""); }
        else setError(result.message || "Не удалось отправить заявку.");
      } catch {
        setError("Страница устарела — обновите её и оформите заново. Обычно это происходит, если вкладка была открыта во время обновления сайта.");
      }
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-6 text-center sm:p-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sage)]/20 text-[var(--sage)]">
          <Check size={22} />
        </span>
        <h2 className="mt-4 font-cormorant text-3xl text-[var(--ink)]">Заявка отправлена</h2>
        <p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">
          Номер заявки — {done}. Мы свяжемся с вами по указанному телефону и подтвердим участие. Ссылка на заявку отправлена вам на почту.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={token ? `/signup/${token}` : "/seminars"} className="rounded-full bg-[var(--bg-deep)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-white hover:bg-[var(--gold)]">
            Открыть заявку
          </Link>
          <Link href="/seminars" className="rounded-full border border-[var(--line)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:border-[var(--gold)]">
            К списку семинаров
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Имя</span>
          <input required value={values.firstName} onChange={(event) => update("firstName", event.target.value)} autoComplete="given-name" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Фамилия</span>
          <input required value={values.lastName} onChange={(event) => update("lastName", event.target.value)} autoComplete="family-name" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Электронная почта</span>
          <input required type="email" value={values.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Телефон</span>
          <input required type="tel" value={values.phone} onChange={(event) => update("phone", formatPhone(event.target.value))} placeholder="+7 999 000-00-00" autoComplete="tel" className={inputClass} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Кем вы работаете</span>
        <select required value={values.profession} onChange={(event) => update("profession", event.target.value)} className={inputClass}>
          <option value="">Выберите из списка</option>
          {Object.entries(PROFESSION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Почему вам интересен этот семинар</span>
        <textarea required rows={4} value={values.motivation} onChange={(event) => update("motivation", event.target.value)} className={inputClass} placeholder="Несколько слов о себе и о том, что вы хотите получить от занятий." />
      </label>

      {error && <p role="alert" className="mt-5 font-inter text-sm text-[var(--rose-color)]">{error}</p>}

      <button disabled={isPending} type="submit" className="mt-7 w-full rounded-full bg-[var(--gold)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-[var(--bg-deep)] disabled:opacity-60 sm:w-auto">
        {isPending ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getAllSeminars } from "@/lib/seminars-db";
import {
  createSeminarAction,
  deleteSeminarAction,
  logoutAction,
} from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Админка — семинары",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: { created?: string; deleted?: string; error?: string };
}) {
  if (!isAuthed()) redirect("/admin/login");

  const seminars = getAllSeminars();

  const inputClass =
    "w-full font-inter text-sm bg-white/70 border border-[var(--line)] rounded-xl px-4 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink-soft)]/50 focus:outline-none focus:border-[var(--gold)] transition-colors duration-300";
  const labelClass =
    "font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]/70 mb-1.5 block";

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="container-layout py-12 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2">
              Администрирование
            </p>
            <h1
              className="font-cormorant font-light text-[var(--ink)]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)" }}
            >
              Управление семинарами
            </h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-inter text-xs uppercase tracking-widest border border-[var(--ink)]/20 text-[var(--ink-soft)] hover:border-[var(--ink)]/50 hover:text-[var(--ink)] rounded-full px-5 py-2.5 transition-colors"
            >
              Выйти
            </button>
          </form>
        </div>

        {/* Flash messages */}
        {searchParams.created && (
          <p className="mb-6 font-inter text-sm text-[var(--sage)] bg-[var(--sage)]/10 border border-[var(--sage)]/30 rounded-xl px-4 py-3">
            Семинар создан.
          </p>
        )}
        {searchParams.deleted && (
          <p className="mb-6 font-inter text-sm text-[var(--ink-soft)] bg-black/5 border border-[var(--line)] rounded-xl px-4 py-3">
            Семинар удалён.
          </p>
        )}
        {searchParams.error && (
          <p className="mb-6 font-inter text-sm text-[var(--rose-color)] bg-[var(--rose-color)]/10 border border-[var(--rose-color)]/30 rounded-xl px-4 py-3">
            {searchParams.error === "numbers"
              ? "Проверьте числовые поля (цена, места)."
              : "Заполните все обязательные поля."}
          </p>
        )}

        {/* Create form */}
        <section className="rounded-2xl border border-[var(--line)] bg-white/60 p-7 sm:p-9 mb-12">
          <h2 className="font-cormorant text-2xl font-medium text-[var(--ink)] mb-6">
            Создать семинар
          </h2>
          <form action={createSeminarAction} className="space-y-5">
            <div>
              <label className={labelClass}>Название *</label>
              <input name="title" className={inputClass} placeholder="Введение в духовную звукотерапию" />
            </div>

            <div>
              <label className={labelClass}>Описание *</label>
              <textarea
                name="description"
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Краткое описание программы семинара…"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Формат *</label>
                <select name="format" className={`${inputClass} cursor-pointer`} defaultValue="Очный">
                  <option value="Очный">Очный</option>
                  <option value="Онлайн">Онлайн</option>
                  <option value="Выездной">Выездной</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Место / площадка *</label>
                <input name="location" className={inputClass} placeholder="Санкт-Петербург / Онлайн (Zoom)" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Дата начала *</label>
                <input name="dateStart" type="date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Дата окончания *</label>
                <input name="dateEnd" type="date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Длительность *</label>
                <input name="duration" className={inputClass} placeholder="3 дня / 8 занятий по 2 часа" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Ведущий *</label>
                <input
                  name="instructor"
                  className={inputClass}
                  placeholder="Татьяна Рожукене-Дорхаут Мэйс"
                  defaultValue="Татьяна Рожукене-Дорхаут Мэйс"
                />
              </div>
              <div>
                <label className={labelClass}>Цена, ₽ *</label>
                <input name="price" type="number" min="0" step="100" className={inputClass} placeholder="12000" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Всего мест *</label>
                <input name="spots" type="number" min="0" className={inputClass} placeholder="14" />
              </div>
              <div>
                <label className={labelClass}>Свободных мест</label>
                <input name="spotsLeft" type="number" min="0" className={inputClass} placeholder="= всего" />
              </div>
              <div>
                <label className={labelClass}>Для кого (через запятую)</label>
                <input name="forWhom" className={inputClass} placeholder="Педагоги, Логопеды, Родители" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold font-inter text-sm uppercase tracking-widest rounded-full px-7 py-3 transition-all duration-300"
            >
              Создать семинар
            </button>
          </form>
        </section>

        {/* Existing seminars */}
        <section>
          <h2 className="font-cormorant text-2xl font-medium text-[var(--ink)] mb-6">
            Семинары ({seminars.length})
          </h2>
          <div className="space-y-3">
            {seminars.map((s) => (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white/60 px-5 py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">
                      {s.format}
                    </span>
                    <span className="font-cormorant text-lg text-[var(--ink)]">{s.title}</span>
                  </div>
                  <p className="font-inter text-xs text-[var(--ink-soft)]/70 mt-1">
                    {s.location} · {formatDate(s.dateStart)} — {formatDate(s.dateEnd)} · {s.priceFormatted} ·{" "}
                    {s.spotsLeft}/{s.spots} мест
                  </p>
                </div>
                <form action={deleteSeminarAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="font-inter text-xs uppercase tracking-widest border border-[var(--rose-color)]/40 text-[var(--rose-color)] hover:bg-[var(--rose-color)]/10 rounded-full px-4 py-2 transition-colors whitespace-nowrap"
                  >
                    Удалить
                  </button>
                </form>
              </div>
            ))}
            {seminars.length === 0 && (
              <p className="font-inter text-sm text-[var(--ink-soft)]/60">Семинаров пока нет.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

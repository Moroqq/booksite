import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getSeminarSignups, signupPersonName, type SeminarSignup, type SignupStatus } from "@/lib/seminar-signups-db";
import { PROFESSION_LABELS } from "@/lib/schema";
import { cancelSignupAction, confirmSignupAction, declineSignupAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Админка — записи на семинары", robots: { index: false, follow: false } };

const labels: Record<SignupStatus, string> = {
  new: "Новая заявка",
  confirmed: "Участие подтверждено",
  declined: "Отклонена",
  cancelled: "Отменена",
};

const badgeStyles: Record<SignupStatus, string> = {
  new: "bg-[var(--gold)]/15 text-[var(--ink)]",
  confirmed: "bg-[var(--sage)]/20 text-[var(--ink)]",
  declined: "bg-[var(--rose-color)]/20 text-[var(--ink)]",
  cancelled: "bg-black/10 text-[var(--ink-soft)]",
};

function date(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function SignupActions({ signup }: { signup: SeminarSignup }) {
  if (signup.status === "new") {
    return (
      <div className="flex flex-wrap gap-2">
        <form action={confirmSignupAction}>
          <input type="hidden" name="id" value={signup.id} />
          <button className="rounded-full bg-[var(--bg-deep)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-white hover:bg-[var(--gold)]">Подтвердить участие</button>
        </form>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-full border border-[var(--rose-color)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-[var(--ink)] hover:bg-[var(--rose-color)]/10">Отклонить</summary>
          <form action={declineSignupAction} className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 shadow-lg">
            <input type="hidden" name="id" value={signup.id} />
            <label className="font-inter text-xs text-[var(--ink-soft)]">
              Причина для участника
              <textarea required name="reason" rows={3} className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white p-2 text-sm text-[var(--ink)]" placeholder="Например: группа уже набрана, предложим ближайшую дату." />
            </label>
            <button className="mt-2 rounded-full bg-[var(--rose-color)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-white">Сохранить отказ</button>
          </form>
        </details>
      </div>
    );
  }
  if (signup.status === "confirmed") {
    return (
      <form action={cancelSignupAction}>
        <input type="hidden" name="id" value={signup.id} />
        <button className="rounded-full border border-[var(--line)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)] hover:border-[var(--gold)]">Отменить запись</button>
      </form>
    );
  }
  return <span className="font-inter text-xs text-[var(--ink-soft)]">Действия не требуются</span>;
}

export default function AdminSignupsPage() {
  if (!isAuthed()) redirect("/admin/login");
  const signups = getSeminarSignups();

  return (
    <AdminShell active="/admin/signups">
      <h2 className="font-cormorant text-3xl text-[var(--ink)]">Записи на семинары</h2>
      <p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">
        Всего заявок: {signups.length}. Участник видит состояние своей заявки в личном кабинете.
      </p>

      {signups.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[var(--line)] p-8 text-center font-inter text-sm text-[var(--ink-soft)]">
          Заявок пока нет.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {signups.map((signup) => (
            <li key={signup.id} className="rounded-2xl border border-[var(--line)] bg-white/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-inter text-sm text-[var(--ink)]">
                    {signup.number} · {signupPersonName(signup)}
                  </p>
                  <p className="mt-1 font-cormorant text-xl text-[var(--ink)]">{signup.seminarTitle}</p>
                  <p className="mt-1 font-inter text-xs text-[var(--ink-soft)]">Даты: {signup.seminarDate}</p>
                </div>
                <span className={`rounded-full px-3 py-1 font-inter text-xs ${badgeStyles[signup.status]}`}>{labels[signup.status]}</span>
              </div>

              <dl className="mt-4 grid gap-2 font-inter text-sm text-[var(--ink-soft)] sm:grid-cols-2">
                <div><dt className="inline text-[var(--ink-soft)]/60">Телефон: </dt><dd className="inline text-[var(--ink)]">{signup.customer.phone}</dd></div>
                <div><dt className="inline text-[var(--ink-soft)]/60">Почта: </dt><dd className="inline text-[var(--ink)]">{signup.customer.email}</dd></div>
                <div><dt className="inline text-[var(--ink-soft)]/60">Занятие: </dt><dd className="inline text-[var(--ink)]">{PROFESSION_LABELS[signup.profession] || signup.profession}</dd></div>
                <div><dt className="inline text-[var(--ink-soft)]/60">Подана: </dt><dd className="inline text-[var(--ink)]">{date(signup.createdAt)}</dd></div>
              </dl>

              <p className="mt-3 rounded-xl bg-[var(--bg)] p-3 font-inter text-sm text-[var(--ink-soft)]">{signup.motivation}</p>

              <div className="mt-4"><SignupActions signup={signup} /></div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

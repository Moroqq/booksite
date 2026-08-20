import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSeminarSignupByToken, signupPersonName } from "@/lib/seminar-signups-db";
import { getSeminarById } from "@/lib/seminars-db";
import { humanDates } from "@/lib/human-date";
import { SIGNUP_STATUS, BADGE_STYLES, SUPPORT_EMAIL } from "@/lib/statuses";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ваша запись на семинар — Духовная звукотерапия", robots: { index: false, follow: false } };

export default function SignupPage({ params }: { params: { token: string } }) {
  const signup = getSeminarSignupByToken(params.token);
  if (!signup) notFound();

  const status = SIGNUP_STATUS[signup.status];
  const seminar = getSeminarById(signup.seminarId);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <section className="pt-10 pb-24 bg-[var(--bg)]">
          <div className="container-layout max-w-2xl">
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Ваша запись</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-cormorant text-4xl text-[var(--ink)]">{signup.number}</h1>
              <span className={`rounded-full px-3 py-1 font-inter text-xs ${BADGE_STYLES[signup.status]}`}>{status.label}</span>
            </div>
            <p className="mt-3 font-inter text-[var(--ink-soft)]">{status.note}</p>

            {signup.status === "declined" && signup.declineReason && (
              <p className="mt-4 rounded-xl bg-[rgba(201,123,99,0.1)] p-4 font-inter text-sm text-[var(--ink)]">
                {signup.declineReason}
              </p>
            )}

            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-6">
              <h2 className="font-cormorant text-2xl text-[var(--ink)]">{signup.seminarTitle}</h2>
              <dl className="mt-4 space-y-2 font-inter text-sm">
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Даты занятий</dt><dd className="text-right text-[var(--ink)]">{humanDates(signup.seminarDate)}</dd></div>
                {seminar && (
                  <>
                    <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Где</dt><dd className="text-right text-[var(--ink)]">{seminar.location}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Формат</dt><dd className="text-[var(--ink)]">{seminar.format}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Стоимость</dt><dd className="text-[var(--ink)]">{seminar.priceFormatted}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Ведущий</dt><dd className="text-right text-[var(--ink)]">{seminar.instructor}</dd></div>
                  </>
                )}
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Участник</dt><dd className="text-right text-[var(--ink)]">{signupPersonName(signup)}</dd></div>
              </dl>
            </div>

            <p className="mt-8 font-inter text-sm text-[var(--ink-soft)]">
              Нужно что-то изменить? Напишите на{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[var(--gold)] hover:underline">{SUPPORT_EMAIL}</a> — адрес этой
              страницы можно сохранить в закладки, она всегда показывает текущее состояние заявки.
            </p>

            <Link href="/seminars" className="mt-8 inline-block font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--gold)]">
              ← Все семинары
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SUPPORT_EMAIL } from "@/lib/statuses";

export const dynamic = "force-dynamic";
export const metadata = { title: "Проверить заказ — Духовная звукотерапия" };

const ERRORS: Record<string, string> = {
  empty: "Заполните оба поля: номер заказа и телефон.",
  notfound: "Заказ с такими данными не найден. Проверьте номер и телефон — он должен быть тот же, что при оформлении.",
};

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 font-inter text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none";

export default function CheckPage({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams.error ? ERRORS[searchParams.error] || ERRORS.notfound : "";

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <section className="pt-10 pb-24 bg-[var(--bg)]">
          <div className="container-layout max-w-lg">
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Мой заказ</p>
            <h1 className="mt-2 font-cormorant text-4xl text-[var(--ink)] sm:text-5xl">Проверить заказ</h1>
            <p className="mt-3 font-inter text-[var(--ink-soft)]">
              Ссылка на заказ приходит в письме сразу после оформления. Если письмо потерялось — найдите заказ
              по номеру и телефону.
            </p>

            <form method="post" action="/api/check" className="mt-8 rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-8">
              <label className="block">
                <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Номер заказа</span>
                <input required name="number" placeholder="BS-2026-0001" className={inputClass} />
              </label>

              <label className="mt-5 block">
                <span className="mb-1.5 block font-inter text-sm text-[var(--ink-soft)]">Телефон, указанный при заказе</span>
                <input required name="phone" type="tel" placeholder="+7 999 000-00-00" className={inputClass} />
              </label>

              {error && (
                <p role="alert" className="mt-5 font-inter text-sm text-[var(--rose-color)]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-[var(--gold)] px-6 py-3.5 font-inter text-xs uppercase tracking-widest text-[var(--bg-deep)] sm:w-auto"
              >
                Найти заказ
              </button>
            </form>

            <p className="mt-8 font-inter text-sm text-[var(--ink-soft)]">
              Не помните номер заказа? Напишите на{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[var(--gold)] hover:underline">{SUPPORT_EMAIL}</a>, укажите
              имя и телефон — мы найдём.
            </p>

            <Link href="/" className="mt-8 inline-block font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--gold)]">
              ← На главную
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

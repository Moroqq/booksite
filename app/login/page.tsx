import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginOptions from "@/components/auth/LoginOptions";
import { configuredProviders, getCurrentUser, safeNextPath } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Вход — Духовная звукотерапия" };

const ERRORS: Record<string, string> = {
  provider: "Этот способ входа сейчас недоступен.",
  cancelled: "Вход отменён. Попробуйте ещё раз, когда будете готовы.",
  expired: "Время ожидания истекло. Начните вход заново.",
  state: "Проверка безопасности не пройдена. Начните вход заново.",
  failed: "Не удалось завершить вход. Попробуйте ещё раз или выберите другой сервис.",
};

export default function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  // Аккаунтов на сайте нет: пока сервисы входа не настроены, страница входа не нужна —
  // отправляем человека туда, где он найдёт свой заказ.
  if (!configuredProviders().length) redirect("/check");

  const next = safeNextPath(searchParams.next);
  if (getCurrentUser()) redirect(next);
  const error = searchParams.error ? ERRORS[searchParams.error] || ERRORS.failed : "";

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <section className="pt-10 pb-24 bg-[var(--bg)]">
          <div className="container-layout max-w-lg">
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Личный кабинет</p>
            <h1 className="mt-2 font-cormorant text-4xl text-[var(--ink)] sm:text-5xl">Вход на сайт</h1>
            <p className="mt-3 font-inter text-[var(--ink-soft)]">
              Войдите через привычный сервис — пароль придумывать не нужно. После входа вы сможете оформить заказ,
              записаться на семинар и следить за их состоянием с любого устройства.
            </p>

            {error && (
              <p role="alert" className="mt-6 rounded-xl border border-[var(--rose-color)]/40 bg-[var(--rose-color)]/10 p-4 font-inter text-sm text-[var(--ink)]">
                {error}
              </p>
            )}

            <LoginOptions next={next} className="mt-8" />

            <p className="mt-8 font-inter text-xs leading-relaxed text-[var(--ink-soft)]/80">
              Мы получаем только имя и контакты для связи по заказу. Публиковать что-либо от вашего имени сайт не может.
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

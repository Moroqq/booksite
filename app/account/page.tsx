import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCurrentUser, PROVIDER_LABELS } from "@/lib/customer-auth";
import { getBookOrdersByUser, type OrderStatus } from "@/lib/orders-db";
import { getSeminarSignupsByUser, type SignupStatus } from "@/lib/seminar-signups-db";
import { PROFESSION_LABELS } from "@/lib/schema";
import { userName } from "@/lib/users-db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Личный кабинет — Духовная звукотерапия", robots: { index: false, follow: false } };

const ORDER_LABELS: Record<OrderStatus, string> = {
  payment_pending: "Проверяем оплату",
  preparing: "Готовим к отправке",
  shipped: "Отправлен",
  payment_rejected: "Оплата не подтверждена",
  cancelled: "Отменён",
};

const SIGNUP_LABELS: Record<SignupStatus, string> = {
  new: "Заявка на рассмотрении",
  confirmed: "Место закреплено за вами",
  declined: "Заявка отклонена",
  cancelled: "Отменена",
};

const BADGE = "rounded-full bg-[var(--gold)]/15 px-3 py-1 font-inter text-xs text-[var(--ink)]";

function date(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(new Date(value));
}

export default function AccountPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = getBookOrdersByUser(user.id);
  const signups = getSeminarSignupsByUser(user.id);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <section className="pt-10 pb-24 bg-[var(--bg)]">
          <div className="container-layout max-w-3xl">
            <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Личный кабинет</p>
                <h1 className="mt-2 font-cormorant text-4xl text-[var(--ink)]">{userName(user) || "Здравствуйте"}</h1>
                <p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">
                  Вход через {PROVIDER_LABELS[user.provider]}
                  {user.phone ? ` · ${user.phone}` : ""}
                  {user.email ? ` · ${user.email}` : ""}
                </p>
              </div>
              <form action="/api/auth/logout" method="post">
                <button className="rounded-full border border-[var(--line)] px-5 py-2.5 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:border-[var(--gold)]">
                  Выйти
                </button>
              </form>
            </header>

            <section className="mt-10" aria-labelledby="orders-heading">
              <h2 id="orders-heading" className="font-cormorant text-3xl text-[var(--ink)]">Заказы книги</h2>
              {orders.length === 0 ? (
                <p className="mt-3 font-inter text-sm text-[var(--ink-soft)]">
                  Заказов пока нет. <Link href="/book" className="text-[var(--gold)] hover:underline">Посмотреть книгу</Link>
                </p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {orders.map((order) => (
                    <li key={order.id} className="rounded-2xl border border-[var(--line)] bg-white/60 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-inter text-sm text-[var(--ink)]">Заказ {order.number}</span>
                        <span className={BADGE}>{ORDER_LABELS[order.status]}</span>
                      </div>
                      <p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">
                        {order.bookTitle} · {order.quantity} шт. · {order.total} ₽
                      </p>
                      <p className="mt-1 font-inter text-xs text-[var(--ink-soft)]/80">
                        Оформлен {date(order.createdAt)} · доставка: {order.delivery.method}
                      </p>
                      {order.status === "payment_rejected" && order.rejectionReason && (
                        <p className="mt-3 rounded-xl bg-[var(--rose-color)]/10 p-3 font-inter text-sm text-[var(--ink)]">
                          {order.rejectionReason}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-12" aria-labelledby="signups-heading">
              <h2 id="signups-heading" className="font-cormorant text-3xl text-[var(--ink)]">Записи на семинары</h2>
              {signups.length === 0 ? (
                <p className="mt-3 font-inter text-sm text-[var(--ink-soft)]">
                  Записей пока нет. <Link href="/seminars" className="text-[var(--gold)] hover:underline">Выбрать семинар</Link>
                </p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {signups.map((signup) => (
                    <li key={signup.id} className="rounded-2xl border border-[var(--line)] bg-white/60 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-inter text-sm text-[var(--ink)]">Заявка {signup.number}</span>
                        <span className={BADGE}>{SIGNUP_LABELS[signup.status]}</span>
                      </div>
                      <p className="mt-2 font-cormorant text-xl text-[var(--ink)]">{signup.seminarTitle}</p>
                      <p className="mt-1 font-inter text-sm text-[var(--ink-soft)]">Даты занятий: {signup.seminarDate}</p>
                      <p className="mt-1 font-inter text-xs text-[var(--ink-soft)]/80">
                        Подана {date(signup.createdAt)} · {PROFESSION_LABELS[signup.profession] || signup.profession}
                      </p>
                      {signup.status === "declined" && signup.declineReason && (
                        <p className="mt-3 rounded-xl bg-[var(--rose-color)]/10 p-3 font-inter text-sm text-[var(--ink)]">
                          {signup.declineReason}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

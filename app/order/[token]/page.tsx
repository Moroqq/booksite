import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getBookOrderByToken, orderBuyerName } from "@/lib/orders-db";
import { OFFLINE_PAYMENT } from "@/lib/offline-payment";
import { ORDER_STATUS, BADGE_STYLES, SUPPORT_EMAIL } from "@/lib/statuses";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ваш заказ — Духовная звукотерапия", robots: { index: false, follow: false } };

const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
const date = (value: string) => new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(new Date(value));

export default function OrderPage({ params }: { params: { token: string } }) {
  const order = getBookOrderByToken(params.token);
  if (!order) notFound();

  const status = ORDER_STATUS[order.status];
  const awaitingPayment = order.status === "payment_pending";

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20">
        <section className="pt-10 pb-24 bg-[var(--bg)]">
          <div className="container-layout max-w-2xl">
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Ваш заказ</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="font-cormorant text-4xl text-[var(--ink)]">{order.number}</h1>
              <span className={`rounded-full px-3 py-1 font-inter text-xs ${BADGE_STYLES[order.status]}`}>{status.label}</span>
            </div>
            <p className="mt-3 font-inter text-[var(--ink-soft)]">{status.note}</p>

            {order.status === "payment_rejected" && order.rejectionReason && (
              <p className="mt-4 rounded-xl bg-[rgba(201,123,99,0.1)] p-4 font-inter text-sm text-[var(--ink)]">
                {order.rejectionReason}
              </p>
            )}

            <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-6">
              <h2 className="font-cormorant text-2xl text-[var(--ink)]">Что заказано</h2>
              <dl className="mt-4 space-y-2 font-inter text-sm">
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Книга</dt><dd className="text-right text-[var(--ink)]">{order.bookTitle}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Количество</dt><dd className="text-[var(--ink)]">{order.quantity} шт.</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Сумма</dt><dd className="font-medium text-[var(--ink)]">{money(order.total)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Оформлен</dt><dd className="text-[var(--ink)]">{date(order.createdAt)}</dd></div>
              </dl>

              <h2 className="mt-7 font-cormorant text-2xl text-[var(--ink)]">Доставка</h2>
              <dl className="mt-4 space-y-2 font-inter text-sm">
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Получатель</dt><dd className="text-right text-[var(--ink)]">{orderBuyerName(order)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Способ</dt><dd className="text-[var(--ink)]">{order.delivery.method}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--ink-soft)]">Адрес</dt><dd className="max-w-[60%] text-right text-[var(--ink)]">{order.delivery.address}</dd></div>
              </dl>
            </div>

            {awaitingPayment && (
              <div className="mt-6 rounded-2xl bg-[var(--bg-deep)] p-5 sm:p-6">
                <h2 className="font-cormorant text-2xl text-[var(--text-on-dark)]">Если ещё не оплатили</h2>
                <p className="mt-2 font-inter text-sm leading-relaxed text-[var(--text-on-dark-soft)]">
                  Переведите {money(order.total)} по номеру телефона через систему быстрых платежей.
                  Назначение платежа указывать не нужно.
                </p>
                <dl className="mt-4 space-y-2 font-inter text-sm">
                  <div className="flex justify-between gap-3"><dt className="text-[var(--text-on-dark-soft)]">Телефон</dt><dd className="text-[var(--text-on-dark)]">{OFFLINE_PAYMENT.phone}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-[var(--text-on-dark-soft)]">Банк</dt><dd className="text-[var(--text-on-dark)]">{OFFLINE_PAYMENT.bank}</dd></div>
                </dl>
              </div>
            )}

            <p className="mt-8 font-inter text-sm text-[var(--ink-soft)]">
              Вопрос по заказу? Напишите на{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[var(--gold)] hover:underline">{SUPPORT_EMAIL}</a> — эта страница
              всегда показывает текущее состояние, её адрес можно сохранить в закладки.
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

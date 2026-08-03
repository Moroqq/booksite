import Link from "next/link";
import { CircleAlert, Clock3, PackageCheck, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCustomerOrderIds } from "@/lib/customer-orders";
import { getBookOrdersByIds, orderItems, type OrderStatus } from "@/lib/orders-db";
import { formatPrice } from "@/lib/seminars-db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Мои заказы", robots: { index: false, follow: false } };

const statusInfo: Record<OrderStatus, { label: string; description: string; icon: typeof Clock3; tone: string }> = {
  payment_pending: { label: "На проверке оплаты", description: "Мы получили уведомление и вручную сверяем перевод в банке. Обычно это занимает до одного рабочего дня.", icon: Clock3, tone: "text-[var(--gold)] bg-[var(--gold)]/10" },
  preparing: { label: "Готовится к отправке", description: "Оплата подтверждена. Мы готовим книгу и уточняем отправку.", icon: PackageCheck, tone: "text-[var(--sky-color)] bg-[var(--sky-color)]/15" },
  shipped: { label: "Отправлен", description: "Книга передана в доставку. Детали отправления сообщим по вашим контактам.", icon: Truck, tone: "text-[var(--sage)] bg-[var(--sage)]/15" },
  payment_rejected: { label: "Оплата не подтверждена", description: "Перевод пока не удалось сопоставить с заказом. Пожалуйста, свяжитесь с нами для уточнения.", icon: CircleAlert, tone: "text-[var(--rose-color)] bg-[var(--rose-color)]/15" },
  cancelled: { label: "Отменён", description: "Этот заказ отменён.", icon: CircleAlert, tone: "text-[var(--ink-soft)] bg-black/10" },
};

function date(value: string) { return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeStyle: "short" }).format(new Date(value)); }

export default function OrdersPage() {
  const orders = getBookOrdersByIds(getCustomerOrderIds());
  return <><Header /><main id="main-content" className="min-h-screen pt-20"><section className="section-padding bg-[var(--bg)]"><div className="container-layout max-w-3xl"><p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Личный раздел</p><h1 className="mt-3 font-cormorant text-4xl text-[var(--ink)] sm:text-5xl">Мои заказы</h1><p className="mt-3 max-w-xl font-inter text-[var(--ink-soft)]">Здесь отображаются заказы, оформленные в этом браузере. Статусы обновляются после ручной проверки.</p>{orders.length === 0 ? <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/60 p-7"><h2 className="font-cormorant text-3xl text-[var(--ink)]">Пока нет заказов</h2><p className="mt-2 font-inter text-sm text-[var(--ink-soft)]">После оформления заказа он появится здесь.</p><Link href="/book/order" className="mt-6 inline-flex rounded-full bg-[var(--bg-deep)] px-6 py-3 font-inter text-xs uppercase tracking-widest text-white hover:bg-[var(--gold)]">Купить книгу</Link></div> : <div className="mt-8 space-y-5">{orders.map((order) => { const info = statusInfo[order.status]; const Icon = info.icon; return <article key={order.id} className="rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">Заказ {order.number}</p><h2 className="mt-2 font-cormorant text-2xl text-[var(--ink)]">{orderItems(order)}</h2><p className="mt-1 font-inter text-sm text-[var(--ink-soft)]">{formatPrice(order.total)} · оформлен {date(order.createdAt)}</p></div><span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 font-inter text-xs ${info.tone}`}><Icon size={16} />{info.label}</span></div><div className="mt-5 border-t border-[var(--line)] pt-4"><p className="font-inter text-sm leading-relaxed text-[var(--ink-soft)]">{info.description}</p>{order.rejectionReason && <div className="mt-3 rounded-lg bg-[var(--rose-color)]/10 p-3 font-inter text-sm text-[var(--ink)]"><span className="font-medium">Причина: </span>{order.rejectionReason}</div>}</div></article>; })}</div>}</div></section></main><Footer /></>;
}

import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getBookOrders, orderBuyerName, orderItems, type BookOrder, type OrderStatus } from "@/lib/orders-db";
import { formatPrice } from "@/lib/seminars-db";
import { confirmOrderPaymentAction, markOrderShippedAction, rejectOrderPaymentAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Админка — заказы", robots: { index: false, follow: false } };

const labels: Record<OrderStatus, string> = {
  payment_pending: "На проверке оплаты",
  preparing: "Готовится к отправке",
  shipped: "Отправлен",
  payment_rejected: "Оплата не подтверждена",
  cancelled: "Отменён",
};

const badgeStyles: Record<OrderStatus, string> = {
  payment_pending: "bg-[var(--gold)]/15 text-[var(--ink)]",
  preparing: "bg-[var(--sky-color)]/20 text-[var(--ink)]",
  shipped: "bg-[var(--sage)]/20 text-[var(--ink)]",
  payment_rejected: "bg-[var(--rose-color)]/20 text-[var(--ink)]",
  cancelled: "bg-black/10 text-[var(--ink-soft)]",
};

function date(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function OrderActions({ order }: { order: BookOrder }) {
  if (order.status === "payment_pending") {
    return <div className="flex flex-wrap gap-2">
      <form action={confirmOrderPaymentAction}><input type="hidden" name="id" value={order.id} /><button className="rounded-full bg-[var(--bg-deep)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-white hover:bg-[var(--gold)]">Оплата подтверждена</button></form>
      <form action={markOrderShippedAction}><input type="hidden" name="id" value={order.id} /><button className="rounded-full border border-[var(--sage)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-[var(--ink)] hover:bg-[var(--sage)]/15">Подтвердить и отправить</button></form>
      <details className="relative"><summary className="cursor-pointer list-none rounded-full border border-[var(--rose-color)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-[var(--ink)] hover:bg-[var(--rose-color)]/10">Отказать в оплате</summary><form action={rejectOrderPaymentAction} className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 shadow-lg"><input type="hidden" name="id" value={order.id} /><label className="font-inter text-xs text-[var(--ink-soft)]">Причина для покупателя<textarea required name="reason" rows={3} className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white p-2 text-sm text-[var(--ink)]" placeholder="Например: перевод не найден по указанным данным." /></label><button className="mt-2 rounded-full bg-[var(--rose-color)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-white">Сохранить отказ</button></form></details>
    </div>;
  }
  if (order.status === "preparing") return <form action={markOrderShippedAction}><input type="hidden" name="id" value={order.id} /><button className="rounded-full border border-[var(--sage)] px-3 py-2 font-inter text-xs uppercase tracking-wider text-[var(--ink)] hover:bg-[var(--sage)]/15">Отметить отправленным</button></form>;
  return <span className="font-inter text-xs text-[var(--ink-soft)]">Действия не требуются</span>;
}

function OrderRow({ order }: { order: BookOrder }) {
  return <tr className="border-b border-[var(--line)] last:border-none align-top font-inter text-sm text-[var(--ink-soft)]"><td className="p-4 text-[var(--ink)]"><span className="block font-medium">{order.number}</span><span className="mt-1 block text-xs">{date(order.createdAt)}</span></td><td className="p-4"><span className="block text-[var(--ink)]">{orderBuyerName(order)}</span><a className="block text-xs hover:text-[var(--gold)]" href={`mailto:${order.customer.email}`}>{order.customer.email}</a><span className="block text-xs">{order.customer.phone}</span></td><td className="p-4"><span className="block">{orderItems(order)}</span><span className="block text-xs">{formatPrice(order.total)}</span></td><td className="p-4 max-w-[240px]"><span className="block text-[var(--ink)]">{order.delivery.method}</span><span className="block text-xs leading-relaxed">{order.delivery.address}</span>{order.delivery.comment && <span className="mt-1 block text-xs italic">{order.delivery.comment}</span>}</td><td className="p-4"><span className={`inline-block rounded-full px-2.5 py-1 text-xs ${badgeStyles[order.status]}`}>{labels[order.status]}</span>{order.rejectionReason && <span className="mt-2 block max-w-[200px] text-xs leading-relaxed text-[var(--rose-color)]">{order.rejectionReason}</span>}</td><td className="p-4"><OrderActions order={order} /></td></tr>;
}

export default function OrdersPage() {
  if (!isAuthed()) redirect("/admin/login");
  const orders = getBookOrders();
  const pending = orders.filter((order) => order.status === "payment_pending");
  return <AdminShell active="/admin/orders"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-cormorant text-3xl text-[var(--ink)]">Заказы книг</h2><p className="font-inter text-sm text-[var(--ink-soft)] mt-1">Переводы проверяются вручную в банке. Внешние платёжные сервисы не подключены.</p></div><span className="w-fit rounded-full bg-[var(--gold)]/15 px-3 py-1.5 font-inter text-xs text-[var(--ink)]">На проверке: {pending.length}</span></div><section className="mt-8 rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-5"><h3 className="font-cormorant text-2xl text-[var(--ink)]">Ожидают проверки оплаты</h3><p className="font-inter text-sm text-[var(--ink-soft)] mt-1">Сверьте перевод в банке, затем подтвердите оплату или сообщите покупателю причину отказа.</p>{pending.length === 0 ? <p className="mt-4 font-inter text-sm text-[var(--ink-soft)]">Сейчас нет заказов на проверке.</p> : <div className="mt-4 space-y-3">{pending.map((order) => <article key={order.id} className="rounded-xl border border-[var(--line)] bg-white/70 p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div className="font-inter text-sm text-[var(--ink-soft)]"><p className="font-medium text-[var(--ink)]">{order.number} · {orderBuyerName(order)}</p><p>{orderItems(order)} · {formatPrice(order.total)}</p><p className="mt-1 text-xs">{order.customer.phone} · {order.delivery.method}</p></div><OrderActions order={order} /></div></article>)}</div>}</section><div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/60"><table className="w-full min-w-[1050px] text-left"><thead className="border-b border-[var(--line)]"><tr className="font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]"><th className="p-4 font-normal">Заказ</th><th className="p-4 font-normal">Покупатель</th><th className="p-4 font-normal">Состав</th><th className="p-4 font-normal">Доставка</th><th className="p-4 font-normal">Статус</th><th className="p-4 font-normal">Действие</th></tr></thead><tbody>{orders.map((order) => <OrderRow key={order.id} order={order} />)}{orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center font-inter text-sm text-[var(--ink-soft)]">Заказов пока нет.</td></tr>}</tbody></table></div></AdminShell>;
}

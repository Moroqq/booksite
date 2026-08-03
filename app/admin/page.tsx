import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthed } from "@/lib/admin-auth";
import { getAdminArticles } from "@/lib/articles-db";
import { getAllSeminars } from "@/lib/seminars-db";
import { getBookOrders } from "@/lib/orders-db";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Админ-панель", robots: { index: false, follow: false } };

export default function AdminPage() {
  if (!isAuthed()) redirect("/admin/login");
  const articleCount = getAdminArticles().length;
  const seminarCount = getAllSeminars().length;
  const orderCount = getBookOrders().length;
  const cards = [["Статьи", articleCount, "Черновики, публикация и редактура", "/admin/articles"], ["Семинары", seminarCount, "Расписание, форматы и стоимость", "/admin/seminars"], ["Заказы книг", orderCount, "Локальная проверка демонстрационных заказов", "/admin/orders"]];
  return <AdminShell active="/admin"><section><p className="font-cormorant text-2xl text-[var(--ink)] mb-6">Рабочая область</p><div className="grid gap-5 md:grid-cols-3">{cards.map(([title, count, note, href]) => <Link href={href as string} key={title as string} className="rounded-2xl border border-[var(--line)] bg-white/60 p-6 hover:border-[var(--gold)] hover:shadow-sm transition-all"><p className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">{title}</p><p className="font-cormorant text-5xl text-[var(--ink)] mt-3">{count}</p><p className="font-inter text-sm leading-relaxed text-[var(--ink-soft)] mt-3">{note}</p></Link>)}</div><p className="font-inter text-xs text-[var(--ink-soft)]/70 mt-8">Данные сохраняются только в локальной базе. Оплата и внешние интеграции не подключены.</p></section></AdminShell>;
}

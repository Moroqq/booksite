import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const links = [
  ["/admin", "Обзор"],
  ["/admin/articles", "Статьи"],
  ["/admin/seminars", "Семинары"],
  ["/admin/orders", "Заказы книг"],
  ["/admin/signups", "Записи на семинары"],
];

export default function AdminShell({ children, active }: { children: React.ReactNode; active: string }) {
  return <main className="min-h-screen bg-[var(--bg)]"><div className="container-layout max-w-6xl py-8 sm:py-12">
    <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-7 mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="font-inter text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2">Booksite · локально</p><h1 className="font-cormorant text-4xl text-[var(--ink)]">Админ-панель</h1></div>
      <LogoutButton />
    </header>
    <nav className="flex flex-wrap gap-2 mb-8" aria-label="Разделы админ-панели">{links.map(([href, label]) => <Link key={href} href={href} className={`font-inter text-xs uppercase tracking-widest rounded-full px-4 py-2 border transition-colors ${active === href ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--ink)]" : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--gold)]"}`}>{label}</Link>)}</nav>
    {children}
  </div></main>;
}

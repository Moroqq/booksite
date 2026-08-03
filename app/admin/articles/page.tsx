import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getAdminArticles } from "@/lib/articles-db";
import { deleteArticleAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Админка — статьи", robots: { index: false, follow: false } };

export default function ArticlesPage({ searchParams }: { searchParams: { created?: string; updated?: string; deleted?: string } }) {
  if (!isAuthed()) redirect("/admin/login");
  const articles = getAdminArticles();
  const notice = searchParams.created ? "Статья создана." : searchParams.updated ? "Изменения сохранены." : searchParams.deleted ? "Статья удалена." : null;
  return <AdminShell active="/admin/articles"><div className="flex items-center justify-between gap-4 mb-6"><div><h2 className="font-cormorant text-3xl text-[var(--ink)]">Статьи</h2><p className="font-inter text-sm text-[var(--ink-soft)]">Черновики не появляются в публичном блоге.</p></div><Link href="/admin/articles/new" className="btn-gold rounded-full px-5 py-2.5 font-inter text-xs uppercase tracking-widest">Новая статья</Link></div>{notice && <p className="mb-5 rounded-xl bg-[var(--sage)]/10 px-4 py-3 font-inter text-sm text-[var(--sage)]">{notice}</p>}<div className="space-y-3">{articles.map((article) => <article key={article.id} className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-white/60 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex gap-2 items-center"><span className={`rounded-full px-2.5 py-1 font-inter text-[10px] uppercase tracking-widest ${article.status === "published" ? "bg-[var(--sage)]/15 text-[var(--sage)]" : "bg-[var(--gold)]/15 text-[var(--ink-soft)]"}`}>{article.status === "published" ? "Опубликовано" : "Черновик"}</span><time className="font-inter text-xs text-[var(--ink-soft)]/65">{article.date}</time></div><h3 className="font-cormorant text-xl text-[var(--ink)] mt-2">{article.title}</h3></div><div className="flex gap-3"><Link className="rounded-full border border-[var(--line)] px-4 py-2 font-inter text-xs uppercase tracking-widest text-[var(--ink-soft)] hover:border-[var(--gold)]" href={`/admin/articles/${article.id}`}>Редактировать</Link><form action={deleteArticleAction}><input type="hidden" name="id" value={article.id} /><button className="rounded-full border border-[var(--rose-color)]/40 px-4 py-2 font-inter text-xs uppercase tracking-widest text-[var(--rose-color)] hover:bg-[var(--rose-color)]/10">Удалить</button></form></div></article>)}</div></AdminShell>;
}

import type { AdminArticle } from "@/lib/articles-db";

const input = "w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-2.5 font-inter text-sm text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none";
const label = "mb-1.5 block font-inter text-xs uppercase tracking-wider text-[var(--ink-soft)]";

export default function ArticleForm({ article, action, submit }: { article?: AdminArticle; action: (data: FormData) => void | Promise<void>; submit: string }) {
  const body = article?.sections.map((section) => section.text).join("\n\n") || "";
  return <form action={action} className="space-y-5 rounded-2xl border border-[var(--line)] bg-white/60 p-6 sm:p-8">
    {article && <input type="hidden" name="id" value={article.id} />}
    <div><label className={label} htmlFor="title">Заголовок *</label><input id="title" className={input} name="title" defaultValue={article?.title} required /></div>
    <div><label className={label} htmlFor="excerpt">Краткое введение *</label><textarea id="excerpt" className={input} name="excerpt" rows={3} defaultValue={article?.excerpt} required /></div>
    <div><label className={label} htmlFor="lead">Лид для страницы статьи *</label><textarea id="lead" className={input} name="lead" rows={3} defaultValue={article?.lead} required /></div>
    <div><label className={label} htmlFor="body">Основной текст *</label><textarea id="body" className={`${input} min-h-64`} name="body" defaultValue={body} required /><p className="font-inter text-xs text-[var(--ink-soft)]/65 mt-1.5">Разделяйте абзацы пустой строкой.</p></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><label className={label} htmlFor="date">Дата *</label><input id="date" type="date" className={input} name="date" defaultValue={article?.date || new Date().toISOString().slice(0, 10)} required /></div><div><label className={label} htmlFor="status">Статус *</label><select id="status" className={input} name="status" defaultValue={article?.status || "draft"}><option value="draft">Черновик</option><option value="published">Опубликовано</option></select></div></div>
    <button className="btn-gold rounded-full px-6 py-3 font-inter text-xs uppercase tracking-widest">{submit}</button>
  </form>;
}

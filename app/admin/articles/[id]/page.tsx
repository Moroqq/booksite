import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getAdminArticle } from "@/lib/articles-db";
import { updateArticleAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";
export default function EditArticlePage({ params }: { params: { id: string } }) { if (!isAuthed()) redirect("/admin/login"); const article = getAdminArticle(params.id); if (!article) notFound(); return <AdminShell active="/admin/articles"><Link href="/admin/articles" className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">← К статьям</Link><h2 className="font-cormorant text-3xl text-[var(--ink)] mt-5 mb-6">Редактировать статью</h2><ArticleForm article={article} action={updateArticleAction} submit="Сохранить изменения" /></AdminShell>; }

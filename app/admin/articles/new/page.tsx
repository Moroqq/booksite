import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { createArticleAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = { title: "Новая статья", robots: { index: false, follow: false } };
export default function NewArticlePage() { if (!isAuthed()) redirect("/admin/login"); return <AdminShell active="/admin/articles"><Link href="/admin/articles" className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">← К статьям</Link><h2 className="font-cormorant text-3xl text-[var(--ink)] mt-5 mb-6">Новая статья</h2><ArticleForm action={createArticleAction} submit="Создать статью" /></AdminShell>; }

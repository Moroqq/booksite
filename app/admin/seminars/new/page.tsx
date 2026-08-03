import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { createSeminarAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import SeminarForm from "@/components/admin/SeminarForm";

export const metadata = { title: "Новый семинар", robots: { index: false, follow: false } };
export default function NewSeminarPage() { if (!isAuthed()) redirect("/admin/login"); return <AdminShell active="/admin/seminars"><Link href="/admin/seminars" className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">← К семинарам</Link><h2 className="font-cormorant text-3xl text-[var(--ink)] mt-5 mb-6">Новый семинар</h2><SeminarForm action={createSeminarAction} submit="Создать семинар" /></AdminShell>; }

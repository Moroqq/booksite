import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import { getSeminarById } from "@/lib/seminars-db";
import { updateSeminarAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import SeminarForm from "@/components/admin/SeminarForm";

export const dynamic = "force-dynamic";
export default function EditSeminarPage({ params }: { params: { id: string } }) { if (!isAuthed()) redirect("/admin/login"); const seminar = getSeminarById(params.id); if (!seminar) notFound(); return <AdminShell active="/admin/seminars"><Link href="/admin/seminars" className="font-inter text-xs uppercase tracking-widest text-[var(--gold)]">← К семинарам</Link><h2 className="font-cormorant text-3xl text-[var(--ink)] mt-5 mb-6">Редактировать семинар</h2><SeminarForm seminar={seminar} action={updateSeminarAction} submit="Сохранить изменения" /></AdminShell>; }

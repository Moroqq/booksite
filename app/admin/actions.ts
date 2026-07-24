"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword, setSession, clearSession, isAuthed } from "@/lib/admin-auth";
import { createSeminar, deleteSeminar, type SeminarInput } from "@/lib/seminars-db";
import type { SeminarFormat } from "@/lib/seminars";

const FORMATS: SeminarFormat[] = ["Очный", "Онлайн", "Выездной"];

function revalidatePublic() {
  revalidatePath("/admin");
  revalidatePath("/seminars");
  revalidatePath("/");
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  setSession();
  redirect("/admin");
}

export async function logoutAction() {
  clearSession();
  redirect("/admin/login");
}

export async function createSeminarAction(formData: FormData) {
  if (!isAuthed()) redirect("/admin/login");

  const get = (k: string) => String(formData.get(k) || "").trim();

  const title = get("title");
  const location = get("location");
  const dateStart = get("dateStart");
  const dateEnd = get("dateEnd");
  const formatRaw = get("format");
  const duration = get("duration");
  const price = Number(get("price"));
  const instructor = get("instructor");
  const description = get("description");
  const forWhom = get("forWhom")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const spots = Number(get("spots"));
  const spotsLeft = get("spotsLeft") === "" ? spots : Number(get("spotsLeft"));

  const format = (FORMATS.includes(formatRaw as SeminarFormat) ? formatRaw : "Очный") as SeminarFormat;

  // Minimal validation — bounce back on missing essentials.
  if (!title || !location || !dateStart || !dateEnd || !duration || !instructor || !description) {
    redirect("/admin?error=fields");
  }
  if (!Number.isFinite(price) || price < 0 || !Number.isFinite(spots) || spots < 0) {
    redirect("/admin?error=numbers");
  }

  const input: SeminarInput = {
    title,
    location,
    dateStart,
    dateEnd,
    format,
    duration,
    price,
    instructor,
    description,
    forWhom: forWhom.length ? forWhom : ["Все желающие"],
    spots,
    spotsLeft: Number.isFinite(spotsLeft) ? spotsLeft : spots,
  };

  createSeminar(input);
  revalidatePublic();
  redirect("/admin?created=1");
}

export async function deleteSeminarAction(formData: FormData) {
  if (!isAuthed()) redirect("/admin/login");
  const id = String(formData.get("id") || "");
  if (id) deleteSeminar(id);
  revalidatePublic();
  redirect("/admin?deleted=1");
}

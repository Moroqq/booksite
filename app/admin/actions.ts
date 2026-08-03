"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword, setSession, clearSession, isAuthed } from "@/lib/admin-auth";
import { createSeminar, deleteSeminar, updateSeminar, type SeminarInput } from "@/lib/seminars-db";
import { createArticle, deleteArticle, updateArticle, type ArticleInput } from "@/lib/articles-db";
import { getBookOrder, updateBookOrderStatus } from "@/lib/orders-db";
import type { SeminarFormat } from "@/lib/seminars";

const FORMATS: SeminarFormat[] = ["Очный", "Онлайн", "Выездной"];

function ensureAccess() {
  if (!isAuthed()) redirect("/admin/login");
}

function revalidateContent() {
  ["/", "/blog", "/seminars", "/admin", "/admin/articles", "/admin/seminars"].forEach((path) => revalidatePath(path));
}

function revalidateOrders() {
  ["/admin", "/admin/orders", "/orders"].forEach((path) => revalidatePath(path));
}

function text(formData: FormData, field: string) {
  return String(formData.get(field) || "").trim();
}

function articleInput(formData: FormData): ArticleInput | null {
  const title = text(formData, "title");
  const excerpt = text(formData, "excerpt");
  const lead = text(formData, "lead");
  const body = text(formData, "body");
  const date = text(formData, "date");
  const status = text(formData, "status") === "published" ? "published" : "draft";
  return title && excerpt && lead && body && date ? { title, excerpt, lead, body, date, status } : null;
}

function seminarInput(formData: FormData): SeminarInput | null {
  const title = text(formData, "title");
  const location = text(formData, "location");
  const dateStart = text(formData, "dateStart");
  const dateEnd = text(formData, "dateEnd");
  const duration = text(formData, "duration");
  const instructor = text(formData, "instructor");
  const description = text(formData, "description");
  const price = Number(text(formData, "price"));
  const spots = Number(text(formData, "spots"));
  const spotsLeft = Number(text(formData, "spotsLeft"));
  const rawFormat = text(formData, "format");
  const format = FORMATS.includes(rawFormat as SeminarFormat) ? rawFormat as SeminarFormat : "Очный";
  const forWhom = text(formData, "forWhom").split(",").map((value) => value.trim()).filter(Boolean);
  if (!title || !location || !dateStart || !dateEnd || !duration || !instructor || !description || !Number.isFinite(price) || price < 0 || !Number.isFinite(spots) || spots < 0 || !Number.isFinite(spotsLeft) || spotsLeft < 0) return null;
  return { title, location, dateStart, dateEnd, duration, instructor, description, price, spots, spotsLeft, format, forWhom: forWhom.length ? forWhom : ["Все желающие"] };
}

export async function loginAction(formData: FormData) {
  if (!verifyPassword(text(formData, "password"))) redirect("/admin/login?error=1");
  setSession();
  redirect("/admin");
}

export async function logoutAction() {
  clearSession();
  redirect("/admin/login");
}

export async function createArticleAction(formData: FormData) {
  ensureAccess();
  const input = articleInput(formData);
  if (!input) redirect("/admin/articles/new?error=fields");
  createArticle(input);
  revalidateContent();
  redirect("/admin/articles?created=1");
}

export async function updateArticleAction(formData: FormData) {
  ensureAccess();
  const id = text(formData, "id");
  const input = articleInput(formData);
  if (!id || !input) redirect(`/admin/articles/${id}?error=fields`);
  updateArticle(id, input);
  revalidateContent();
  redirect("/admin/articles?updated=1");
}

export async function deleteArticleAction(formData: FormData) {
  ensureAccess();
  deleteArticle(text(formData, "id"));
  revalidateContent();
  redirect("/admin/articles?deleted=1");
}

export async function createSeminarAction(formData: FormData) {
  ensureAccess();
  const input = seminarInput(formData);
  if (!input) redirect("/admin/seminars/new?error=fields");
  createSeminar(input);
  revalidateContent();
  redirect("/admin/seminars?created=1");
}

export async function updateSeminarAction(formData: FormData) {
  ensureAccess();
  const id = text(formData, "id");
  const input = seminarInput(formData);
  if (!id || !input) redirect(`/admin/seminars/${id}?error=fields`);
  updateSeminar(id, input);
  revalidateContent();
  redirect("/admin/seminars?updated=1");
}

export async function deleteSeminarAction(formData: FormData) {
  ensureAccess();
  deleteSeminar(text(formData, "id"));
  revalidateContent();
  redirect("/admin/seminars?deleted=1");
}

export async function confirmOrderPaymentAction(formData: FormData) {
  ensureAccess();
  const id = text(formData, "id");
  const order = getBookOrder(id);
  if (order?.status === "payment_pending") updateBookOrderStatus(id, "preparing");
  revalidateOrders();
}

export async function markOrderShippedAction(formData: FormData) {
  ensureAccess();
  const id = text(formData, "id");
  const order = getBookOrder(id);
  if (order && (order.status === "payment_pending" || order.status === "preparing")) updateBookOrderStatus(id, "shipped");
  revalidateOrders();
}

export async function rejectOrderPaymentAction(formData: FormData) {
  ensureAccess();
  const id = text(formData, "id");
  const reason = text(formData, "reason");
  const order = getBookOrder(id);
  if (order?.status === "payment_pending") updateBookOrderStatus(id, "payment_rejected", reason);
  revalidateOrders();
}

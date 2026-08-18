import crypto from "node:crypto";
import { cookies } from "next/headers";
import { findUserById, type AuthProvider, type SiteUser } from "./users-db";

const COOKIE_NAME = "customer_session";
const SECRET = process.env.ADMIN_SECRET || "salesbook-dev-secret-change-me";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 дней

export const PROVIDER_LABELS: Record<AuthProvider, string> = { vk: "VK ID", yandex: "Яндекс ID" };
export const ALL_PROVIDERS: AuthProvider[] = ["vk", "yandex"];

export function isProviderConfigured(provider: AuthProvider) {
  if (provider === "vk") return !!process.env.VK_CLIENT_ID;
  return !!(process.env.YANDEX_CLIENT_ID && process.env.YANDEX_CLIENT_SECRET);
}

export function configuredProviders(): AuthProvider[] {
  return ALL_PROVIDERS.filter(isProviderConfigured);
}

/**
 * Вход обязателен только тогда, когда хотя бы один сервис реально настроен.
 * Без этой проверки отсутствие ключей в .env закрыло бы приём заказов на живом сайте.
 */
export function isLoginRequired() {
  return configuredProviders().length > 0;
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function setCustomerSession(userId: string) {
  cookies().set(COOKIE_NAME, `${userId}.${sign(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearCustomerSession() {
  cookies().delete(COOKIE_NAME);
}

export function getCurrentUserId(): string | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const separator = raw.lastIndexOf(".");
  if (separator < 0) return null;
  const id = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  const expected = sign(id);
  if (signature.length !== expected.length) return null;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? id : null;
}

export function getCurrentUser(): SiteUser | null {
  const id = getCurrentUserId();
  return id ? findUserById(id) : null;
}

/** Куда возвращать после входа: только внутренние адреса, чтобы вход нельзя было увести на чужой сайт. */
export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

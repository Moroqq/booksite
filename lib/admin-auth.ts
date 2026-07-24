import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_SECRET || "salesbook-dev-secret-change-me";

/** Deterministic session token derived from the configured password. */
function sessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", SECRET).update(pw).digest("hex");
}

/** Constant-time compare of a submitted password against ADMIN_PASSWORD. */
export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isAuthed(): boolean {
  const value = cookies().get(COOKIE_NAME)?.value;
  return !!value && value === sessionToken();
}

export function setSession(): void {
  cookies().set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSession(): void {
  cookies().delete(COOKIE_NAME);
}

import crypto from "node:crypto";
import type { AuthProvider, OAuthProfile } from "./users-db";
import { siteOrigin } from "./site";

/**
 * Вход через российские сервисы.
 * VK ID работает по OAuth 2.1 с PKCE (старый OAuth 2.0 отключён), Яндекс ID — по обычному OAuth 2.0.
 */

export function redirectUri(provider: AuthProvider) {
  return `${siteOrigin()}/api/auth/${provider}/callback`;
}

export function createVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

export function challengeOf(verifier: string) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

export function createState() {
  return crypto.randomBytes(16).toString("base64url");
}

export function authorizeUrl(provider: AuthProvider, options: { state: string; verifier: string }) {
  if (provider === "vk") {
    const url = new URL("https://id.vk.com/authorize");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", process.env.VK_CLIENT_ID || "");
    url.searchParams.set("redirect_uri", redirectUri("vk"));
    url.searchParams.set("state", options.state);
    url.searchParams.set("code_challenge", challengeOf(options.verifier));
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("scope", "email phone");
    return url.toString();
  }

  const url = new URL("https://oauth.yandex.ru/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.YANDEX_CLIENT_ID || "");
  url.searchParams.set("redirect_uri", redirectUri("yandex"));
  url.searchParams.set("state", options.state);
  return url.toString();
}

async function postForm(url: string, body: Record<string, string>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload) throw new Error(`Сервис входа ответил ошибкой (${response.status})`);
  return payload as Record<string, unknown>;
}

export async function exchangeCode(
  provider: AuthProvider,
  options: { code: string; verifier: string; deviceId?: string; state: string }
): Promise<string> {
  if (provider === "vk") {
    const payload = await postForm("https://id.vk.com/oauth2/auth", {
      grant_type: "authorization_code",
      code: options.code,
      code_verifier: options.verifier,
      client_id: process.env.VK_CLIENT_ID || "",
      device_id: options.deviceId || "",
      redirect_uri: redirectUri("vk"),
      state: options.state,
    });
    const token = payload.access_token;
    if (typeof token !== "string") throw new Error("VK ID не вернул токен доступа");
    return token;
  }

  const payload = await postForm("https://oauth.yandex.ru/token", {
    grant_type: "authorization_code",
    code: options.code,
    client_id: process.env.YANDEX_CLIENT_ID || "",
    client_secret: process.env.YANDEX_CLIENT_SECRET || "",
    redirect_uri: redirectUri("yandex"),
  });
  const token = payload.access_token;
  if (typeof token !== "string") throw new Error("Яндекс ID не вернул токен доступа");
  return token;
}

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

export async function fetchProfile(provider: AuthProvider, accessToken: string): Promise<OAuthProfile> {
  if (provider === "vk") {
    const payload = await postForm("https://id.vk.com/oauth2/user_info", {
      access_token: accessToken,
      client_id: process.env.VK_CLIENT_ID || "",
    });
    const user = (payload.user || {}) as Record<string, unknown>;
    const providerId = str(user.user_id) || String(user.user_id ?? "");
    if (!providerId) throw new Error("VK ID не вернул идентификатор пользователя");
    return {
      provider,
      providerId,
      firstName: str(user.first_name) || "",
      lastName: str(user.last_name) || "",
      email: str(user.email),
      phone: str(user.phone),
    };
  }

  const response = await fetch("https://login.yandex.ru/info?format=json", {
    headers: { Authorization: `OAuth ${accessToken}` },
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok || !payload) throw new Error(`Яндекс ID ответил ошибкой (${response.status})`);
  const providerId = str(payload.id);
  if (!providerId) throw new Error("Яндекс ID не вернул идентификатор пользователя");
  const defaultPhone = (payload.default_phone || {}) as Record<string, unknown>;
  const display = str(payload.display_name) || str(payload.real_name) || "";
  const [displayFirst = "", displayLast = ""] = display.split(" ");
  return {
    provider,
    providerId,
    firstName: str(payload.first_name) || displayFirst,
    lastName: str(payload.last_name) || displayLast,
    email: str(payload.default_email),
    phone: str(defaultPhone.number),
  };
}

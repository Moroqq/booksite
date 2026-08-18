import { NextRequest, NextResponse } from "next/server";
import { ALL_PROVIDERS, isProviderConfigured, safeNextPath, setCustomerSession } from "@/lib/customer-auth";
import { exchangeCode, fetchProfile } from "@/lib/oauth";
import { upsertUserFromProfile, type AuthProvider } from "@/lib/users-db";

export const dynamic = "force-dynamic";

type Flow = { provider?: string; state?: string; verifier?: string; next?: string };

function fail(request: NextRequest, reason: string) {
  return NextResponse.redirect(new URL(`/login?error=${reason}`, request.url));
}

/** Возврат от сервиса входа: меняем код на токен, заводим пользователя, ставим сессию. */
export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider as AuthProvider;
  if (!ALL_PROVIDERS.includes(provider) || !isProviderConfigured(provider)) return fail(request, "provider");
  if (request.nextUrl.searchParams.get("error")) return fail(request, "cancelled");

  let flow: Flow = {};
  try {
    flow = JSON.parse(request.cookies.get("oauth_flow")?.value || "{}") as Flow;
  } catch {
    return fail(request, "expired");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state || !flow.state || !flow.verifier || flow.provider !== provider) return fail(request, "expired");
  if (state !== flow.state) return fail(request, "state");

  try {
    const token = await exchangeCode(provider, {
      code,
      verifier: flow.verifier,
      deviceId: request.nextUrl.searchParams.get("device_id") || undefined,
      state,
    });
    const user = upsertUserFromProfile(await fetchProfile(provider, token));
    setCustomerSession(user.id);

    const response = NextResponse.redirect(new URL(safeNextPath(flow.next), request.url));
    response.cookies.delete("oauth_flow");
    return response;
  } catch (error) {
    console.error("[AUTH] Не удалось завершить вход:", error);
    return fail(request, "failed");
  }
}

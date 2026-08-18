import { NextRequest, NextResponse } from "next/server";
import { ALL_PROVIDERS, isProviderConfigured, safeNextPath } from "@/lib/customer-auth";
import { authorizeUrl, createState, createVerifier } from "@/lib/oauth";
import type { AuthProvider } from "@/lib/users-db";

export const dynamic = "force-dynamic";

/** Начало входа: уводим пользователя на VK ID или Яндекс ID. */
export async function GET(request: NextRequest, { params }: { params: { provider: string } }) {
  const provider = params.provider as AuthProvider;
  if (!ALL_PROVIDERS.includes(provider) || !isProviderConfigured(provider)) {
    return NextResponse.redirect(new URL("/login?error=provider", request.url));
  }

  const state = createState();
  const verifier = createVerifier();
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  const response = NextResponse.redirect(authorizeUrl(provider, { state, verifier }));
  response.cookies.set("oauth_flow", JSON.stringify({ provider, state, verifier, next }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

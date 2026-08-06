import { NextRequest, NextResponse } from "next/server";

/**
 * Админка живёт на отдельном (под)домене, а не на основном сайте.
 * Локально: http://admin.localhost:3010/ — добавьте "127.0.0.1 admin.localhost" в /etc/hosts.
 * В проде: задайте ADMIN_HOSTNAME=admin.вашдомен.ру в .env.local.
 */
const ADMIN_HOSTNAME = process.env.ADMIN_HOSTNAME || "admin.localhost";

function hostnameOf(request: NextRequest) {
  return (request.headers.get("host") || "").split(":")[0];
}

export function middleware(request: NextRequest) {
  const hostname = hostnameOf(request);
  const { pathname } = request.nextUrl;
  const isAdminHost = hostname === ADMIN_HOSTNAME;

  if (isAdminHost) {
    if (pathname.startsWith("/admin")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};

import { NextResponse } from "next/server";
import { siteOrigin } from "@/lib/site";
import { clearCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  clearCustomerSession();
  return NextResponse.redirect(new URL("/", siteOrigin()), { status: 303 });
}

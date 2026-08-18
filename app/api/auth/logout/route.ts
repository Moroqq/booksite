import { NextRequest, NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  clearCustomerSession();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

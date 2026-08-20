import { NextRequest, NextResponse } from "next/server";
import { findBookOrder } from "@/lib/orders-db";

export const dynamic = "force-dynamic";

/**
 * Поиск заказа для тех, кто потерял письмо.
 * Обычная форма без JavaScript: телефон уходит в теле запроса, а не в адресной строке.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const number = String(form.get("number") || "").trim();
  const phone = String(form.get("phone") || "").trim();

  if (!number || !phone) {
    return NextResponse.redirect(new URL("/check?error=empty", request.url), { status: 303 });
  }

  const order = findBookOrder(number, phone);
  if (!order) {
    return NextResponse.redirect(new URL("/check?error=notfound", request.url), { status: 303 });
  }

  return NextResponse.redirect(new URL(`/order/${order.token}`, request.url), { status: 303 });
}

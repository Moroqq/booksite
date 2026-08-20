import { NextRequest, NextResponse } from "next/server";
import { ordersAwaitingPayment, markPaymentReminderSent } from "@/lib/orders-db";
import { signupsToRemind, markSignupReminderSent } from "@/lib/seminar-signups-db";
import { getSeminarById } from "@/lib/seminars-db";
import { sendPaymentReminder, sendSeminarReminder } from "@/lib/letters";
import { isMailConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";

/**
 * Рассылка напоминаний. Вызывается по расписанию с сервера:
 *   curl -s "https://zvukterap.ru/api/cron/reminders?key=..."
 *
 * Каждое напоминание уходит один раз — в заказе и заявке ставится отметка.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Расписание не настроено" }, { status: 404 });
  if (request.nextUrl.searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "Неверный ключ" }, { status: 403 });
  }
  if (!isMailConfigured()) {
    return NextResponse.json({ error: "Почта не настроена, напоминания не отправляются" }, { status: 409 });
  }

  const HOURS_BEFORE_PAYMENT_REMINDER = 24;
  let payments = 0;
  let seminars = 0;

  for (const order of ordersAwaitingPayment(HOURS_BEFORE_PAYMENT_REMINDER)) {
    await sendPaymentReminder(order);
    markPaymentReminderSent(order.id);
    payments++;
  }

  for (const signup of signupsToRemind()) {
    const seminar = getSeminarById(signup.seminarId);
    await sendSeminarReminder(signup, seminar?.location);
    markSignupReminderSent(signup.id);
    seminars++;
  }

  console.log(`[CRON] напоминаний об оплате: ${payments}, о семинарах: ${seminars}`);
  return NextResponse.json({ ok: true, напоминанийОбОплате: payments, оСеминарах: seminars });
}

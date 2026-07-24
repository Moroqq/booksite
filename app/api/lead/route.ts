import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    console.log(`[LEAD] type=${type}`, JSON.stringify(data, null, 2));

    // TODO: подключить CRM (amoCRM, Bitrix24, Notion, Airtable и др.)
    // TODO: отправить email-уведомление (Nodemailer, Resend, SendGrid)
    // Пример: await sendToCRM({ type, ...data });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[LEAD] Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

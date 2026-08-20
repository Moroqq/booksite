import nodemailer, { type Transporter } from "nodemailer";

/**
 * Отправка писем через обычный почтовый ящик (SMTP).
 * Пока настройки не заданы, письма не отправляются, а только пишутся в журнал —
 * сайт при этом работает как обычно. Так выкладка не может «уронить» приём заказов.
 */

let cached: Transporter | null = null;

export function isMailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function transport(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (cached) return cached;

  const port = Number(process.env.SMTP_PORT || 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 — SSL, 587 — STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return cached;
}

function sender() {
  const address = process.env.MAIL_FROM || process.env.SMTP_USER || "";
  const name = process.env.MAIL_FROM_NAME || "Духовная звукотерапия";
  return `${name} <${address}>`;
}

/** Куда приходят уведомления администратору о новых заказах и заявках. */
export function adminRecipient() {
  return process.env.MAIL_TO_ADMIN || process.env.SMTP_USER || "";
}

export type Letter = { to: string; subject: string; heading: string; lines: string[]; footnote?: string };

/**
 * Письма читают люди 40+, часто с телефона: крупный шрифт, никакой вёрстки в колонки,
 * тёмный текст на белом. Одновременно шлём простой текстовый вариант — он выручает,
 * если почтовая программа не показывает оформление.
 */
function render(letter: Letter) {
  const paragraphs = letter.lines
    .map((line) => `<p style="margin:0 0 14px;font-size:17px;line-height:1.6;color:#1A1612;">${line}</p>`)
    .join("");

  const html = `<!doctype html>
<html lang="ru"><body style="margin:0;padding:24px;background:#F5F1EA;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px 24px;font-family:Arial,Helvetica,sans-serif;">
    <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;color:#1A1612;font-weight:normal;">${letter.heading}</h1>
    ${paragraphs}
    ${letter.footnote ? `<p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #E5DFD4;font-size:14px;line-height:1.6;color:#4A443C;">${letter.footnote}</p>` : ""}
    <p style="margin:22px 0 0;font-size:14px;color:#4A443C;">Институт духовной звукотерапии · zvukterap.ru</p>
  </div>
</body></html>`;

  const text = [letter.heading, "", ...letter.lines, letter.footnote || "", "", "zvukterap.ru"]
    .join("\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  return { html, text };
}

/** Никогда не роняет вызвавшее действие: заказ важнее письма. */
export async function sendLetter(letter: Letter) {
  const mailer = transport();
  if (!mailer || !letter.to) {
    console.log(`[MAIL] пропущено (почта не настроена): «${letter.subject}» → ${letter.to || "нет адреса"}`);
    return { sent: false };
  }

  try {
    const { html, text } = render(letter);
    await mailer.sendMail({ from: sender(), to: letter.to, subject: letter.subject, html, text });
    return { sent: true };
  } catch (error) {
    console.error(`[MAIL] не удалось отправить «${letter.subject}» на ${letter.to}:`, error);
    return { sent: false };
  }
}
